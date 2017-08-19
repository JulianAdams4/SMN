'use strict';

angular.module('paciente')

// Configuration for charts
.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: [
      "#d70206", "#59922b", "#d17905", "#f4c63d", "#453d3f", "#f05b4f", "#0544d3", "#6b0392", "#f05b4f",
      "#d70206", "#59922b", "#d17905", "#f4c63d", "#453d3f", "#f05b4f", "#0544d3", "#6b0392", "#f05b4f",
      "#d70206", "#59922b", "#d17905", "#f4c63d", "#453d3f", "#f05b4f", "#0544d3", "#6b0392", "#f05b4f",
      "#d70206", "#59922b", "#d17905", "#f4c63d", "#453d3f", "#f05b4f", "#0544d3", "#6b0392", "#f05b4f",
      "#d70206", "#59922b", "#d17905", "#f4c63d"
    ],
    responsive: true
  });
}])

.controller('LogrosController',['$scope','$http','$routeParams','$location','$window',
  function($scope, $http, $routeParams, $location, $window) {

    $scope.suficientesDatos = true;
    $scope.currentDate  = new Date();
    $scope.Year  = $scope.currentDate.getFullYear();
    $scope.Month = $scope.currentDate.getMonth();
    $scope.Day   = $scope.currentDate.getDay();
    $scope.datosArray = [];
    
    $scope.parametros = [];
    
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }

    $scope.init = function(){
      $scope.getDatosPaciente();
    }

    $scope.getDatosPaciente = function () {
      var url = '/api/datosControlPaciente';
      $http({
        method: 'GET',
        url: url
      })
      .then(
        function(response){
          var datosPaciente = response.data;
          var listaParametros = [];
          
          if ( datosPaciente.length < 2 ) {
            $scope.suficientesDatos = false;
          } 
          else {
            $scope.suficientesDatos = true;
            for (var i = 0; i < datosPaciente.length; i++) {
              var datosArr = datosPaciente[i].datos;
              var fecha = datosPaciente[i].fechaDato;
              for (var j = 0; j < datosArr.length; j++) {
                var nombreDC = datosArr[j].nombreDato;
                var valorDC = datosArr[j].valorDato;
                var elem = {
                  "fecha": fecha,
                  "nombre": nombreDC.capitalize(),
                  "valor": valorDC
                }
                // Si el parametro no está en lista, se añade
                if( listaParametros.indexOf( nombreDC.capitalize() ) < 0 ){
                  listaParametros.push( nombreDC.capitalize() );
                }
                $scope.datosArray.push(elem);
              }
            }
            // Lista de string -> lista de objects
            for ( var z=0; z<listaParametros.length ; z++ ){
              var par = {
                "value": listaParametros[z].capitalize(),
                "label": listaParametros[z].capitalize()
              }
              $scope.parametros.push(par);
            }
            $scope.formularioEC = {};
            $scope.formularioEC.parametro = $scope.parametros[0].label;
            // Fechas del formulario 
            $scope.formularioEC.inicio = new Date($scope.Year,  0,  1);
            $scope.formularioEC.fin    = new Date($scope.Year, 11, 31);
          } // else ( >= 2 )
        }, 
        function(errorResponse){
          $scope.suficientesDatos = false;
          //console.log(errorResponse);
          // Fechas del formulario 
          $scope.formularioEC.inicio = new Date($scope.Year,  0,  1);
          $scope.formularioEC.fin    = new Date($scope.Year, 11, 31);
          var defaultErrType = errorResponse.data.type || "danger";
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se pudo obtener sus logros";
          demo.mostrarNotificacion( defaultErrType, defaultErrMessage );
        } // errorResponse
      );
    }

    $scope.resetChart = function(){
        $scope.series = [ "Año" ];
        $scope.data = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    // ===================================
    //   Variables del chart 
    // =================================== 
    $scope.series = [ "Año" ];
    $scope.labels = [
      'Ene', 'Feb', 'Mar', 'Abr', 
      'May', 'Jun', 'Jul', 'Ago',
      'Sep', 'Oct', 'Nov', 'Dic'
    ];

    $scope.datasetOverride = [
//      { backgroundColor: 'transparent' }
    ];
    // Fake data
    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.lineOptions = {
      legend: { display: true },
      scales: {
        xAxes: [
          { ticks: { maxRotation: 0, minRotation: 0 } }
        ],
        yAxes: [{ 
          type: 'linear', 
          display: true, 
          position: 'left', 
          ticks: { beginAtZero: true } 
        }]
      }
    };
    $scope.barOptions = {
      legend: { display: true },
      scales: {
        xAxes: [
          { ticks: { maxRotation: 0, minRotation: 0 } }
        ],
        yAxes: [
          { 
            type: 'linear', display: true, position: 'left', 
            ticks: { beginAtZero: true }, 
            stacked: true 
          }
        ]
      }
    };
    // ===================================

    $scope.submit = function(form){
      var url = '/api/datosControlPacienteRango';
      var dataToSend = {
        'inicio': $scope.formularioEC.inicio, 
        'fin': $scope.formularioEC.fin, 
        'parametro': $scope.formularioEC.parametro 
      };
      $http({
        method: 'POST',
        url: url,
        data: dataToSend
      })
      .then(
        function(response){
          $scope.series = response.data.series;
          $scope.data = response.data.data;
        }, 
        function(errorResponse){
          $scope.series = ["Año"];
          $scope.data = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          ];
          var defaultErrType = errorResponse.data.type || "danger";
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se pudo obtener sus logros";
          demo.mostrarNotificacion( defaultErrType, defaultErrMessage );
        }
      );
    }


  }]);

