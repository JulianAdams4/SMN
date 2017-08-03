'use strict';

angular.module('administrador').controller('PaquetesController',['$scope','$http','$routeParams','$location','$window',
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


    $scope.create = function() {
      var ruta = document.getElementById("preview").src;
      var data  = {
        nombre: $scope.paquetesDieta.nombre,
        descripcion: $scope.paquetesDieta.descripcion,
        precio: $scope.paquetesDieta.precio,
        foto: ruta
      }
      if(esArchivoValido){
        $("div#divLoading").addClass('show');
        $http({
          method: 'POST',
          url: 'api/paquetesDieta/',
          data: data
        }).then(function(response){
          $('div#divLoading').removeClass('show');
          demo.mostrarNotificacion("success", "Paquete de Dieta creado exitosamente!");
          $scope.backToList();
        }, function(errorResponse){
          //console.log(errorResponse.data.message);
          $('div#divLoading').removeClass('show');
            demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        });
      }
      else{
        demo.mostrarNotificacion("danger", "No se escogió ninguna foto");
      }
    };

    $scope.initEdit = function () {
      $scope.idPaqueteDietaEdit = $routeParams.paqueteDietaId;
      $http({
        method: 'GET',
        url: '/api/paquetesDieta/' + $scope.idPaqueteDietaEdit
      })
      .then(
        function(response){
          $scope.paquetesDieta = response.data;
          $scope.paquetesDieta.nombre = response.data.nombre;
          $scope.paquetesDieta.descripcion= response.data.descripcion;
          $scope.paquetesDieta.precio=response.data.precio;
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    $scope.edit = function () {
      var idToEdit = $scope.idPaqueteDietaEdit;
      var data = {};
      if(cambioArchivo){//si se cambió la foto entonces se obtiene la nueva ruta
        $("div#divLoading").addClass('show');
        var ruta = document.getElementById("preview").src;
        data = {
         foto: ruta,
         nombre:$scope.paquetesDieta.nombre,
         descripcion: $scope.paquetesDieta.descripcion,
         precio: $scope.paquetesDieta.precio
       };
      }
      else{//si no se cambió la foto se envian todos los campos excepto el campo foto
        data = {
         nombre:$scope.paquetesDieta.nombre,
         descripcion: $scope.paquetesDieta.descripcion,
         precio: $scope.paquetesDieta.precio
       };
      }
      if(esArchivoValido){
        $http({
          method: 'PUT',
          url: '/api/paquetesDieta/' + idToEdit,
          data: data
        }).then(function(response){
          $('div#divLoading').removeClass('show');
          demo.mostrarNotificacion("success", "¡Paquete de Dieta editado exitosamente!");
          $scope.backToList();
        }, function(errorResponse){
          $('div#divLoading').removeClass('show');
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        });
      }
      else{
        demo.mostrarNotificacion("danger", "No se escogió ninguna foto");
      }
    }

    // ==============================================

    $scope.backToList = function() {
      $location.path('/paquetes-dieta');
    };
    // ==============================================
    $scope.goEditView = function(){
      $location.path('/paquetes-dieta/edit/'+$routeParams.paqueteDietaId);
    }

    $scope.goCreateView = function(){
      $location.path('/paquetes-dieta/create');
    }

    $scope.eliminar = function(paquetedieta){
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: 'Desea eliminar este paquete de dieta?',
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
              url: '/api/paquetesDieta/'+paquetedieta._id
            }).then(function(response){
              demo.showCustomNotification(
                'top',
                'right',
                '<h5> Paquete de Dieta eliminado <b>exitosamente</b>! </h5>',
                'success',
                'ti-check',
                3000
              );
              for (var i in $scope.paquetesDieta) {
                    if ($scope.paquetesDieta[i] === paquetedieta) {
                      $scope.paquetesDieta.splice(i, 1);
                    }
                  };
            },
            function(errorResponse){
              demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
            });
          }
        }
      });
    }
    // ==============================================
    $scope.selectFile = function (){
      cambioArchivo = true;//si se da click en seleccionar archivo es por que se cambió el archivo
      var formatosPermitidos= ['jpg', 'jpeg', 'png', 'gif',"JPG"];
      var archivo = document.getElementById("image_file").files[0];
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
              demo.mostrarNotificacion("danger", "Formato de imagen inválido");
            }
        };
        // lee el archivo seleccionado como url
        oReader.readAsDataURL(archivo);
      }
      else{
        esArchivoValido=false;
        demo.mostrarNotificacion("danger", "No se escogió ninguna foto");
      }
    }

  }]);
