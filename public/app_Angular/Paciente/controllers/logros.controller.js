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
    
    $scope.today = new Date();

    $scope.init = function(){
      /*
      $http({
        method: 'GET',
        url: '/api/centro'
      })
      .then(
        function(response){
          $scope.centros = response.data;
        }, 
        function(errorResponse){
          demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
        }
      )*/
      $scope.formularioEC = {};
      $scope.formularioEC.parametro = 'porcentajeGrasa';
      var anio = $scope.today.getFullYear();
      $scope.formularioEC.fin = new Date(anio, 11, 31);
      $scope.formularioEC.inicio = new Date(anio, 0, 1);
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
    $scope.labels = [
      'Ene', 'Feb', 'Mar', 'Abr', 
      'May', 'Jun', 'Jul', 'Ago',
      'Sep', 'Oct', 'Nov', 'Dic'
    ];
    $scope.parametros = [
      { "value":"talla", "label":"Talla" },
      { "value":"pesoActual", "label":"Peso actual" },
      { "value":"imc", "label":"IMC" },
      { "value":"porcentajeGrasa", "label":"Porcentaje de grasa" },
      { "value":"hombroMedida", "label":"Medida hombros" },
      { "value":"pechoMedida", "label":"Medida pecho" },
      { "value":"cinturaMedida", "label":"Medida cintura" },
      { "value":"abdomenMedida", "label":"Medida abdomen" },
      { "value":"caderaMedida", "label":"Medida cadera" },
      { "value":"espaldaMedida", "label":"Medida espalda" },
      { "value":"piernaMedida", "label":"Medida pierna" },
      { "value":"pantorillaMedida", "label":"Medida pantorrilla" },
      { "value":"bicepsMedida", "label":"Medida biceps" }
    ];
    $scope.series = [ "Año" ];
    $scope.datasetOverride = [
      { backgroundColor: 'transparent' }
    ];
    // Fake data
    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.options = {
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

    // ===================================

    $scope.submit = function(form){
      var url = '/api/cliente/parametro-en-rango';
      var dataToSend = { 
        'cliente': '0001', 
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
          $scope.series = ["2017"];
          $scope.data = [
            [0, 1, 0, 3, 0, 5, 0, 5, 0, 3, 0, 1]
          ];
          var defaultErrType = errorResponse.data.type || "danger";
          var defaultErrMessage = errorResponse.data.message || "Ha ocurrido un error y no se pudo obtener sus logros";
          demo.mostrarNotificacion( defaultErrType, defaultErrMessage);
        }
      );
    }


  }]);

