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
      if ( validarCedula( $scope.paciente.cedula ) ) {
        demo.mostrarNotificacion('danger', "El número de cécula del paciente no es válido");
      } 
      else {
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
          demo.showCustomNotification(
            'top',
            'right',
            'Paciente creado exitosamente',
            'success',
            'ti-check',
            3000
          );
          $location.path('pacientes');
        }, function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        });
      }
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

    function showBootstraDialog(message,messageSuccess,messageError,route,idPacienteDelete){
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: message,
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
              url: '/api/'+ route + idPacienteDelete
            }).then(function(response){
              demo.showCustomNotification(
                'top',
                'right',
                messageSuccess,
                'success',
                'ti-check',
                3000
              );
              find();
            },function(errorResponse){
              demo.mostrarNotificacion("danger", messageError);
            });
          }
        }
      });
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
      // Los checks con inputs se limpian si no estan marcados
      if ($scope.antecedente.alergia==false) {
          $scope.antecedente.descripcionAlergias = "";
      }
      if ($scope.antecedente.suplementoVitaminicos==false) {
          $scope.antecedente.descripcionSuplementos = "";
      }
      if ($scope.antecedente.medicamento==false) {
          $scope.antecedente.descripcionMedicamentos = "";
      }
      if ($scope.historiaAlimentaria.modificaFinesDeSemana==false) {
          $scope.antecedente.comidaFinesdeSemana = "";
      }
      if ($scope.historiaAlimentaria.comeEntreComidas==false) {
          $scope.antecedente.snacksEntreComidas = "";
      }
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
          var msj = '<h5> ¡Paciente editado <b>exitosamente</b>! </h5>';
          demo.showCustomNotification('top', 'right', msj, 'success', 'ti-check', 3000);
          $location.path("/pacientes")
        },
        function(errorResponse){
          var msj = errorResponse.data.message ? '<h5> '+errorResponse.data.message+' </h5>' : '<h5> Ocurrio un <b>error</b> al editar el paciente </h5>';
          demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
        }
      );
    }

    $scope.desactivarPaciente = function (idPaciente) {
      var idPacienteDelete = idPaciente;
      showBootstraDialog('Desea desactivar el paciente?',"Paciente desactivado exitosamente","Ocurrió un problema al desactivar al paciente","desactivarPaciente/",idPacienteDelete);
    }

    $scope.activarPaciente = function (idPaciente) {
      var idPacienteDelete = idPaciente;
      showBootstraDialog('Desea activar el paciente?',"Paciente activado exitosamente","Ocurrió un problema al activar al paciente","activarPaciente/",idPacienteDelete);
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
    // ==============================================
    $scope.returnCurrentDate=function (){
  		var today = new Date();
  		var dd = today.getDate();
  		var mm = today.getMonth()+1; //January is 0!
  		var yyyy = today.getFullYear();
      if(dd<10){
        dd='0'+dd
      }
  		if(mm<10){
        mm='0'+mm
  		}
  		return today = yyyy+'-'+mm+'-'+dd;
  	}
    // ===============================================
    function validarCedula( numeroCedula ) {
      /*  True == Fail validation  */
      var array = numeroCedula.split('');
      var num = array.length;

      if ( num != 10 ) {
          return true;
      } 
      else {
          var total = 0;
          var digito = (array[9]*1);

          for(var i=0; i < (num-1); i++ ){
              var mult = 0;
              if ( ( i%2 ) !== 0 ) {
                  total = total + ( array[i] * 1 );
              }
              else {
                  mult = array[i] * 2;
                  if ( mult > 9 )
                    total = total + ( mult - 9 );
                  else
                    total = total + mult;
              }
          }

          var decena = total / 10;
          decena = Math.floor( decena );
          decena = ( decena + 1 ) * 10;
          var final = ( decena - total );

          if ( ( final == 10 && digito === 0 ) || ( final == digito ) ) {
              return false;
          }
          else {
              return true;
          }
      } // else
    }

  }]);
