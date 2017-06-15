'use strict';

angular.module('administrador').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/centro', {
      templateUrl: 'app_Angular/Administrador/views/list_centros.view.html'
    }).when('/centro/ver/:centroId', {
      templateUrl: 'app_Angular/Administrador/views/ver_centro.view.html'
    }).when('/centro/edit/:centroId', {
      templateUrl: 'app_Angular/Administrador/views/editar_centro.view.html'
    }).when('/centro/create', {
      templateUrl: 'app_Angular/Administrador/views/crear_centro.view.html'
    });
  }
]);