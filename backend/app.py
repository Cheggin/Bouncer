from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS # were probably gonna need this for some reason

from utils.background_check import rs

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

if __name__ == '__main__':
    app.run(debug=True)