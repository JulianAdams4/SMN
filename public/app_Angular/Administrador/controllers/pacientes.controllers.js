'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};

    $scope.create = function() {
      console.log($scope.paciente);
      $http({
        method: 'POST',
        url: '/api/pacientes',
        data: $scope.paciente
      }).then(function(response){
        //$scope.pacientes.push(response.data);
        $location.path('pacientes');
      }, function(errorResponse){
        console.log(error.Response.data.message);
      });
    };

    $scope.find = function(){
      $http({
        method: 'GET',
        url: '/api/pacientes'
      }).then(function(response){
        $scope.pacientes = response.data;
      }, function(errorResponse){
        console.log(errorResponse.data.message);
      })
    }

  }]);
