'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {
    var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
    var ctx = canvas.getContext('2d');

    var scores = [100,90,86,35,57,62,98];
    var width = 50;
    var currX = 50;
    var base = 200;

    ctx.fillStyle = 'green';

    for(var i =0; i < scores.length; i++){
        ctx.fillRect(currX,canvas.height - scores[i],width,scores[i]);
        currX += width + 10;
    }


    //(x,y,width, height)



/*    ctx.fillStyle = 'orange';
//(x,y,redius, startAngle, endAngle, antiClockwise)
    ctx.arc(300,100,80, 2 * Math.PI, false);
    ctx.fill();*/
}]);