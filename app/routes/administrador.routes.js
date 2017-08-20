'use strict';

var administrador = require('../controllers/administrador.controllers');

module.exports = function(app) {

  app.route('/administrador').get(administrador.inicio);
      //res.render('login');

  app.route('/api/pacienteLogin2')
  .post(administrador.iniciarSesion);
    
  app.route('/publico').get(function(req, res){
    res.render('publico');
  });

  app.route('/login').get(function(req, res){
      res.render('login');
  });
  app.route('/paciente').get(function(req, res){
      res.render('paciente');
  });

  app.route('/api/administradorLogout')
    .get(administrador.signOut);
};
