'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.idPacienteEdit = '';
    $scope.pacienteEdit = {};
    $scope.idPacienteDelete = '';

    $scope.create = function() {
      $http({
        method: 'POST',
        url: '/api/pacientes',
        data: $scope.paciente
      }).then(function(response){
        //$scope.pacientes.push(response.data);
        $location.path('pacientes');
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      });
    };

    $scope.find = function(){
      $http({
        method: 'GET',
        url: '/api/pacientes'
      }).then(function(response){
        $scope.pacientes = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
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
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
          /*demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ha ocurrido un <b>error</b> al obtener la informacion del paciente </h5>',
            'danger',
            'ti-close',
            3000
          );*/
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
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> ¡Paciente editado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $location.path("/pacientes")
        },
        function(errorResponse){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ocurrio un <b>error</b> al editar el paciente </h5>',
            'danger',
            'ti-close',
            3000
          );
        }
      );
    }

    $scope.delete = function (idPaciente) {
      var idPacienteDelete = idPaciente;
      console.log($scope.idPacienteDelete);
     $http({
        method: 'DELETE',
        url: '/api/pacientes/' + idPacienteDelete
      })
     .then(
        function(response){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> ¡Paciente eliminado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $location.path("/pacientes")
        },
        function(errorResponse){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ocurrio un <b>error</b> al editar el paciente </h5>',
            'danger',
            'ti-close',
            3000
          );
        }
      );
    }

  }]);
