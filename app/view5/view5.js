/**
 * Created by tim on 3/8/17
 */

'use strict';
(function(){
var moduleName = "view5";

angular.module('myApp.' + moduleName, ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/' + moduleName, {
            templateUrl: moduleName + '/' + moduleName + '.html',
            controller: moduleName + 'Ctrl'
        });
    }])

    .controller(moduleName + 'Ctrl', [function () {
        var canvas, ctx, scores, width, curBarHeight, curX, curY, startX = 0, startY = 0, curLineX,cirLineWidth = 5, spacing, i, l;

        canvas = $('#testCanvas3')[0];//document.getElementById('testCanvas');
        ctx = canvas.getContext('2d');

        scores = [70, 52, 86, 100, 57, 62, 98, 5, 43, 20, 99, 110];
        width = 50;
        curX = 50;
        spacing = 2;

        ctx.fillStyle = '#d8838e';

        startX = curX + spacing + width / 2;
        curLineX = cirLineWidth +curX + (width / 2);
        l = scores.length;
        for (i = 0; i < l; i++) {
            curBarHeight = scores[i];
            curY = canvas.height - curBarHeight;


            drawRect();
            drawLine();
            drawCircle();

            curX += width + spacing;
            curLineX = cirLineWidth +curX + (width / 2);
        }

        function drawLine() {
            if (startY === 0) startY = curY;
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 3;
            ctx.moveTo(startX, startY);
            ctx.lineTo(curLineX - cirLineWidth - 10, curY);
            ctx.stroke();
            ctx.closePath();
            startX = curLineX + spacing + cirLineWidth;
            startY = curY;
        }

        function drawRect(){
            //draw rectangle
            ctx.fillStyle = i === 4 ? '#ff7272' : '#d8838e';
            ctx.fillRect(curX, curY, width, scores[i]);
        }


        function drawCircle() {
            //draw circle
            ctx.fillStyle = i === 4 ? '#00AE82' : '#D84848';
            ctx.beginPath();
            ctx.arc(curX + width/2, curY, 10, 0, 2 * Math.PI, false);//make a circle
            ctx.fill();// fill the circle with the fillStyle
            ctx.strokeStyle = "pink";//create a boarder
            ctx.lineWidth = cirLineWidth;
            ctx.stroke();
        }

        console.log(ctx.lineWidth);

        console.log(ctx);
        console.log(canvas);
    }]);
})();