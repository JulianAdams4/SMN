var mainAplicationModule = angular.module('administrador', ['ngRoute', 'datatables']);

mainAplicationModule.config(['$locationProvider',
  function($locationProvider){
    $locationProvider.hashPrefix('!');
  }
]);
mainAplicationModule.directive('validFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
          //change event is fired when file is selected
            el.bind('change',function(){
                    scope.$apply(function(){
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
            });
        }
    };
});
angular.element(document).ready(function() {
  angular.bootstrap(document, ['administrador']);
});
