'use strict';

angular.module('administrador').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/paquetes-dieta', {
      templateUrl: 'app_Angular/Administrador/views/list_paquetes_dieta.view.html'
    }).when('/paquetes-dieta/ver/:paqueteDietaId', {
      templateUrl: 'app_Angular/Administrador/views/ver_paquete_dieta.view.html'
    }).when('/paquetes-dieta/edit/:paqueteDietaId', {
      templateUrl: 'app_Angular/Administrador/views/editar_paquete_dieta.view.html'
    }).when('/paquetes-dieta/create', {
      templateUrl: 'app_Angular/Administrador/views/crear_paquete_dieta.view.html'
    });
  }
]);