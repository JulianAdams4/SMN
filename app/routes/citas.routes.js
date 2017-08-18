'use stric';

var cita = require('../controllers/citas.controllers');

module.exports = function(app){

  app.route('/api/cita')
    .get(cita.listCitas)
    .post(cita.createCita);
  app.route('/api/reservarCita/:citaId')
    .put(cita.reservarCita);
}
