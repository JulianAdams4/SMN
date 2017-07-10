angular.module('administrador').controller('datosControlController',['$scope','$http',
  function($scope, $http){

    $scope.cargarDatosControl = function(){
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente'
      }).then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })

    }
  }
]);
