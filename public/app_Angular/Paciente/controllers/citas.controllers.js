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
         console.log(errorResponse);
         demo.mostrarNotificacion(errorResponse.data.type, errorResponse.data.message);
       });

      $scope.eventSources = [$scope.citas];
     }

    /* alert on eventClick */
    $scope.alertOnEventClick = function(cita){
      if(!cita.estaOcupado){
        BootstrapDialog.show({
          title: 'Cita Disponible',
          message: 'Al seleccionar esta opción reservará una cita con la nutricionista.',
          buttons: [{
            label: 'Reservar Cita',
            cssClass: 'btn-primary',
            action: function(dialogItself) {
              $http({
                method: 'PUT',
                url: '/api/reservarCita/'+cita._id
              }).then(function(response){
                for(var i in $scope.citas){
                  if($scope.citas[i]._id == response.data._id){
                    $scope.citas.splice(i, 1);
                  }
                }
                response.data.start = new Date(response.data.start);
                response.data.end = new Date(response.data.end);
                $scope.citas.push(response.data);
                dialogItself.close();
                demo.showCustomNotification(
                 'top',
                 'right',
                 '<h5> ¡Cita reservada <b>exitosamente</b>! </h5>',
                 'success',
                 'ti-check',
                 3000
               );
              }, function(errorResponse){
                dialogItself.close();
                var msj = '<h5> '+errorResponse.data.message+' </h5>';
                demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
             });
            }
          }]
        });
      }else if(cita.estaOcupado){ // Invariantes
        BootstrapDialog.show({
          title: 'Cita Programada',
          message: 'Al seleccionar esta opción cancelará su cita con la nutricionista.',
          buttons: [{
            label: 'Cancelar Cita',
            cssClass: 'btn-primary',
            action: function(dialogItself) {
              $http({
                method: 'PUT',
                url: '/api/cancelarCitaPaciente/'+cita._id
              }).then(function(response){
                for(var i in $scope.citas){
                  if($scope.citas[i]._id == response.data._id){
                    $scope.citas.splice(i, 1);
                  }
                }
                response.data.start = new Date(response.data.start);
                response.data.end = new Date(response.data.end);
                $scope.citas.push(response.data);
                dialogItself.close();
                demo.showCustomNotification(
                 'top',
                 'right',
                 '<h5> ¡Cita cancelada <b>exitosamente</b>! </h5>',
                 'success',
                 'ti-check',
                 3000
               );
              }, function(errorResponse){
                dialogItself.close();
                var msj = '<h5> '+errorResponse.data.message+' </h5>';
                demo.showCustomNotification('top', 'right', msj, 'danger', 'ti-close', 3000);
             });
            }
          }]
        });
      }
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
