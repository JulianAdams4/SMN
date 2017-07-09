'use strict';

angular.module('administrador').controller('PlanesController',['$scope','$http','$routeParams','$location','$window','$sce',
  function($scope, $http, $routeParams, $location, $window,$sce) {

    $scope.planesNutricionales = {};
    $scope.planNutricional = {};
    var esArchivoValido=true;
    var cambioArchivo=false;
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
        idPaciente:$scope.idPaciente,
        fechaDato:$scope.planNutricional.fechaDato
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
      cambioArchivo = true;//si se da click en seleccionar archivo es por que se cambió el archivo
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
      var data = {};
      if(cambioArchivo){//si se cambió el archivo entonces se obtiene la nueva ruta
        var ruta = document.getElementById("preview").src;
        data = {
         documento: ruta,
         fechaDato:$scope.planNutricional.fechaDato
       };
      }
      else{//si no se cambió el archivo se envian todos los campos excepto el canpo documento
        data = {
         fechaDato:$scope.planNutricional.fechaDato
       };
      }
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
        demo.mostrarNotificacion("danger", "No se escogió ningún documento");
      }
    }
    // ==============================================
    $scope.backToList = function() {
      $location.path('/pacientes/listPlanesNutricionales/'+$routeParams.idPaciente);
    };
    // ==============================================
    $scope.goEditView = function(){
      $location.path('/pacientes/listPlanesNutricionales/'+$routeParams.idPaciente+'/edit/'+$routeParams.planNutricionalId);
    }

    // ==============================================
    $scope.remove = function(planNutricional){
      //Modal de confirmar eliminación
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: 'Desea eliminar este Plan Nutricional?',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: 'No',
        btnOKLabel: 'Sí',
        btnOKClass: 'btn-warning',
        callback: function(result) {
          if(result) {
            $http({
              method: 'DELETE',
              url: '/api/planesNutricionales/'+planNutricional._id
            }).then(function(response){
              //Mensaje de éxito al eliminar plan nutricional
              demo.showCustomNotification(
                'top',
                'right',
                '<h5> Plan Nutricional eliminado <b>exitosamente</b>! </h5>',
                'success',
                'ti-check',
                3000
              );
              for (var i in $scope.planesNutricionales) {
                    if ($scope.planesNutricionales[i] === planNutricional) {
                      $scope.planesNutricionales.splice(i, 1);
                    }
                  };
            },
            function(errorResponse){
              demo.showCustomNotification(
                'top',
                'right',
                errorResponse.data.message,
                errorResponse.data.type,
                'ti-close',
                3000
              );
            });
          }
        }
      });


    }

    $scope.seleccionarVigente = function(planNutricional){
      //Modal de confirmar eliminación
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: '¿Desea seleccionar como vigente este Plan Nutricional?',
        type: BootstrapDialog.TYPE_WARNING,
        closable: true,
        draggable: true,
        btnCancelLabel: 'No',
        btnOKLabel: 'Sí',
        btnOKClass: 'btn-warning',
        callback: function(result) {
          if(result) {
            $http({
              method: 'PUT',
              url: '/api/planesNutricionales/vigente/'+planNutricional._id
            }).then(
              function(response){
                // Mensaje de éxito al eliminar plan nutricional
                demo.showCustomNotification(
                  'top',
                  'right',
                  '<h5> ¡Se ha seleccionado el Plan nutricional <b>exitosamente</b>! </h5>',
                  'success',
                  'ti-check',
                  3000
                );
                find();
              },
              function(errorResponse){
                demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
                console.clear();
              });
          }
        }
      });
    }


  }]);
