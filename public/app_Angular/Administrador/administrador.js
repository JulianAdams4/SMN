var mainAplicationModule = angular.module('administrador', ['ngRoute', 'datatables']);

mainAplicationModule.config(['$locationProvider',
  function($locationProvider){
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['administrador']);
});
