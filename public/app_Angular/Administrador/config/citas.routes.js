'use strict';

angular.module('administrador').config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
    when('/citas', {
      templateUrl: 'app_Angular/Administrador/views/view_citas.view.html'
    });
  }
]);
