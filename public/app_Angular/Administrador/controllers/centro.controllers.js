'use strict';

angular.module('administrador').controller('CentroController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.centro = {};
    $scope.centro.redesSociales = [];
    $scope.newRed = {};

    $scope.inputType = 'password';  
  
    // Función para mostrar o esconder contraseña
    $scope.hideShowPassword = function(){
      if ($scope.inputType == 'password')
        $scope.inputType = 'text';
      else
        $scope.inputType = 'password';
    };

    $scope.create = function() {
      $http({
        method: 'POST',
        url: 'api/centro',
        data: $scope.centro
      }).then(function(response){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> ¡Centro creado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
        $location.path('/centro');
      }, function(errorResponse){
        //console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      });
    };

    var find = function(){
      $http({
        method: 'GET',
        url: '/api/centro'
      }).then(function(response){
        $scope.centros = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }
    find();

    $scope.initEdit = function () {
      $http({
        method: 'GET',
        url: 'api/centro/'+$routeParams.centroId,
      })
      .then(
        function(response){
          $scope.centro = response.data;
          console.log(response.data);
          console.log($scope.centro);
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    $scope.edit = function () {
      var centroForm = $scope.centro
     $http({
        method: 'PUT',
        url: 'api/centro/'+$routeParams.centroId,
        data: centroForm
      })
     .then(
        function(response){
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Información general del centro editada <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $location.path('/centro');
        },
        function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    $scope.goEditView = function(){
      $location.path('/centro/edit/'+$routeParams.centroId);
    }

    $scope.goCreateView = function(){
      $location.path('/centro/create');
    }

    $scope.putRed = function(){
      $scope.centro.redesSociales.push({nombre: $scope.newRed.nombre, link: $scope.newRed.link});
      $scope.newRed = {};
    }

    $scope.removeRed = function(red){
      for (var i in $scope.centro.redesSociales) {
            if ($scope.centro.redesSociales[i] === red) {
              $scope.centro.redesSociales.splice(i, 1);
            }
          }
    }
  }]);