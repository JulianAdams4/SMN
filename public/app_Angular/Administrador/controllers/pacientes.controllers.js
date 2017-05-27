'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.idPacienteEdit = '';
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
      $scope.idPacienteEdit = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: '/api/pacientes/' + $scope.idPacienteEdit
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
          alert("Ha ocurrido un error al obtener la informacion del paciente");
        }
      );
    }

    $scope.edit = function () {
      var idToEdit = $scope.idPacienteEdit;
      var dataFormEdit = $scope.pacienteEdit
     $http({
        method: 'PUT',
        url: '/api/pacientes/' + idToEdit,
        data: dataFormEdit
      })
     .then(
        function(response){
          alert("Editado con exito");
          $location.path("/pacientes")
        }, 
        function(errorResponse){
          alert("Ocurrio un error al editar el paciente");
        }
      );
    }

  }]);
