'use strict';

var planNutricional = require('../controllers/planNutricional.controllers');

module.exports = function(app) {

  //Sprint 2 : Crud Plan nutricional
  app.route('/api/planesNutricionalesPaciente/:pacienteId')
    .get(planNutricional.planNutricionalByPaciente);

  app.route('/api/planesNutricionales')
    .post(planNutricional.createPlanNutricional);

  app.route('/api/planesNutricionales/:planNutricionalId')
    .put(planNutricional.editPlanNutricional);

};
