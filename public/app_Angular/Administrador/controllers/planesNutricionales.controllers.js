'use strict';

angular.module('administrador').controller('PlanesController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.planesNutricionales = {};
    $scope.find = function(){
      $scope.idPaciente = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: 'api/planesNutricionalesPaciente/' + $scope.idPaciente
      }).then(function(response){
        $scope.planesNutricionales = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }
  }]);
