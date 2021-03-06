'use strict';

angular.module('administrador').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/', {
      templateUrl: 'app_Angular/Administrador/views/list_pacientes.view.html'
    }).when('/pacientes', {
      templateUrl: 'app_Angular/Administrador/views/list_pacientes.view.html'
    }).when('/pacientes/ver/:idPaciente', {
      templateUrl: 'app_Angular/Administrador/views/ver_paciente.view.html'
    }).when('/pacientes/create', {
      templateUrl: 'app_Angular/Administrador/views/crear_paciente.view.html'
    }).when('/pacientes/edit/:idPaciente', {
      templateUrl: 'app_Angular/Administrador/views/editar_paciente.view.html'
    }).when('/pacientes/listDatosControl/:idPaciente', {
      templateUrl: 'app_Angular/Administrador/views/list_datosControlPaciente.view.html'
    }).when('/pacientes/listDatosControl/:idPaciente/create', {
      templateUrl: 'app_Angular/Administrador/views/crear_datosControlPaciente.view.html'
    }).when('/pacientes/listDatosControl/:idPaciente/edit/:datosControlId', {
      templateUrl: 'app_Angular/Administrador/views/editar_datosControl.view.html'
    }).when('/pacientes/listPlanesNutricionales/:idPaciente', {
      templateUrl: 'app_Angular/Administrador/views/list_planesNutricionales.view.html'
    }).when('/pacientes/listPlanesNutricionales/:idPaciente/create', {
      templateUrl: 'app_Angular/Administrador/views/crear_planNutricional.view.html'
    }).when('/pacientes/listPlanesNutricionales/:idPaciente/edit/:planNutricionalId', {
      templateUrl: 'app_Angular/Administrador/views/editar_planNutricional.view.html'
    }).when('/pacientes/listDatosControl/:idPaciente/ver/:datosControlId', {
      templateUrl: 'app_Angular/Administrador/views/ver_datosControl.view.html'
    }).when('/pacientes/listPlanesNutricionales/:idPaciente/ver/:planNutricionalId', {
      templateUrl: 'app_Angular/Administrador/views/ver_planNutricional.view.html'});
  }
]);
