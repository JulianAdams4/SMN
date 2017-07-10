'use strict';

var datosControl = require('../controllers/datosControl.controllers');

module.exports = function(app) {
  app.route('/api/datosControl/:datosControlId')
    .get(datosControl.read)
    .put(datosControl.editDatosControl)
    .delete(datosControl.borrarDatoControlById);

  app.route('/api/datosControlPaciente/:pacienteId')
    .get(datosControl.datosControlByPaciente)
    .post(datosControl.createDatosControl);
  app.route('/api/datosControlPaciente')
    .get(datosControl.datosControlByPaciente);

  app.param('datosControlId', datosControl.datosControlById);

  app.route('/api/datosControl')
    .get(datosControl.list);
}
