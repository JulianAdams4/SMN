'use strict';

angular.module('publico').controller('PaquetesController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.idPaqueteDietaEdit = '';
    $scope.paquetesDieta = {};
    var cambioArchivo=false;
    var esArchivoValido=true;

    $scope.find = function(){
      $http({
        method: 'GET',
        url: 'api/paquetesDieta/'
      }).then(function(response){
        $scope.paquetesDieta = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }
  }]);
