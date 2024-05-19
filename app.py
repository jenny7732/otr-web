from http import HTTPStatus
import json
from flask import Flask, render_template, request, jsonify
from TextToSpeech.synthesizer import synthesize

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('main.html')

@app.route('/synthesize', methods=['POST'])
def synthesize_sentence():
    sentence = request.form['sentence']
    synthesize(sentence)
    return jsonify({"status": HTTPStatus.OK,
                    "senetence": sentence, 
                    "message": "음성 합성 성공"})


if __name__ == '__main__':
    app.run()
