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
      if ( validarCedula($scope.centro.nutricionista.cedula) ) {
        demo.mostrarNotificacion('danger', "El número de cécula no es válido");
      } 
      else {
        $http({
          method: 'POST',
          url: 'api/centro',
          data: $scope.centro
        })
        .then(
        function(response){
            demo.showCustomNotification('top','right','<h5> ¡Centro creado <b>exitosamente</b>! </h5>','success','ti-check', 3000);
          $location.path('/centro');
        }, 
        function(errorResponse){
          var msj = '<h5> '+ errorResponse.data.message + ' </h5>';
          demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
        });

      }
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
      if ( validarCedula($scope.centro.nutricionista.cedula) ) {
        demo.mostrarNotificacion('danger', "El número de cécula no es válido");
      } 
      else {
        var centroForm = $scope.centro
        $http({
          method: 'PUT',
          url: 'api/centro/'+$routeParams.centroId,
          data: centroForm
        })
        .then(
        function(response){
          demo.showCustomNotification('top','right', '<h5> Información general del centro editada <b>exitosamente</b>! </h5>','success','ti-check',3000);
           $location.path('/centro');
         },
         function(errorResponse){
            var msj = '<h5> '+errorResponse.data.message+' </h5>';
            demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
         });
      }
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

    // ===============================================
    function validarCedula( numeroCedula ) {
      /*  True == Fail validation  */
      var array = numeroCedula.split('');
      var num = array.length;

      if ( num != 10 ) {
          return true;
      } 
      else {
          // Casos especiales
          if ( numeroCedula == '0000000000' || numeroCedula == '2222222222' || numeroCedula == '4444444444' || numeroCedula == '5555555555' || numeroCedula == '7777777777' || numeroCedula == '9999999999' ){
              return true;
          }

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
