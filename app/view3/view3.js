/**
 * Created by tim on 3/8/17.
 */

'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'view3Ctrl'
        });
    }])

    .controller('view3Ctrl', [function () {

        var canvas = $('#testCanvas3')[0];//document.getElementById('testCanvas');
        var ctx = canvas.getContext('2d');

        var scores = [70, 52, 86, 100, 57, 62, 98];
        var width = 50;
        var currX = 50;
        var spacing = 2;
        var base = 200;

        ctx.fillStyle = '#d8838e';

        var i;
        var l = scores.length;
        for (i = 0; i < l; i++) {
            if(i ===3){
                ctx.fillStyle = '#ff7272';
            }

            ctx.fillRect(currX, canvas.height - scores[i], width, scores[i]);
            currX += width + spacing;

            if(i ===3){
                ctx.fillStyle = '#d8838e';
            }
        }

        console.log(ctx);
        console.log(canvas);
    }]);
        //(x,y,width, height)

        /*    ctx.fillStyle = 'orange';
         //(x,y,redius, startAngle, endAngle, antiClockwise)
         ctx.arc(300,100,80, 2 * Math.PI, false);
         ctx.fill();*/
var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
var ctx = canvas.getContext('2d');

var scores = [100, 90, 86, 35, 57, 62, 120].reverse();// we will flip the screen around so this needs to be flipped as well.
var width = 50;
var currX = 50;
var space = 1;
var base = 200;

var graphWidth = ((width + space) * scores.length);//length of graph
var graphMidPiont = (canvas.width / 2) - (graphWidth / 2);//Center the graph

//the below two things make it look like I'm rendering from the bottom
ctx.translate(canvas.width /2, canvas.height/2);//this sets a new x,y starting point
ctx.rotate(Math.PI);//rotate 180 degrees

ctx.fillStyle = '#d8838e';

for (var i = 0; i < scores.length; i++) {
    ctx.fillRect(currX, 0, width, scores[i]);//(x,y,width, height)// now that it is rendering from the "Bottom" the y coordinate can be 0 instead of "canvas.height - scores[i]"

    currX += width + space;
}