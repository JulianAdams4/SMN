'use strict';

angular.module('administrador').controller('PlanesController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {

    $scope.planesNutricionales = {};
    $scope.planNutricional = {};
    var find = function(){
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
    find();
    // ==============================================
    $scope.initCreate = function () {
      $scope.planNutricional.fechaDato = new Date();
    }
    // ==============================================
    $scope.initEdit = function () {
      $scope.idPlanNutricionalEdit = $routeParams.planNutricionalId;
      $http({
        method: 'GET',
        url: '/api/planesNutricionales/' + $scope.idPlanNutricionalEdit
      })
      .then(
        function(response){
          $scope.planNutricional.fechaDato = new Date(response.data.fechaDato);
          $scope.planNutricional.documento=response.data.documento;
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Ha ocurrido un <b>error</b> al obtener la informacion del plan nutricional </h5>',
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
