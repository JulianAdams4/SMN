var mainAplicationModuleName = 'administrador';

var mainAplicationModule = angular.module(mainAplicationModuleName, ['ngRoute']);

mainAplicationModule.config(['$locationProvider',
  function($locationProvider){
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainAplicationModuleName]);
});
