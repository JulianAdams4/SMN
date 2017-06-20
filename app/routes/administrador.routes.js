'use strict';

var administrador = require('../controllers/administrador.controllers');

module.exports = function(app) {

  app.route('/')
    .get(administrador.inicio);

  app.route('/publico').get(function(req, res){
    res.render('publico');
  });

  app.route('/login').get(function(req, res){
      res.render('login');
  });
};
