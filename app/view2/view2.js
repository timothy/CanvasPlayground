'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['usage', function (usage) {
        //Init Canvas
        var canvas = $('#testCanvas')[0];//document.getElementById('testCanvas');
        canvas.width = window.innerWidth - 20;
        canvas.height = 100;
        var ctx = canvas.getContext('2d');//context

        //Set Background
        ctx.fillStyle = "#B1081D";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Try to make things look a smooth as possible
        ctx.translate(0.5, 0.5);
        ctx.imageSmoothingEnabled = false;

        //style variables
        var margin = {top: 5, left: 5, right: 10, bottom: 13};
        var textStyle = "10px Open Sans";

        //Create boundaries for content to stay within
        var widthOffset = 10;
        var maxCanvasHeight = canvas.height - (Number(margin.top) + Number(margin.bottom)),//Offset by 15
            maxCanvasWidth = canvas.width - (margin.left + margin.right) - widthOffset;//Offset by widthOffset

        //Get data from the service
        var curUsage = usage.coffeeShop[0].data;

        //Width of each bar needs to scale with canvas barWidth
        var barWidth = Math.round(maxCanvasWidth / curUsage.length);

        // start at margin boarder
        var currX = margin.left;
        // The spacing of each bar in the graph
        var spacing = 1;
        //The height of the line that separates the time from the graph
        var lineHeight = 3;
        // this should only be used for loops... instead of reinitializing i for each loop this is done once.
        var i = 0, l = 0;// i === increment, l === length
        //Find the largest bar height in order to scale all bars to the canvas height.
        var maxBarHeight = getMaxChartValue(curUsage);
        // Offset for scaling bar height to canvas
        var barHeightOffset = (maxCanvasHeight / maxBarHeight);

        //Find the index of the element with the same hour as now.
        var timeNow = new Date().getHours() * 100;
        var curTimeIndex = curUsage.findIndex(function (element, index, array) {
            return element.time >= timeNow;
        });

        /**
         * This renders vertical lines at the (currx, Y) coordinates
         */
        function renderLines() {
            ctx.strokeStyle = "#d8838e";
            ctx.lineWidth = spacing;
            l = curUsage.length;
            currX = margin.left;

            ctx.strokeStyle = "#ffffff";
            renderSingleLine();
            ctx.strokeStyle = "#d8838e";
            for (i = 0; i < l; i++) {
                if (i % 4 === 0 && i !== 0 && i !== l) {
                    ctx.strokeStyle = "#ffffff";
                    renderSingleLine();
                    ctx.strokeStyle = "#d8838e";
                } else {
                    renderSingleLine();
                }
                currX += barWidth + spacing;
                console.log(canvas.height - lineHeight - margin.bottom +.5);
            }
            ctx.strokeStyle = "#ffffff";
            renderSingleLine();

            function renderSingleLine() {
                ctx.beginPath();
                ctx.moveTo(currX, canvas.height - margin.bottom);
                ctx.lineTo(currX, canvas.height - lineHeight - margin.bottom);
                ctx.stroke();
            }
        }

        /**
         * This renders the times that are shown below the graph
         */
        function renderTimes() {
            ctx.fillStyle = '#ffffff';
            currX = margin.left;
            ctx.font = textStyle;
            var txt = "", l = curUsage.length, hOffset = 4;
            ctx.fillText(timeFormat(curUsage[0].time), currX, canvas.height- hOffset);
            for (i = 0; i < l; i++) {
                if (i % 4 === 0 && i !== 0 && i !== l) {
                    txt = timeFormat(curUsage[i].time);
                    ctx.fillText(txt, currX - Math.floor(ctx.measureText(txt).width / 2), canvas.height - hOffset);
                }
                currX += barWidth + spacing;
            }
            ctx.fillText(timeFormat(curUsage[l - 1].time), ((canvas.width - ctx.measureText(txt).width) - spacing) - widthOffset, canvas.height- hOffset);
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
            currX = margin.left;
            var l = curUsage.length, barHight = 0, barY = 0;
            for (i = 0; i < l; i++) {
                barHight = curUsage[i].usage * barHeightOffset;//tried to make this easier to read
                barY = (canvas.height - barHight) - margin.bottom - lineHeight;//tried to make this easier to read

                if (curTimeIndex === i) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(currX, barY, barWidth, barHight);
                    ctx.fillStyle = '#d8838e';
                } else {
                    ctx.fillRect(currX, barY, barWidth, barHight);
                }
                currX += barWidth + spacing;
            }
            renderLineConnectors();
        }


        /**
         * This draws the individual pieces of the graph in the right order
         */
        !function renderAll() {
            renderBars();
            renderTimes();
            renderLines();
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