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
          $scope.paciente.cedula = Number(response.data.cedula);
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
      var idToEdit = $scope.idPacienteEdit;
      var dataFormEdit = $scope.paciente
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

    $scope.verPaciente = function (idPaciente){
      $scope.idPacienteVer = idPaciente;
      $http({
        method: 'GET',
        url: '/api/pacientes/' + $scope.idPacienteVer
      })
      .then(
        function(response){
          $scope.paciente = response.data;
          console.log($scope.paciente);
          $scope.paciente.cedula = Number(response.data.cedula);
          $scope.paciente.fechaNacimiento = new Date(response.data.fechaNacimiento);
          BootstrapDialog.show({
              title: 'Información de Paciente',
              data: {
                'data1': $scope.paciente.cedula
            },
              message: function(dialog) {
                var $message = '<label>Cedula:</label>'
                               '<label>Nombres:</label>'
                               '<label>Apellidos: </label>'
                               '<label>Sexo:</label>'
                               '<label>Fecha de nacimiento: </label>'
                               '<label>Celular:</label>'
                               '<label>Ocupación: </label>'
                               '<label>Dirección: </label>'
                               '<label>Motivo de consulta:</label>';

                                //$('<label></label>').text($scope.paciente.cedula);

                return $message;
            }
          });
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

  }]);
