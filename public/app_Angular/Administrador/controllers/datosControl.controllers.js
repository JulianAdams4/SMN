'use strict';

angular.module('administrador').controller('DatosController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {
    $scope.idPaciente = '';
    $scope.idDatoControlEdit = '';
    $scope.datosControl = {};
    $scope.datosControl.datos = [];
    $scope.newParametro = {};
    var cambioArchivo=false;
    var esArchivoValido=true;

    $scope.find = function(){
      $scope.idPaciente = $routeParams.idPaciente;
      $http({
        method: 'GET',
        url: 'api/datosControlPaciente/' + $scope.idPaciente
      }).then(function(response){
        $scope.datosControl = response.data;
      }, function(errorResponse){
        demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
      })
    }

    // ==============================================

    $scope.initCreate = function () {
      $scope.datosControl.fechaDato = new Date();
    }

    // ==============================================

    $scope.putParametro = function(){
      $scope.datosControl.datos.push({nombreDato: $scope.newParametro.nombreDato, valorDato: $scope.newParametro.valorDato, unidadDato: $scope.newParametro.unidadDato});
      $scope.newParametro = {};
    }

    $scope.removeParametro = function(parametro){
      for (var i in $scope.datosControl.datos) {
            if ($scope.datosControl.datos[i] === parametro) {
              $scope.datosControl.datos.splice(i, 1);
            }
          }
    }

    // ==============================================

    $scope.create = function() {
      var ruta = document.getElementById("preview").src;
      var data  = {
        idPaciente: $routeParams.idPaciente,
        fechaDato: $scope.datosControl.fechaDato,
        observaciones: $scope.datosControl.observaciones,
        datos: $scope.datosControl.datos,
        foto: ruta
      }
      console.log(data);
      if(esArchivoValido){
        $("div#divLoading").addClass('show');
        $http({
          method: 'POST',
          url: 'api/datosControlPaciente/' + $routeParams.idPaciente,
          data: data
        }).then(function(response){
          $('div#divLoading').removeClass('show');
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> ¡Datos de control creado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $scope.backToList();
        }, function(errorResponse){
            $('div#divLoading').removeClass('show');
            var msj = '<h5> '+errorResponse.data.message+' </h5>';
            demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
        });
      }
      else{
        demo.showCustomNotification('top', 'right', "No se escogió ninguna foto", 'danger', 'ti-close', 3000);
      }
    };

    // ==============================================

    $scope.initEdit = function () {
      $scope.idDatoControlEdit = $routeParams.datosControlId;
      $http({
        method: 'GET',
        url: '/api/datosControl/' + $scope.idDatoControlEdit
      })
      .then(
        function(response){
          $scope.datosControl=response.data;
          $scope.datosControl.fechaDato = new Date(response.data.fechaDato);
          $scope.datosControl.observaciones = response.data.observaciones;
          $scope.datosControl.datos = response.data.datos;
        },
        function(errorResponse){
          console.log(errorResponse.data.message);
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      );
    }

    // ==============================================

    $scope.edit = function () {
      var idToEdit = $scope.idDatoControlEdit;
      var data = {};
      if(cambioArchivo){//si se cambió la foto entonces se obtiene la nueva ruta
        $("div#divLoading").addClass('show');
        var ruta = document.getElementById("preview").src;
        data = {
         foto: ruta,
         fechaDato:$scope.datosControl.fechaDato,
         observaciones: $scope.datosControl.observaciones,
         datos: $scope.datosControl.datos
       };
      }
      else{//si no se cambió la foto se envian todos los campos excepto el campo foto
        data = {
         fechaDato:$scope.datosControl.fechaDato,
         observaciones: $scope.datosControl.observaciones,
         datos: $scope.datosControl.datos
       };
      }
      if(esArchivoValido){
        $http({
          method: 'PUT',
          url: '/api/datosControl/' + idToEdit,
          data: data
        }).then(function(response){
          $('div#divLoading').removeClass('show');
          demo.showCustomNotification(
            'top',
            'right',
            '<h5> Datos de control editado <b>exitosamente</b>! </h5>',
            'success',
            'ti-check',
            3000
          );
          $scope.backToList();
        }, function(errorResponse){
          $('div#divLoading').removeClass('show');
          var msj = '<h5> '+errorResponse.data.message+' </h5>' ;
          demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
        });
      }
      else{
        demo.showCustomNotification('top', 'right', "No se escogió ninguna foto", 'danger', 'ti-close', 3000);
      }
    }

    // ==============================================

    $scope.backToList = function() {
      $location.path('/pacientes/listDatosControl/'+$routeParams.idPaciente);
    };

    // ==============================================

    $scope.goEditView = function(){
      $location.path('/pacientes/listDatosControl/'+$routeParams.idPaciente+'/edit/'+$routeParams.datosControlId);
    }

    // ==============================================

    $scope.eliminar = function(datoControl){
      BootstrapDialog.confirm({
        title: 'ADVERTENCIA',
        message: 'Desea eliminar este dato de control?',
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
              url: '/api/datosControl/'+datoControl._id
            }).then(function(response){
              demo.showCustomNotification(
                'top',
                'right',
                '<h5> Datos de Control eliminado <b>exitosamente</b>! </h5>',
                'success',
                'ti-check',
                3000
              );
              for (var i in $scope.datosControl) {
                    if ($scope.datosControl[i] === datoControl) {
                      $scope.datosControl.splice(i, 1);
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
              demo.showCustomNotification('top', 'right',"Formato de imagen inválido", 'danger', 'ti-close', 3000);
            }
        };
        // lee el archivo seleccionado como url
        oReader.readAsDataURL(archivo);
      }
      else{
        esArchivoValido=false;
        demo.showCustomNotification('top', 'right',"No se escojio ninguna foto", 'danger', 'ti-close', 3000);
      }
    }

    $scope.returnCurrentDate=function (){
      var today = new Date();
      var dd = today.getDate()+7;
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10){
        dd='0'+dd
      }
      if(mm<10){
        mm='0'+mm
      }
      return today = yyyy+'-'+mm+'-'+dd;
    }
  }]);
