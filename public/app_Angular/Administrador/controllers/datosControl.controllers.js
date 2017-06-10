'use strict';

angular.module('administrador').controller('DatosController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.idPaciente = '';
    $scope.idDatoControlEdit = ''
    $scope.datosControl = {};
    $scope.datosControl.datos = [];
    $scope.newParametro = {};

    $scope.find = function(){
      $scope.idPaciente = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente/' + $scope.idPaciente
      }).then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }

    // ==============================================

    $scope.initCreate = function () {
      $scope.datosControl.fechaDato = new Date();
    }


    $scope.putParametro = function(){
      $scope.datosControl.datos.push({nombreDato: $scope.newParametro.nombreDato, valorDato: $scope.newParametro.valorDato, unidadDato: $scope.newParametro.unidadDato});
      $scope.newParametro = {};
    }

    $scope.removeParametro = function(parametro){
      for (var i in $scope.datosControl.datos) {
            if ($scope.datosControl.datos[i] === parametro) {
              $scope.datosControl.datos.splice(i, 1);
            }
          }
    }

    $scope.create = function() {
      var data  = {
        idPaciente: $routeParams.idPaciente,
        fechaDato: $scope.datosControl.fechaDato,
        observaciones: $scope.datosControl.observaciones,
        datos: $scope.datosControl.datos
      }
      $http({
        method: 'POST',
        url: 'api/datosControlPaciente/' + $routeParams.idPaciente,
        data: data
      }).then(function(response){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> ¡Dato de control creado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
        $location.path('/pacientes/listDatosControl/' + $routeParams.idPaciente);
      }, function(errorResponse){
        //console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      });
    };

    $scope.initEdit = function () {
      $scope.idDatoControlEdit = $routeParams.datosControlId;
      $http({
        method: 'GET',
        url: '/api/datosControl/' + $scope.idDatoControlEdit
      })
      .then(
        function(response){
          $scope.datosControl.fechaDato = new Date(response.data.fechaDato);
          $scope.datosControl.observaciones = response.data.observaciones;
          $scope.datosControl.datos = response.data.datos;
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    $scope.edit = function () {
      var idToEdit = $scope.idDatoControlEdit;
      var dataFormEdit = $scope.datosControl
     $http({
        method: 'PUT',
        url: '/api/datosControl/' + idToEdit,
        data: dataFormEdit
      })
     .then(
        function(response){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Dato de Control editado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $location.path('/pacientes/listDatosControl/' + $routeParams.idPaciente);
        },
        function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    // ==============================================

    $scope.backToList = function() {
      $window.history.back();
    };

  }]);
