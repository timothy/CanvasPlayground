'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', [function () {
        var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
        canvas.width = window.innerWidth;
        var ctx = canvas.getContext('2d');

        var margin = { top: 10, left: 10, right: 10, bottom: 10 };
        var scores = [100, 90, 86, 35, 57, 62, 98];
        var width = 50;
        var currX = margin.left;// start at margin boarder
        var spacing = 2;
        var lineHeight = 10;


        function renderLines() {
            ctx.beginPath();
            ctx.moveTo(currX, canvas.height - margin.bottom);
            ctx.lineTo(currX, canvas.height - lineHeight - margin.bottom);
            ctx.stroke();
        }

        function renderBars() {
            ctx.fillStyle = '#d8838e';
            var i;
            for (i = 0; i < scores.length; i++) {
                ctx.fillRect(currX, (canvas.height - scores[i]) - margin.bottom - lineHeight, width, scores[i]);
                renderLines();
                currX += width + spacing;
            }
            renderLines();
        }


        renderBars();


        //(x,y,width, height)


        /*    ctx.fillStyle = 'orange';
         //(x,y,redius, startAngle, endAngle, antiClockwise)
         ctx.arc(300,100,80, 2 * Math.PI, false);
         ctx.fill();*/
    }]);