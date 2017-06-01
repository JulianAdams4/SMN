'use strict';

angular.module('administrador').controller('DatosController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.isReady = false;
    $scope.idPaciente = '';
    $scope.datosControlForm = {};
    $scope.listaDatos = [
      {
        'nombreDato': "",
        'valorDato': "",
        'unidadDato': "%"
      }
    ];
    $scope.datosControl = [];
    $scope.idDatoControlEdit = '';
    $scope.datoControlEdit = {};

    $scope.find = function(){
      $scope.idPaciente = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente/' + $scope.idPaciente
      }).then(function(response){
        $scope.datosControl = response.data;
        $scope.isReady = true;
      }, function(errorResponse){
        console.log(errorResponse.data.message);
      })
    }

    // ==============================================

    $scope.initCreate = function () {
      $scope.datosControlForm.fechaDato = new Date();
    }


    $scope.agregarDato = function () {
      var lastElement = $scope.listaDatos[$scope.listaDatos.length-1];
      if ( lastElement && lastElement.nombreDato != '' ){
        $scope.nuevoDato = {
          'nombreDato': "",
          'valorDato': "",
          'unidadDato': "%"
        };
        $scope.listaDatos.push($scope.nuevoDato);
      }
      if ($scope.listaDatos.length == 0){
        $scope.nuevoDato = {
          'nombreDato': "",
          'valorDato': "",
          'unidadDato': "%"
        };
        $scope.listaDatos.push($scope.nuevoDato);
      }
    }


    $scope.removerDato = function($index){
      if ( $scope.listaDatos.length>1 ){
        $scope.listaDatos.splice($index, 1);
      }
    }

    $scope.create = function() {
      var data  = {
        idPaciente: $routeParams.idPaciente,
        fechaDato: $scope.datosControlForm.fechaDato,
        observaciones: $scope.datosControlForm.observaciones,
        datos: $scope.listaDatos
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
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ocurrio un <b>error</b> al guardar la informacion </h5>',
            'danger',
            'ti-close',
            3000
          );
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
          $scope.datoControlEdit.fechaDato = new Date(response.data.fechaDato);
          $scope.datoControlEdit.observaciones = response.data.observaciones;
          $scope.datoControlEdit.datos = response.data.datos;
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ha ocurrido un <b>error</b> al obtener la informacion del dato de control </h5>',
            'danger',
            'ti-close',
            3000
          );
        }
      );
    }

    $scope.agregarDatoEdit = function () {
      var lastElement = $scope.datoControlEdit.datos[$scope.datoControlEdit.datos.length-1];
      if ( lastElement && lastElement.nombreDato != '' ){
        $scope.nuevoDato = {
          'nombreDato': "",
          'valorDato': "",
          'unidadDato': "%"
        };
        $scope.datoControlEdit.datos.push($scope.nuevoDato);
      }
      if ($scope.datoControlEdit.datos.length == 0){
        $scope.nuevoDato = {
          'nombreDato': "",
          'valorDato': "",
          'unidadDato': "%"
        };
        $scope.datoControlEdit.datos.push($scope.nuevoDato);
      }
    }


    $scope.removerDatoEdit = function($index){
      if ( $scope.datoControlEdit.datos.length>1 ){
        $scope.datoControlEdit.datos.splice($index, 1);
      }
    }

    $scope.edit = function () {
      var idToEdit = $scope.idDatoControlEdit;
      var dataFormEdit = $scope.datoControlEdit
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
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ocurrio un <b>error</b> al editar el dato de control </h5>',
            'danger',
            'ti-close',
            3000
          );
        }
      );
    }

    // ==============================================

    $scope.backToList = function() {
      $window.history.back();
    };

  }]);
