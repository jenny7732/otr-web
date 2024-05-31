from http import HTTPStatus
import time
import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, send_file
from TextToSpeech.synthesizer import synthesize
from similarity import get_similarity_score
from intonnation_graph import plot_pitch


app = Flask(__name__)

UPLOAD_FOLDER = '/Users/user/otr-web/static/audio/userAudio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def hello_world():
    audio_url = request.args.get('audio_url')
    sentence = request.args.get('sentence')
    return render_template('main.html', audio_url = audio_url, sentence=sentence)

@app.route('/synthesize', methods=['POST'])
def synthesize_sentence():
    sentence = request.form['sentence']
    audio_url = synthesize(sentence)

    return redirect(url_for('hello_world', audio_url = audio_url, sentence=sentence))

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'audio' not in request.files:
        return jsonify({"message": "No audio part"}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({"message": "File successfully uploaded", "file_path": file_path}), 200
    

@app.route('/similarity', methods=['GET'])
def get_similarity_score_route():
    audio_url = request.args.get('audio_url')
    file_path = request.args.get('file_path')

    if not audio_url or not file_path:
        return jsonify({"error": "Missing audio_url or file_path"}), 400

    try:
        similarity_score = get_similarity_score(audio_url, file_path)
        image_path = plot_pitch(audio_url, file_path)
        return jsonify({"similarity": similarity_score, "imagePath": image_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
