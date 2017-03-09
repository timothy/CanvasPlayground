/**
 * Created by tim on 3/9/17
 */

'use strict';
var moduleName = "view6";// I got lazy...
angular.module('myApp.' + moduleName, ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/' + moduleName, {
            templateUrl: moduleName + '/' + moduleName + '.html',
            controller: moduleName + 'Ctrl'
        });
    }])

    .controller(moduleName + 'Ctrl', ['$interval',function ($interval) {
        var canvas, video, ctx, vidInterval;

        canvas = $('#testCanvas6')[0];//document.getElementById('testCanvas');
        ctx = canvas.getContext('2d');
        video = $('#video')[0];
        ctx.fillStyle = 'green';

        video.addEventListener('play', function() {
            vidInterval = $interval(function() {
                ctx.drawImage(video, 5, 5, 270, 125);

                //(x,y,width, height)
                ctx.fillRect(0, 0, 20, 100);
            }, 30);
        });

        video.addEventListener('pause', function() {
            stopTimer();
        });

        video.addEventListener('ended', function() {
            stopTimer();
        });


        function stopTimer() {
            $interval.cancel(vidInterval);
        }

    }]);