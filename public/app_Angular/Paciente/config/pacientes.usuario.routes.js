'use strict';

angular.module('paciente').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/', {
      templateUrl: '/app_Angular/Paciente/views/info.centros.paciente.view.html'
    }).when('/mis-datos', {
      templateUrl: '/app_Angular/Paciente/views/datosDeControl.view.html'
    }).when('/mi-plan', {
      templateUrl: '/app_Angular/Paciente/views/planNutricional.view.html'
    }).when('/centros', {
      templateUrl: '/app_Angular/Paciente/views/info.centros.paciente.view.html'
    }).when('/perfil', {
      templateUrl: '/app_Angular/Paciente/views/ver_perfil.view.html'
    }).when('/perfil/edit', {
      templateUrl: '/app_Angular/Paciente/views/editar_perfil.view.html'
    });
  }
]);
