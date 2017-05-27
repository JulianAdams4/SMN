'use strict';

angular.module('administrador').controller('DatosController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.datosControl = {};

    $scope.create = function() {
      console.log($scope.datosControl);
      $http({
        method: 'POST',
        url: 'api/datosControlPaciente/:pacienteId',
        data: $scope.datosControl
      }).then(function(response){
        //$scope.pacientes.push(response.data);
        $location.path('datosControlPaciente/:pacienteId');
      }, function(errorResponse){
        console.log(error.Response.data.message);
      });
    };

    $scope.find = function(){
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente/:pacienteId'
      }).then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        console.log(errorResponse.data.message);
      })
    }
  }]);
