'use strict';

angular.module('paciente').controller('planNutricionalController',['$scope','$http','$sce',
  function($scope, $http, $sce){
    $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

    $scope.cargarPlanNutricional = function(){
      $http({
        method: 'GET',
        url: '/api/planNutricionalPacienteVigente'
      }).then(function(response){
        $scope.planNutricional = response.data;
        $scope.url = response.data.documento;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })

    }
  }
]);