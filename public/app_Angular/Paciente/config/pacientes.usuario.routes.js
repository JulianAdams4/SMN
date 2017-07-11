'use strict';

angular.module('paciente').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/perfil', {
      templateUrl: '/app_Angular/Paciente/views/ver_perfil.view.html'
    }).when('/perfil/edit', {
      templateUrl: '/app_Angular/Paciente/views/editar_perfil.view.html'
    });
  }
]);