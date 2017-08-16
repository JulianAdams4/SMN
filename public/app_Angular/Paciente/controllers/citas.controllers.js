'use strict';

angular.module('paciente').controller('calendario.controller', ['$scope','$http','$compile','$timeout','uiCalendarConfig',
  function($scope,$http,$compile,$timeout,uiCalendarConfig){
     /* event source that contains custom events on the scope */
     $scope.citas = [];
     $scope.eventSources = [];
     $scope.init = function(){

       $http({
         method: 'GET',
         url: '/api/cita'
       }).then(function(response){
         $scope.citas = response.data;
         for(var i in $scope.citas){
           $scope.citas[i].start = new Date($scope.citas[i].start);
           $scope.citas[i].end = new Date($scope.citas[i].end);
         }
         $scope.eventSources.push($scope.citas);
       }, function(errorResponse){
         demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
       });

      $scope.eventSources = [$scope.citas];
     }



     /* alert on eventClick */
     $scope.alertOnEventClick = function( date, jsEvent, view){
      if(!date.estaOcupado){
        BootstrapDialog.alert('I want banana!');
      }
       console.log(date);
     };

     /* config object */
     $scope.uiConfig = {
       calendar:{
         editable: false,
         header:{
           left: 'prev,today,next',
           center: 'title',
           right: 'month,agendaWeek,listMonth'
         },
         eventClick: $scope.alertOnEventClick,
         defaultView: 'agendaWeek',
         allDaySlot: false,
         minTime: "09:00:00",
         maxTime: "19:00:00",
         hiddenDays: [0]
       }
     };

  }
]);
