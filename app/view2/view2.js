'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['usage',function (usage) {
        var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
        canvas.width = window.innerWidth - 100;
        var ctx = canvas.getContext('2d');

        var curUsage = usage.coffeeShop[0].data;

        var margin = { top: 10, left: 10, right: 10, bottom: 10 };
        var scores = [100, 90, 86, 35, 57, 62, 98];
        var width = (canvas.width/curUsage.length) - (margin.left + margin.right);//Width of each bar needs to scale with canvas width
        var currX = margin.left;// start at margin boarder
        var spacing = 2;
        var lineHeight = 10;

        console.log(curUsage);



        function renderLines() {
            ctx.beginPath();
            ctx.moveTo(currX, canvas.height - margin.bottom);
            ctx.lineTo(currX, canvas.height - lineHeight - margin.bottom);
            ctx.stroke();
        }

        function renderBars() {
            ctx.fillStyle = '#d8838e';
            var i;
            for (i = 0; i < curUsage.length; i++) {
                ctx.fillRect(currX, (canvas.height - curUsage[i].usage) - margin.bottom - lineHeight, width, scores[i]);
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