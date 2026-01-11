from flask import Flask, render_template, request, jsonify, send_file
import pdfplumber
import os
# from flask_cors import CORS


app = Flask(__name__)

@app.route("/")
def render_html():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def extract_text():
    file = request.files.get("pdf_file")
    if not file:
        return jsonify({"message": "No file to extract text from"}), 500
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return jsonify({"extracted_text": text}), 200

@app.route("/assets/<id>")
def serve_assets(id):
    if not os.path.exists(f"./assets/{id}"):
        return jsonify({"message": "Path doesn't exist"}), 404
    return send_file(f"./assets/{id}")


if __name__ == "__main__":
    app.run(debug=True)