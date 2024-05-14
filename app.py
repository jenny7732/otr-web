from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('main.html')

@app.route('/sentence', methods=['POST'])
def script():
    sentence = request.form['sentence']
    return sentence


if __name__ == '__main__':
    app.run()
