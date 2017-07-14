'use strict';

angular.module('paciente').controller('CentroController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {

    var find = function(){
      $http({
        method: 'GET',
        url: '/api/centro'
      }).then(function(response){
        $scope.centros = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }
    find();

  }]);

