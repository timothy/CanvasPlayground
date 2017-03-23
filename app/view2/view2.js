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
        var margin = {top: 10, left: 10, right: 10, bottom: 20};

        var maxCanvasHeight = canvas.height - (Number(margin.top) + Number(margin.bottom)) - 15,//Offset by 15
            maxCanvasWidth = canvas.width - (margin.left + margin.right) - 30;//Offset by 15

        //Set up all variable.
        var ctx = canvas.getContext('2d'),
            curUsage = usage.coffeeShop[0].data,

            barWidth = (maxCanvasWidth / curUsage.length),//Width of each bar needs to scale with canvas barWidth
            currX = margin.left,// start at margin boarder
            spacing = 2,
            lineHeight = 10,
            count = 0,
            i;// this should only be used for loops...

        var maxBarHeight = getMaxChartValue(curUsage);
        var barHeightOffset = (maxCanvasHeight / maxBarHeight);// Offset for scaling bar height to canvas


        console.log(curUsage);

        /**
         * This renders vertical lines at the (currx, Y) coordinates
         */
        function renderLines() {
            ctx.strokeStyle = "#d8838e";
            ctx.lineWidth = spacing;
            ctx.beginPath();
            ctx.moveTo(currX, canvas.height - margin.bottom);
            ctx.lineTo(currX, canvas.height - lineHeight - margin.bottom);
            ctx.stroke();
        }

        /**
         *
         * @param textTime
         */
        function renderTimes() {//todo Needs more work...
            ctx.fillStyle = 'white';
            var curSpacing = currX/4;
            currX = margin.left;
            ctx.font = ".8em Arial";
            var l = curUsage.length;
            for (i = 0; i < l; i++) {
                ctx.fillText(timeFormat(curUsage[i].time), currX, canvas.height);
                currX += curSpacing;
            }
        }

        /**
         * This renders one horizontal line to connect all vertical lines.
         */
        function renderLineConnectors() {
            ctx.beginPath();
            ctx.strokeStyle = "#d8838e";
            ctx.lineWidth = spacing;
            ctx.moveTo(margin.left, canvas.height - margin.bottom - lineHeight);
            ctx.lineTo(currX, canvas.height - margin.bottom - lineHeight);
            ctx.stroke();
            ctx.closePath();
        }

        /**
         * This renders the graph bars scaled to fit the canvas window
         */
        function renderBars() {
            ctx.fillStyle = '#d8838e';
            var l = curUsage.length, barHight = 0, barY = 0;
            for (i = 0; i < l; i++) {
                barHight = curUsage[i].usage * barHeightOffset;//tried to make this easier to read
                barY = (canvas.height - barHight) - margin.bottom - lineHeight;//tried to make this easier to read
                ctx.fillRect(currX, barY, barWidth, barHight);
                renderLines();
                //renderTimes(timeFormat(curUsage[i].time));
                currX += barWidth + spacing;
            }
            renderLines();
        }


        /**
         * This draws the individual pieces of the graph in the right order
         */
        !function renderAll() {
            renderBars();
            renderLineConnectors();
            renderTimes();
        }();


        /**
         *
         * @param chartArray - the array for the current chart
         * @returns {number} the max usage number
         */
        function getMaxChartValue(chartArray) {
            var max = 0, cur = 0, l = chartArray.length;
            for (i = 0; i < l; i++) {
                cur = chartArray[i].usage;
                if (cur > max) max = cur;
            }
            return max;
        }

        /**
         * This will format the time according to the graph specification.
         * @param time {number} military time.
         * @returns {string} Formatted time string.
         */
        function timeFormat(time) {
            time = Number(time);//it is really important that this be a number and not a string that holds a number...
            if (time > 1259 && time < 2200) {
                return (time - 1200).toString().substring(0, 1) + " PM"
            }

            if (time >= 2200) {
                return (time - 1200).toString().substring(0, 2) + " PM"
            }

            if (time <= 1259 && time > 1159) {
                return time.toString().substring(0, 2) + " PM"
            }

            if (time <= 1159 && time > 959) {
                return time.toString().substring(0, 2) + " AM"
            }

            if (time <= 59) {
                return "12 AM"
            }

            return time.toString().substring(0, 1) + " AM"
        }

    }]);