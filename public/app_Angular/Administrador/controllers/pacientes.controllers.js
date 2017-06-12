'use strict';

angular.module('administrador').controller('PacientesController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.idPacienteEdit = '';
    $scope.pacienteEdit = {};
    $scope.idPacienteDelete = '';
    $scope.antecedente = {};
    $scope.historiaAlimentaria = {};
    $scope.historiaAlimentaria.grupoAlimentos = [];
    $scope.newGrupo = {};

    $scope.create = function() {

      $http({
        method: 'POST',
        url: '/api/pacientes',
        data: $scope.paciente
      }).then(function(response){
        $scope.antecedente.idPaciente = response.data._id;
        $http({
          method: 'POST',
          url: '/api/antecedentes',
          data: $scope.antecedente
        }).then(function(response){
        }, function(errorResponse){
          demo.mostrarNotificacion('danger',errorResponse.data.message);
        });

        $scope.historiaAlimentaria.idPaciente = response.data._id;
        $http({
          method: 'POST',
          url: '/api/historiaAlimentaria',
          data: $scope.historiaAlimentaria
        }).then(function(response){
        }, function(errorResponse){
          console.log(errorResponse);
          demo.mostrarNotificacion('danger',errorResponse.data.message);
        });
        demo.mostrarNotificacion("success", "Paciente creado exitosamente!");
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
          $scope.paciente = response.data;
          $scope.paciente.fechaNacimiento = new Date(response.data.fechaNacimiento);
          $http({
            method: 'GET',
            url: '/api/historiaAlimentariaPaciente/' + $scope.idPacienteEdit
          }).then(
            function(response){
              $scope.historiaAlimentaria = response.data;
            }
          );
          $http({
            method: 'GET',
            url: '/api/antecedentesPaciente/' + $scope.idPacienteEdit
          }).then(
            function(response){
              $scope.antecedente = response.data;
            }
          );
          /*$scope.pacienteEdit.cedula = response.data.cedula;
          $scope.pacienteEdit.nombres = response.data.nombres;
          $scope.pacienteEdit.apellidos = response.data.apellidos;
          $scope.pacienteEdit.sexo = response.data.sexo;
          $scope.pacienteEdit.fechaNacimiento = new Date(response.data.fechaNacimiento);
          $scope.pacienteEdit.celular = response.data.celular;
          $scope.pacienteEdit.ocupacion = response.data.ocupacion;
          $scope.pacienteEdit.direccion = response.data.direccion;
          $scope.pacienteEdit.motivoConsulta = response.data.motivoConsulta;*/
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
      // Necesario para la ruta
      var idToEdit = $scope.idPacienteEdit;
      // Se envian las 3 tabs
      var dataFormEdit = {
        paciente: $scope.paciente,
        antecedente: $scope.antecedente,
        historia: $scope.historiaAlimentaria
      };
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
              demo.mostrarNotificacion("success", "Paciente desactivado exitosamente");
              find();
            },function(errorResponse){
              demo.mostrarNotificacion("danger", "Ocurrió un problema al desactivar al paciente");
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
                 demo.mostrarNotificacion("success", "Paciente activado exitosamente");
                 find();
               },
               function(errorResponse){
                 demo.mostrarNotificacion("danger", "Ocuurrió un problema al activar el paciente");
               }
             );
          }
        }
      });
    };

    $scope.putGrupoAlimentos = function(){
      $scope.historiaAlimentaria.grupoAlimentos.push({descripcion: $scope.newGrupo.descripcion, frecuencia: $scope.newGrupo.frecuencia, alimentosAgradan: $scope.newGrupo.alimentosAgradan, alimentosDesagradan: $scope.newGrupo.alimentosDesagradan});
      $scope.newGrupo = {};
    }

    $scope.removeGrupoAlimentos = function(grupo){
      for (var i in $scope.historiaAlimentaria.grupoAlimentos) {
            if ($scope.historiaAlimentaria.grupoAlimentos[i] === grupo) {
              $scope.historiaAlimentaria.grupoAlimentos.splice(i, 1);
            }
          }
    }
    // ==============================================
    $scope.goEditView = function(){
      $location.path('/pacientes/edit/'+$routeParams.idPaciente);
    }
  }]);
