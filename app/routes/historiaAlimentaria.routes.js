'use strict';

var historiaAlimentaria = require('../controllers/historiaAlimentaria.controllers');

module.exports = function(app) {
  app.route('/api/historiaAlimentaria')
    .post(historiaAlimentaria.createHistoriaAlimentaria)
    .get(historiaAlimentaria.list);

  app.route('/api/historiaAlimentariaPaciente/:pacienteId')
    .get(historiaAlimentaria.historiaAlimentariaByPaciente);
}
