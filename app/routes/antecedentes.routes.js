'use strict';

var antecedentes = require('../controllers/antecedentes.controllers');

module.exports = function(app) {
  app.route('/api/antecedentes')
    .get(antecedentes.list);

  app.route('/api/antecedentesPaciente/:pacienteId')
    .get(antecedentes.antecedentesByPaciente);

  app.route('/api/antecedentes/:antecedenteId')
    .delete(antecedentes.deleteAntecedente);
}
