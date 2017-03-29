'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])
    .controller('View2Ctrl', ['usage', 'graph', '$scope', function (usage, graph, $scope) {

        /**
         * Render Graph - with default style
         * data should always be an array of objects with
         * two properties usage and time i.e. {usage:number, time:number}
         */
      var graph1 =  graph.getGraph('testCanvas', usage.coffeeShop[0].data, false);

        //Set custom styles example
        var style = {
            canvasWidth: window.innerWidth / 2,
            canvasHeight: 50,
            background: "blue",
            margin: {top: 10, left: 10, right: 10, bottom: 15},
            textStyle: "15px Open Sans",
            texColor: "black",
            spacing: 5,
            lineHeight: 5,
            barColor: "green",
            selectBarColor: "orange",
            lineColor: "pink",
            selectLineColor: "purple"
        };
      var graph2 =  graph.getGraph('testCanvas2', usage.coffeeShop[2].data, style);

        /**
         * If using in SPA need to destroy watchers each time routing happens
         * Destroy on navigation change
         */
        $scope.$on('$destroy', function () {
            graph1.onDestroy();
            graph2.onDestroy();
        });

    }]).factory('graph', graphFactory);

//Dependency Injection
graphFactory.$inject = [];

/**
 * Angular Factory service
 * @returns {{}} a new instance of the Graph class
 */
function graphFactory() {
    var service = {};
    service.getGraph = getGraph;

    return service;
}

/**
 * Angular 1 Factory method
 * @param canvas the ID tag name of the canvas element the graph will reside in
 * @param data the data that will populate the graph
 * @param style (optional) custom styles.
 * @returns {Graph} a new instance of the Graph class
 */
function getGraph(canvas, data, style) {
    return new Graph(canvas, data, style);
}

/**
 * Constructor
 * @param canvas the ID tag name of the canvas element the graph will reside in
 * @param data the data that will populate the graph
 * @param style (optional) custom styles.
 * @constructor
 */
function Graph(canvas, data, style) {
    //To ovoid scoping issues
    var self = this;

    /**
     * Setup canvas and add graph data
     */
    self.canvasSetup = function () {
        //Set Graph data
        self.graphData = data;
        //Init Canvas
        self.canvas = !!$ ? $('#' + canvas)[0] : document.getElementById(canvas);//If jQuery is undefined fall back to native
        self.canvas.width = !!style.canvasWidth ? style.canvasWidth : (!!$ ? $('#' + canvas).parent().width() : document.getElementById(canvas).parentElement.clientWidth);//If jQuery is undefined fall back to native
        self.canvas.height = !!style.canvasHeight ? style.canvasHeight : 100;
        self.ctx = self.canvas.getContext('2d');//context

        //Set Background
        self.ctx.fillStyle = !!style.background ? style.background : "#B1081D";
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        //Try to make things look a smooth as possible
        self.ctx.translate(0.5, 0.5);
        self.ctx.imageSmoothingEnabled = false;

        /**
         * style variables v
         */
        //Graph margins
        self.margin = !!style.margin ? style.margin : {top: 5, left: 5, right: 5, bottom: 13};
        //Text size and font
        self.textStyle = !!style.textStyle ? style.textStyle : "10px Open Sans";
        self.texColor = !!style.texColor ? style.texColor : "#ffffff";
        //The spacing of each bar and line in the graph
        self.spacing = !!style.spacing ? style.spacing : 1;
        //The height of the line that separates the time from the graph
        self.lineHeight = !!style.lineHeight ? style.lineHeight : 3;
        //Graph bar Styles
        self.barColor = !!style.barColor ? style.barColor : "#d8838e";
        self.selectBarColor = !!style.selectBarColor ? style.selectBarColor : "#ffffff";
        //Line styles
        self.lineColor = !!style.lineColor ? style.lineColor : "#d8838e";
        self.selectLineColor = !!style.selectLineColor ? style.selectLineColor : "#ffffff";
        /**
         * style variables ^
         */

        //Create boundaries for content to stay within
        self.widthOffset = (self.graphData.length * self.spacing);
        self.maxCanvasHeight = self.canvas.height - (Number(self.margin.top) + Number(self.margin.bottom));
        self.maxCanvasWidth = self.canvas.width - (self.margin.left + self.margin.right) - self.widthOffset;//Offset by widthOffset

        //Width of each bar needs to scale with canvas barWidth
        self.barWidth = self.maxCanvasWidth / self.graphData.length;

        // start at margin boarder
        self.currX = self.margin.left;

        //Find the largest bar height in order to scale all bars to the canvas height.
        self.maxBarHeight = self.getMaxChartValue(self.graphData);
        // Offset for scaling bar height to canvas
        self.barHeightOffset = (self.maxCanvasHeight / self.maxBarHeight);

        //Find the index of the element with the same hour as now.
        self.timeNow = new Date().getHours() * 100;
        self.curTimeIndex = self.graphData.findIndex(function (element, index, array) {
            return element.time >= self.timeNow;
        });

        self.render();
    };

    self.canvasSetup();

    window.addEventListener('resize', self.canvasSetup);
}

