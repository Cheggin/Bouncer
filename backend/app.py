from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS # were probably gonna need this for some reason

from utils.background_check import rs, face_search_formatted, deep_search, analyze_with_claude

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
        results = face_search_formatted(image_data)
        
        return jsonify({"results": results}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deep-search', methods=['POST'])
def deep_search_endpoint():
    """
    Comprehensive search endpoint that combines face search and text search,
    then provides detailed summaries of all found pages.
    
    Can accept:
    - Just text query (form data: 'text')
    - Just image (form data: 'image')
    - Both text and image
    """
    
    # Get text query if provided
    text_query = request.form.get('text', '').strip()
    
    # Get image data if provided
    image_data = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            # Check file type
            allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
            if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions:
                image_data = file.read()
            else:
                return jsonify({"error": "Invalid image file type. Supported formats: png, jpg, jpeg, gif, bmp, webp"}), 400
    
    # Validate that at least one search method is provided
    if not text_query and not image_data:
        return jsonify({"error": "Must provide either 'text' query or 'image' file (or both)"}), 400
    
    # Get optional parameters
    num_text_results = request.form.get('num_text_results', 10, type=int)
    if num_text_results > 20:  # Cap to prevent abuse
        num_text_results = 20
    
    try:
        # Perform comprehensive deep search
        results = deep_search(
            image_data=image_data,
            text_query=text_query if text_query else None,
            num_text_results=num_text_results
        )
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-summaries', methods=['POST'])
def analyze_summaries_endpoint():
    """
    Analyze deep search summaries using Claude Sonnet 4 based on user prompt.
    
    Expects JSON body with:
    - prompt: User's analysis question/request
    - summaries_data: JSON output from deep_search_endpoint
    """
    
    # Parse JSON body
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"error": "Request must include JSON body"}), 400
    
    # Validate required fields
    if "prompt" not in payload:
        return jsonify({"error": "Request JSON must include 'prompt' field"}), 400
    
    if "summaries_data" not in payload:
        return jsonify({"error": "Request JSON must include 'summaries_data' field"}), 400
    
    prompt = payload["prompt"].strip()
    summaries_data = payload["summaries_data"]
    
    if not prompt:
        return jsonify({"error": "Prompt cannot be empty"}), 400
    
    # Validate summaries_data structure
    if not isinstance(summaries_data, dict) or "summaries" not in summaries_data:
        return jsonify({"error": "summaries_data must be a valid deep search result object"}), 400
    
    try:
        # Analyze with Claude
        analysis = analyze_with_claude(prompt, summaries_data)
        
        # Return only the text response from Claude
        return analysis, 200, {'Content-Type': 'text/plain'}
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)