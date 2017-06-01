'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.idPacienteEdit = '';
    $scope.pacienteEdit = {};
    $scope.idPacienteDelete = '';
    $scope.antecedente = {};

    $scope.create = function() {
      $http({
        method: 'POST',
        url: '/api/pacientes',
        data: $scope.paciente
      }).then(function(response){
        console.log(response.data._id);
        $scope.antecedente.idPaciente = response.data._id;
        $http({
          method: 'POST',
          url: '/api/antecedentes',
          data: $scope.antecedente
        }).then(function(response){
        }, function(errorResponse){
          demo.mostrarNotificacion('danger',errorResponse.data.message);
        })
        $location.path('pacientes');
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      });
    };

    var find = function(){
      $http({
        method: 'GET',
        url: '/api/pacientes'
      }).then(function(response){
        $scope.pacientes = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }
    find();
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

    $scope.desactivarPaciente = function (idPaciente) {
      var idPacienteDelete = idPaciente;
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: 'Desea desactivar el paciente?',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: 'No',
        btnOKLabel: 'Sí',
        btnOKClass: 'btn-warning',
        callback: function(result) {
          if(result) {
            $http({
              method: 'PUT',
              url: '/api/desactivarPaciente/' + idPacienteDelete
            }).then(function(response){
              demo.showCustomNotification(
                'top',
                'right',
                '<h5> ¡Paciente desactivado <b>exitosamente</b>! </h5>',
                'success',
                'ti-check',
                3000
              );
              find();
            },function(errorResponse){
              demo.showCustomNotification(
                'top',
                'right',
                '<h5> Ocurrio un <b>error</b> al desactivar el paciente </h5>',
                'danger',
                'ti-close',
                3000
              );
            });
          }
        }
      });
    }

    $scope.activarPaciente = function (idPaciente) {
      var idPacienteDelete = idPaciente;
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: 'Desea activar el paciente?',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: 'No',
        btnOKLabel: 'Sí',
        btnOKClass: 'btn-warning',
        callback: function(result) {
          if(result) {
            $http({
               method: 'PUT',
               url: '/api/activarpaciente/' + idPacienteDelete
             })
            .then(
               function(response){
                 demo.showCustomNotification(
                   'top',
                   'right',
                   '<h5> ¡Paciente activado <b>exitosamente</b>! </h5>',
                   'success',
                   'ti-check',
                   3000
                 );
                 find();
               },
               function(errorResponse){
                 demo.showCustomNotification(
                   'top',
                   'right',
                   '<h5> Ocurrio un <b>error</b> al activar el paciente </h5>',
                   'danger',
                   'ti-close',
                   3000
                 );
               }
             );
          }
        }
      });
    }
  }]);
