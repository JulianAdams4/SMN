'use strict';

var antecedentes = require('../controllers/antecedentes.controllers');

module.exports = function(app) {
  app.route('/api/antecedentes')
    .post(antecedentes.createAntecedente)
    .get(antecedentes.list);

  app.route('/api/antecedentesPaciente/:pacienteId')
    .get(antecedentes.antecedentesByPaciente);
}
