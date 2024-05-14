from flask import Flask, render_template, request
from synthesize import synthesize_speech

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('main.html')

@app.route('/sentence', methods=['POST'])
def script():
    sentence = request.form['sentence']
    synthesize_speech(sentence)
    return sentence


if __name__ == '__main__':
    app.run()
