'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.pacienteEdit = {};

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

    $scope.initEdit = function () {
      var idPac = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: '/api/pacientes/' + idPac
      })
      .then(
        function(response){
          $scope.pacienteEdit.cedula = response.data.cedula;
          $scope.pacienteEdit.nombres = response.data.nombres;
          $scope.pacienteEdit.apellidos = response.data.apellidos;
          $scope.pacienteEdit.sexo = response.data.sexo;
          $scope.pacienteEdit.fechaNacimiento = new Date(response.data.fechaNacimiento);
          $scope.pacienteEdit.celular = response.data.celular;
          $scope.pacienteEdit.ocupacion = response.data.ocupacion;
          $scope.pacienteEdit.direccion = response.data.direccion;
          $scope.pacienteEdit.motivoConsulta = response.data.motivoConsulta;
        }, 
        function(errorResponse){
          console.log(errorResponse.data.message);
        }
      );
    }

    $scope.edit = function () {
      console.log("Guardar los datos de editado");
      var dataFormEdit = $scope.pacienteEdit
      console.log(dataFormEdit);
    }

  }]);
