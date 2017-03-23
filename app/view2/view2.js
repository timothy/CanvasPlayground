'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['usage', function (usage) {
        var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
        canvas.width = window.innerWidth - 100;

        //style variables
        var margin = {top: 10, left: 10, right: 10, bottom: 10};

        var maxCanvasHeight = canvas.height - (Number(margin.top) + Number(margin.bottom)) - 15,//Offset by 15
            maxCanvasWidth = canvas.width - (margin.left + margin.right) - 15;//Offset by 15

        //Set up all variable.
        var ctx = canvas.getContext('2d'),
            curUsage = usage.coffeeShop[0].data,

            barWidth = (maxCanvasWidth / curUsage.length),//Width of each bar needs to scale with canvas barWidth
            currX = margin.left,// start at margin boarder
            spacing = 2,
            lineHeight = 10,
            i;// this should only be used for loops...

        var maxBarHeight = getMaxChartValue(curUsage);
        var barHeightOffset = (maxCanvasHeight / maxBarHeight);// Offset for scaling bar height to canvas


        console.log(curUsage);

        function renderLines() {
            ctx.beginPath();
            ctx.moveTo(currX, canvas.height - margin.bottom);
            ctx.lineTo(currX, canvas.height - lineHeight - margin.bottom);
            ctx.stroke();
        }

        function renderBars() {
            ctx.fillStyle = '#d8838e';
            var l = curUsage.length, barHight = 0, barY = 0;
            for (i = 0; i < l; i++) {
                barHight = curUsage[i].usage * barHeightOffset;//tried to make this easier to read
                barY = (canvas.height - barHight) - margin.bottom - lineHeight;//tried to make this easier to read
                ctx.fillRect(currX, barY, barWidth, barHight);
                renderLines();
                currX += barWidth + spacing;
            }
            renderLines();
        }


        renderBars();


        //(x,y,barWidth, height)


        /*    ctx.fillStyle = 'orange';
         //(x,y,redius, startAngle, endAngle, antiClockwise)
         ctx.arc(300,100,80, 2 * Math.PI, false);
         ctx.fill();*/

        function getMaxChartValue(chartArray) {
            var max = 0, cur = 0, l = chartArray.length;
            for (i = 0; i < l; i++) {
                cur = chartArray[i].usage;
                if (cur > max) max = cur;
            }
            return max;
        }

    }]);