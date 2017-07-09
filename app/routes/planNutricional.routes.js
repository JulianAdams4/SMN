'use strict';

var planNutricional = require('../controllers/planNutricional.controllers');

module.exports = function(app) {

  /*Sprint 2 : Crud Plan nutricional
    Autores: Joyce Benitez - Iván Mosquera*/
  app.route('/api/planesNutricionalesPaciente/:pacienteId')
    .get(planNutricional.planNutricionalByPaciente);

  app.route('/api/planesNutricionales')
    .post(planNutricional.createPlanNutricional);

  app.route('/api/planesNutricionales/:planNutricionalId')
    .get(planNutricional.read)
    .put(planNutricional.editPlanNutricional)
    .delete(planNutricional.deletePlanNutricional);

  /* Sprint 2: Seleccionar plan vigente 
     Autor: Julián Adams */
  app.route('/api/planesNutricionales/vigente/:planNutricionalId')
    .put(planNutricional.fijarPlanVigente);

  app.param('planNutricionalId', planNutricional.planNutricionalById);
};
