'use strict';
var CryptoJS = require("crypto-js");
var config = require('../../config/config');

var codigoSecretoCrypto = 'ÉsteEsMiOtraClaveSecretaNoLeDiganANadieD:'

module.exports = {
	encriptar: function(password){
		var ciphertext = CryptoJS.AES.encrypt(password, codigoSecretoCrypto);
		return ciphertext;
	},

	desencriptar: function(token){
		var bytes  = CryptoJS.AES.decrypt(token, codigoSecretoCrypto);
		var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
		return decryptedData;
	}
}
