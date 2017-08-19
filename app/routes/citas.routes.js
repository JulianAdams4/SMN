'use stric';

var cita = require('../controllers/citas.controllers');

module.exports = function(app){

  app.route('/api/cita')
    .get(cita.listCitas)
    .post(cita.createCita);
  
  app.route('/api/cita/:citaId')
    .delete(cita.eliminarCita);

  app.route('/api/cancelarCitaPaciente/:citaId')
  	.put(cita.cancelarCita);

  app.route('/api/reservarCita/:citaId')
    .put(cita.reservarCita);
}
