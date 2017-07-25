'use strict';

angular.module('paciente').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/mis-datos', {
      templateUrl: '/app_Angular/Paciente/views/datosDeControl.view.html'
    }).when('/centros', {
      templateUrl: '/app_Angular/Paciente/views/info.centros.view.html'
    }).when('/perfil', {
      templateUrl: '/app_Angular/Paciente/views/ver_perfil.view.html'
    }).when('/perfil/edit', {
      templateUrl: '/app_Angular/Paciente/views/editar_perfil.view.html'
    }).when('/fotoSeguimiento', {
      templateUrl: '/app_Angular/Paciente/views/fotoSeguimiento.view.html'
    });
  }
]);
