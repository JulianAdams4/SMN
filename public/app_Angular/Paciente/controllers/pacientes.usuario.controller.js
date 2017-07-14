'use strict';

angular.module('paciente').controller('UsuarioController',['$scope','$http','$routeParams','$location',
  function($scope, $http, $routeParams, $location) {
    $scope.paciente = {};
    $scope.historiaAlimentaria = {};
    $scope.historiaAlimentaria.grupoAlimentos = [];
    $scope.newGrupo = {};

    $scope.initEdit = function () {
      $http({
        method: 'GET',
        url: '/api/pacientes/perfil'
      })
      .then(
        function(response){
          $scope.paciente = response.data;
          $scope.paciente.fechaNacimiento = new Date(response.data.fechaNacimiento);
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    $scope.edit = function () {
      // Se envian las 3 tabs
      var dataFormEdit = {
        paciente: $scope.paciente,
      };
      $http({
        method: 'PUT',
        url: '/api/pacientes/perfil',
        data: dataFormEdit
      })
      .then(
        function(response){
          var msj = '<h5> ¡Su perfil ha sido editado <b>exitosamente</b>! </h5>';
          demo.showCustomNotification('top', 'right', msj, 'success', 'ti-check', 3000);
          $location.path("/perfil")
        },
        function(errorResponse){
          var msj = errorResponse.data.message ? '<h5> '+errorResponse.data.message+' </h5>' : '<h5> Ocurrio un <b>error</b> al editar su perfil </h5>';
          demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
        }
      );
    }
    // ==============================================
    $scope.goEditView = function(){
      $location.path('/perfil/edit');
    }
  }]);
