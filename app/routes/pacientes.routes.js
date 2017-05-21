'use strict';

var pacientes = require('../controllers/pacientes.controllers');

module.exports = function(app) {

  //Sprint 1 : Crear el controlador para consultar un paciente
  //CRUD para recibir el parámetro Id del pacienete
  //Autor: Stalyn Gonzabay
  app.route('/api/pacientes/:pacienteId')
    .get(pacientes.read)
    .delete(pacientes.deletePaciente);
  //Sprint 1 : Crear el controlador para consultar un paciente
  //Funcion que sirve para que cada vez que se realiza
  //una petición con un parametro pacienteId se verifique
  //primero que el paciente exista
  //Autor: Stalyn Gonzabay
  app.param('pacienteId', pacientes.pacienteById);

  app.route('/api/pacientes')
    .post(pacientes.createPaciente);
}
