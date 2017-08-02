'use strict';

angular.module('administrador').controller('calendario.controller', ['$scope','$http','$compile','$timeout','uiCalendarConfig',
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

     $scope.guardarCita = function(cita){

       $http({
         method: 'POST',
         url: '/api/cita',
         data: cita
       }).then(function(response){
         demo.showCustomNotification(
           'top',
           'right',
           '<h5> ¡Cita creada <b>exitosamente</b>! </h5>',
           'success',
           'ti-check',
           3000
         );
         response.data.start = new Date(response.data.start);
         response.data.end = new Date(response.data.end);
         $scope.citas.push(response.data);
         cita.start = '';
         cita.estaOcupado = '';
         cita.duracion = '';
       }, function(errorResponse){
         demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
       })


     }

     /* alert on eventClick */
     $scope.alertOnEventClick = function( date, jsEvent, view){
       console.log(date);
         $scope.alertMessage = (date.title + ' was clicked ');
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

     /* event sources array*/


    $scope.DateBeforeRender = function($view, $dates) {

        var activeDate = moment(new Date()).subtract(1, $view).add(1, 'minute');

        $dates.filter(function (date) {
          return date.localDateValue() <= activeDate.valueOf()
        }).forEach(function (date) {
          date.selectable = false;
        })
    }

  }
]);