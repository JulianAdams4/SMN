'use strict';

angular.module('administrador').controller('PlanesController',['$scope','$http','$routeParams','$location','$window','$sce',
  function($scope, $http, $routeParams, $location, $window,$sce) {

    $scope.planesNutricionales = {};
    $scope.planNutricional = {};
    var esArchivoValido=true;
    // ==============================================
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
    $scope.create = function() {
      var ruta = document.getElementById("preview").src;
      var data = {
        documento: ruta,
        idPaciente:$scope.idPaciente
      };
      if(esArchivoValido){
        $http({
          method: 'POST',
          url: '/api/planesNutricionales',
          data: data
        }).then(function(response){
          demo.mostrarNotificacion("success", "¡Plan nutricional creado exitosamente!");
          $scope.backToList();
        }, function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        });
      }
      else{
        demo.mostrarNotificacion("danger", "No se escogió ningún archivo");
      }
    }
    // ==============================================
    $scope.selectFile = function (){
      var formatosPermitidos= ["pdf"];
      var archivo = document.getElementById("file").files[0];
      if(archivo!=undefined){
        var nombreArchivo = archivo.name;
        //se extrae la extensión del archivo
        var extArchivo = nombreArchivo.split('.').pop();
        var vistaArchivo = document.getElementById('preview');
        // preparación HTML5 FileReader
        var oReader = new FileReader();
        oReader.onload = function(e) {
            if ($.inArray(extArchivo,formatosPermitidos) > -1) {
              esArchivoValido=true;
              // e.target.result contiene el url del archivo
              vistaArchivo.src = e.target.result;
            }
            else {
              esArchivoValido=false;
              demo.mostrarNotificacion("danger", "Formato inválido,sólo pfd");
            }
        };
        // lee el archivo seleccionado como url
        oReader.readAsDataURL(archivo);
      }
      else{
        esArchivoValido=false;
        demo.mostrarNotificacion("danger", "No se escojio ningún documento");
      }
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
          $scope.planNutricional.documento=$sce.trustAsResourceUrl(response.data.documento);
        },
        function(errorResponse){
          demo.mostrarNotificacion("danger", "Ha ocurrido al obtener la información del plan nutricional");
        }
      );
    }
    // ==============================================
    $scope.edit = function () {
      var ruta = document.getElementById("preview").src;
      var data = {
        documento: ruta,
        idPaciente:$scope.idPaciente
      };
      if(esArchivoValido){
        $http({
          method: 'PUT',
          url: '/api/planesNutricionales/'+$routeParams.planNutricionalId,
          data: data
        }).then(function(response){
          demo.mostrarNotificacion("success", "¡Plan nutricional editado exitosamente!");
          $scope.backToList();
        }, function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        });
      }
      else{
        demo.mostrarNotificacion("danger", "No se escogió ningún archivo");
      }
    }
    // ==============================================
    $scope.backToList = function() {
      $location.path('/pacientes/listPlanesNutricionales/'+$routeParams.idPaciente);
    };
  }]);
