'use strict';

var datosControl = require('../controllers/datosControl.controllers');

module.exports = function(app) {
  app.route('/api/datosControl/:datosControlId')
    .get(datosControl.read);

  app.param('datosControlId', datosControl.datosControlById);

  app.route('/api/datosControl')
    .post(datosControl.createDatosControl);
}


