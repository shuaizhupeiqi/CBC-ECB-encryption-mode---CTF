from flask import Flask, render_template, request, redirect, url_for
from Crypto.Cipher import AES
import binascii
from Crypto.Util.Padding import pad
from Crypto.Util.Padding import unpad
from flask import flash
import logging

app = Flask(__name__)

def aes_ecb_encrypt(key, data):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_data = pad(data, AES.block_size)
    encrypted = cipher.encrypt(padded_data)
    return binascii.hexlify(encrypted).decode()

def aes_ecb_decrypt(key, encrypted):
    cipher = AES.new(key, AES.MODE_ECB)
    decrypted_data = cipher.decrypt(binascii.unhexlify(encrypted))
    return unpad(decrypted_data, AES.block_size).decode()

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':

        key = b'aaaaaaaaaaaaaaaa'
        if request.cookies.get('is_admin'):
            is_admin = request.cookies.get('is_admin')
            test = aes_ecb_decrypt(key, is_admin)
            if test == '1':  
                flag = 'flag{testforecbvulnerability} '
                return render_template('login.html', flag=flag)
            return render_template('login.html', flag="flag")

        elif request.form['username'] == 'admin' and request.form['password'] == 'admin':
            flag = 'flag{} '
            return render_template('login.html', flag=flag)

        else:
            error = 'Display the flag when the string is_admin quals 1  ---  Your cookie/session is: '
            key = b'aaaaaaaaaaaaaaaa'
            data = request.form['username'].encode() + request.form['password'].encode()  # Two blocks of plaintext
            encrypted = aes_ecb_encrypt(key, data)

            return render_template('login.html', error=error + encrypted)
    return render_template('login.html') 


@app.route('/home')
def home():
    return render_template('home.html')

if __name__ == "__main__":
    #app.run(host='0.0.0.0', debug=True,port=5001)
    app.run(host='0.0.0.0',debug=True,port=5001)

