'use strict';

var centro = require('../controllers/centro.controllers');

module.exports = function(app) {

  app.route('/api/centro')
    .get(centro.list)
    .post(centro.createCentro);

  app.route('/api/centro/:centroId')
    .get(centro.read)
    .put(centro.editCentro)
    .delete(centro.borrarCentroById);

  app.param('centroId', centro.centroById);

};