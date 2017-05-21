'use strict';

var administrador = require('../controllers/administrador.controllers');

module.exports = function(app) {
  app.route('/')
    .get(administrador.inicio);
};
