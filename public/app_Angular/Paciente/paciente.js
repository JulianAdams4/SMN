var mainAplicationModule = angular.module('paciente', ['ngRoute', 'datatables']);

mainAplicationModule.config(['$locationProvider',
  function($locationProvider){
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['paciente']);
});
