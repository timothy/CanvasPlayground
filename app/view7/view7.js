'use strict';
//self invoking function
!function () {

    var moduleName = "view7";
    angular.module('myApp.' + moduleName, ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/' + moduleName, {
                templateUrl: moduleName + '/' + moduleName + '.html',
                controller: moduleName + 'Ctrl'
            });
        }])
        .controller(moduleName + 'Ctrl', ['chart',function (chart) {

            var canvas = $('#testCanvas')[0];
                canvas.width = window.innerWidth;

            var dataAndSettings = {
                title: "Tuesday Popular Hours",
                titleFont: '19pt Arial',
                times: ['7 AM','7 AM','7 AM','7 AM','7 AM'],
                dataPointFont: '10pt Arial',
                dataPoints: [
                    { y: 3.9 },
                    { y: 7.2 },
                    { y: 12.8 },
                    { y: 23.1 },
                    { y: 36.5 },
                    { y: 62.9 },
                    { y: 92.2 },
                    { y: 123.2 },
                    { y: 151.3 },
                    { y: 203.2 },
                    { y: 248.7 },
                    { y: 308.7}]
            };

            chart.render(canvas , dataAndSettings);
        }])



        .service('chart', [function () {

            var ctx,
                canvas,
                margin = { top: 10, left: 10, right: 10, bottom: 10 },
                chartHeight, chartWidth, yMax, xMax, data,
                maxYValue = 0,
                ratio = 0,
                rectWidth = 10,
                renderType = { lines: 'lines', points: 'points' },
                finalDataPoints = [],

                render = function(canvasLoc, dataObj) {
                    canvas = canvasLoc;
                    data = dataObj;
                    createOverlay();

                    chartHeight = canvas.getAttribute('height');
                    chartWidth = canvas.getAttribute('width');
                    canvas.addEventListener('mousemove', mouseMove, false);
                    ctx = canvas.getContext("2d");

                    xMax = chartWidth - (margin.left + margin.right);
                    yMax = chartHeight - (margin.top + margin.bottom);
                    maxYValue = getMaxDataYValue();
                    ratio = yMax / maxYValue;
                    //render data based upon type of renderType(s) that client supplies
                    if (data.renderTypes == undefined || data.renderTypes == null) data.renderTypes = [renderType.lines];
                    renderParts();
                },

                renderParts = function() {
                    renderText();
                    renderLinesAndLabels(true);
                    renderData();
                },


                renderText = function() {
                    var labelFont = (data.labelFont != null) ? data.labelFont : '20pt Arial';
                    ctx.font = labelFont;
                    ctx.textAlign = "right";

                    //Title
                    ctx.fillText(data.title, (chartWidth / 2), margin.top / 2);

                    //X-axis text
                    var txtSize = ctx.measureText(data.xLabel);
                    ctx.fillText(data.xLabel, margin.left + (xMax / 2) - (txtSize.width / 2), yMax + (margin.bottom / 1.2));

                    //Y-axis text
                    ctx.save();
                    ctx.rotate(-Math.PI / 2);
                    ctx.font = labelFont;
                    ctx.fillText(data.yLabel, (yMax / 2) * -1, margin.left / 4);
                    ctx.restore();
                },

                renderLinesAndLabels = function(shouldRenderText) {
                    var yInc = yMax / data.dataPoints.length;
                    var yPos = 0;
                    var xInc = getXInc();
                    var xPos = margin.left;

                    for (var i = 0; i < data.dataPoints.length; i++) {
                        yPos += (i == 0) ? margin.top : yInc;
                        //Draw horizontal lines
                        drawLine({ x: margin.left, y: yPos, x2: xMax, y2: yPos }, '#E8E8E8');

                        if (shouldRenderText) {
                            //y axis labels
                            ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '10pt Calibri';
                            var txt = Math.round(maxYValue - ((i == 0) ? 0 : yPos / ratio));
                            var txtSize = ctx.measureText(txt);
                            ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);

                            //x axis labels
                            txt = data.dataPoints[i].x;
                            txtSize = ctx.measureText(txt);
                            ctx.fillText(txt, xPos, yMax + (margin.bottom / 3));
                            xPos += xInc;
                        }
                    }

                    //Vertical line
                    drawLine({ x: margin.left, y: margin.top, x2: margin.left, y2: yMax });

                    //Horizontal Line
                    drawLine({ x: margin.left, y: yMax, x2: xMax, y2: yMax });
                },

                renderData = function () {
                    var xInc = getXInc(),
                        prevX = 0,
                        prevY = 0;
                    for (var i = 0; i < data.dataPoints.length; i++) {
                        var pt = data.dataPoints[i];
                        var y = (maxYValue - pt.y) * ratio;
                        if (y < margin.top) y = margin.top;
                        var x = (i * xInc) + margin.left;

                        //Calculate dataPoint details
                        var dataPoint = { x: x, y: y, currX: margin.left, x2: prevX, y2: prevY, originalY: pt.y };
                        finalDataPoints.push(dataPoint);

                        prevX = x;
                        prevY = y;
                    }

                    if (data.renderTypes.contains(renderType.lines)) drawLines();
                    if (data.renderTypes.contains(renderType.points)) drawPoints();
                },

                drawPoints = function() {
                    for (var i=0;i < finalDataPoints.length;i++) {
                        var pt = finalDataPoints[i];
                        renderRect(pt.x, pt.y);
                    }
                },

                renderRect = function (x, y, highlightColor) {
                    var radgrad = ctx.createRadialGradient(x, y, rectWidth, x - 5, y - 5, 0);
                    radgrad.addColorStop(0, (highlightColor == null) ? 'Green' : highlightColor);
                    radgrad.addColorStop(0.9, 'White');
                    ctx.beginPath();
                    ctx.fillStyle = radgrad;
                    //Render circle
                    ctx.arc(x, canvas.height - y, rectWidth, 0, 2 * Math.PI, false)
                    ctx.fillRect(x, y, width, scores[i]);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#000';
                    ctx.stroke();
                    ctx.closePath();
                },

                drawLines = function () {
                    for (var i = 0; i < finalDataPoints.length; i++) {
                        var pt = finalDataPoints[i];
                        if (pt.x2 > 0) drawLine(pt);
                    }
                },

            drawLine = function (pt, strokeStyle) {
                ctx.strokeStyle = (strokeStyle == null) ? 'black' : strokeStyle;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pt.x2, pt.y2);
                ctx.lineTo(pt.x, pt.y);
                ctx.stroke();
                ctx.closePath();
            },

                getMaxDataYValue = function() {
                    var maxY = 0;
                    for (var i = 0; i < data.dataPoints.length; i++) {
                        var y = data.dataPoints[i].y;
                        if (y > maxY) maxY = y;
                    }
                    return maxY;
                },

                getXInc = function () {
                    return Math.round(xMax / data.dataPoints.length) - 1;
                },

                createOverlay = function() {

                },

                mouseMove = function(evt) {

                };

            //public members
            return {
                render: render,
                renderType: renderType
            };


    }]);

    Array.prototype.contains = function (value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == value) return true;
        }
        return false;
    };
}();