var mainAplicationModule = angular.module('paciente', ['ngRoute', 'datatables', 'chart.js','ui.calendar','ui.bootstrap.datetimepicker']);

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
  angular.bootstrap(document, ['paciente']);
});