/**
 * Method Definition
 * This draws the individual pieces of the graph in the right order
 */
Graph.prototype.render = function () {
    var self = this;

    renderBars(self);
    renderLines(self);
    renderTimes(self);
};

Graph.prototype.onDestroy = function () {
    var self = this;

    window.removeEventListener("resize", self.canvasSetup);
};

/**
 * This will format the time according to the graph specification.
 * @param time {number} military time.
 * @returns {string} Formatted time string.
 */
Graph.prototype.timeFormat = function timeFormat(time) {
    //Make sure time is a number and not a string
    time = Number(time);

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
};

/**
 *
 * @param chartArray - the array for the current chart
 * @returns {number} the max usage number
 */
Graph.prototype.getMaxChartValue = function (chartArray) {
    var max = 0, cur = 0, l = chartArray.length, i;
    for (i = 0; i < l; i++) {
        cur = chartArray[i].usage;
        if (cur > max) max = cur;
    }
    return max;
};

/**
 * This renders the times that are shown below the graph
 */
function renderTimes(self) {
    var currX = self.margin.left;
    var txt = "", l = self.graphData.length, hOffset = 4, i;

    self.ctx.fillStyle = self.texColor;
    self.ctx.font = self.textStyle;

    self.ctx.fillText(self.timeFormat(self.graphData[0].time), currX, self.canvas.height - hOffset);
    //Only want times every 4th position.
    for (i = 0; i < l; i++) {
        if (i % 4 === 0 && i !== 0) {
            txt = self.timeFormat(self.graphData[i].time);
            self.ctx.fillText(txt, currX - self.ctx.measureText(txt).width / 2, self.canvas.height - hOffset);
        }
        currX += self.barWidth + self.spacing;
    }
    self.ctx.textAlign = "right";
    self.ctx.fillText(self.timeFormat(self.graphData[l - 1].time), self.lastLine, self.canvas.height - hOffset);
}


/**
 * This renders vertical lines at the (currx, Y) coordinates
 */
function renderLines(self) {
    var i, l = self.graphData.length;// i === increment, l === length
    var currX = self.margin.left - (self.spacing / 2);

    self.ctx.lineWidth = self.spacing;
    self.ctx.strokeStyle = self.selectLineColor;
    renderSingleLine();
    self.ctx.strokeStyle = self.lineColor;
    for (i = 0; i < l; i++) {
        if (i % 4 === 0 || i === 0) {
            self.ctx.strokeStyle = self.selectLineColor;
            renderSingleLine();
            self.ctx.strokeStyle = self.lineColor;
        } else {
            renderSingleLine();
        }
        currX += self.barWidth + self.spacing;
    }
    self.lastLine = currX;
    self.ctx.strokeStyle = self.selectLineColor;
    renderSingleLine();

    /**
     * Draw a single vertical line using current X,Y coordinates state.
     */
    function renderSingleLine() {
        self.ctx.beginPath();
        self.ctx.moveTo(currX, self.canvas.height - self.margin.bottom);
        self.ctx.lineTo(currX, self.canvas.height - self.lineHeight - self.margin.bottom);
        self.ctx.stroke();
    }
}

/**
 * This renders the graph bars scaled to fit the canvas window
 */
function renderBars(self) {
    var currX = self.margin.left;
    var l = self.graphData.length, barHight = 0, barY = 0, i;

    self.ctx.fillStyle = self.barColor;
    for (i = 0; i < l; i++) {
        barHight = self.graphData[i].usage * self.barHeightOffset;//tried to make this easier to read
        barY = (self.canvas.height - barHight) - self.margin.bottom - self.lineHeight;//tried to make this easier to read

        if (self.curTimeIndex === i) {
            self.ctx.fillStyle = self.selectBarColor;
            self.ctx.fillRect(currX, barY, self.barWidth, barHight);
            self.ctx.fillStyle = self.barColor;
        } else {
            self.ctx.fillRect(currX, barY, self.barWidth, barHight);
        }
        currX += self.barWidth + self.spacing;
    }
    renderLineConnectors(self);
}

/**
 * This renders one horizontal line to connect all vertical lines.
 */
function renderLineConnectors(self) {
    self.ctx.beginPath();
    self.ctx.strokeStyle = self.lineColor;
    self.ctx.lineWidth = self.spacing;
    self.ctx.moveTo(self.margin.left, self.canvas.height - self.margin.bottom - self.lineHeight);
    self.ctx.lineTo(self.currX, self.canvas.height - self.margin.bottom - self.lineHeight);
    self.ctx.stroke();
    self.ctx.closePath();
}
