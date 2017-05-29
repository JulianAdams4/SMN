'use strict';

angular.module('administrador').controller('DatosController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.idPaciente = '';
    $scope.datosControlForm = {};
    $scope.datosControl = [];

    $scope.find = function(){
      $scope.idPaciente = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente/' + $scope.idPaciente
      }).then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        console.log(errorResponse.data.message);
      })
    }

    $scope.initCreate = function () {
      $scope.datosControlForm.fechaDato = new Date();
    }

    $scope.agregarCampos = function () {
      console.log("Agregado.")
    }

    $scope.create = function() {
      console.log($scope.datosControlForm);
      $http({
        method: 'POST',
        url: 'api/datosControlPaciente/' + $scope.idPaciente,
        data: $scope.datosControlForm
      }).then(function(response){
        //$scope.pacientes.push(response.data);
        $location.path('datosControlPaciente/' + $scope.idPaciente);
      }, function(errorResponse){
        console.log(errorResponse.data.message);
      });
    };

    $scope.backToList = function() {
      $window.history.back();
    };

  }]);
