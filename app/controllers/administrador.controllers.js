'use strict';

var validador = require('../validators/validador');
var mongoose = require('mongoose');
var Administrador = mongoose.model('Centro');
var crypto = require('../services/crypto.js');

exports.inicio = function(req, res){
  //res.render('administrador');     //DESCOMENTAR PARA RENDERIZAR ADMINISTRADOR PARA PRUEBAS
  if(!req.session.administrador){
    res.render('login');
  } else {
    res.render('administrador');
  }
};

exports.iniciarSesion = function(req, res){
  var administradorIn = req.body;
  Administrador.findOne({"nutricionista.cedula" : administradorIn.cedula }, function(err, administrador){
    if(err){
      return res.status(500).send({
        message: getErrorMessage(err),
        type: 'danger'
      })
    }
    if(!administrador){
      return res.status(400).send({
        message: 'Usuario no se encuentra registrado'
      })
    }
    if(administradorIn.password === administrador.nutricionista.password){
      req.session.administrador = administrador;
      res.render('administrador');
      return res.status(200).send({
        message: 'Autenticación exitosa'
      })
    } else {
      return res.status(404).send({
        message: 'Contraseña incorrecta'
      })
    }
  });
};

exports.signOut =function(req, res){
  delete req.session.administrador;
  req.session.destroy(function(err) {
  // cannot access session here 
})
  res.redirect('/');
};

