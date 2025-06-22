from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS # were probably gonna need this for some reason

from utils.background_check import rs, face_search

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Bouncer API"})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/rs', methods=['POST'])
def rs_query():
    # 1. parse & validate JSON body
    payload = request.get_json(silent=True)
    if not payload or "text" not in payload:
        return jsonify({"error": "Request JSON must include 'text'"}), 400

    text = payload["text"]
    num_results = payload.get("num_results", 10)

    try:
        # 2. call your background_check.rs function
        results = rs(text, num_results=num_results)

        # 3. wrap in a top-level key if you like
        return jsonify({"results": results}), 200

        # —— OR, if you really want to stream line-delimited JSON:
        # def generate():
        #     for item in rs(text, num_results=num_results):
        #         yield json.dumps(item) + "\n"
        # return Response(stream_with_context(generate()),
        #                 mimetype="application/x-ndjson")
    except Exception as e:
        # 4. catch HTTP-errors from requests or whatever
        return jsonify({"error": str(e)}), 500

@app.route('/face-search', methods=['POST'])
def face_search_query():
    # Check if an image file was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "Request must include an image file with key 'image'"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No image file selected"}), 400
    
    # Check file type (optional but recommended)
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
    if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
        return jsonify({"error": "Invalid file type. Supported formats: png, jpg, jpeg, gif, bmp, webp"}), 400
    
    try:
        # Read the image data
        image_data = file.read()
        
        # Perform face search (always returns top 3 most similar results)
        results = face_search(image_data)
        
        return jsonify({"results": results}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)