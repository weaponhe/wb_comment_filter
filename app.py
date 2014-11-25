# -*- coding: utf-8 -*-
from flask import Flask
from flask import request

import urllib  
import base64

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
     return app.send_static_file('index.html')

@app.route('/getimg', methods=['GET','POST'])
def signin_form():
    url = request.args.get('url', '')
    # path = "b.jpg"
    data = urllib.urlopen(url).read()
    # f = file(path,"wb")  
    # f.write(data)  
    # f.close()
    # return '<img style="display:none;" id="id_image" src="data:image/png;base64,'+base64.b64encode(data)+'" />'
    return "data:image/png;base64,"+base64.b64encode(data)

if __name__ == '__main__':
    app.run()