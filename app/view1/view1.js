'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

  var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
    console.log($);
    console.log(canvas);
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'green';

  //(x,y,width, height)
  ctx.fillRect(0,0,200,100);


    ctx.fillStyle = 'orange';
//(x,y,redius, startAngle, endAngle, antiClockwise)
  ctx.arc(300,100,80, 2 * Math.PI, false);
  ctx.fill();

}]);