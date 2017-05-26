'use strict';

var antecedentes = require('../controllers/antecedentes.controllers');

module.exports = function(app) {
  app.route('/api/antecedentes')
    .post(antecedentes.createAntecedente);
  app.route('/api/antecedentes')
    .get(antecedentes.list);
}
