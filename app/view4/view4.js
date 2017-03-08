/**
 * Created by tim on 3/8/17.
 */

'use strict';

angular.module('myApp.view4', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view4', {
            templateUrl: 'view4/view4.html',
            controller: 'view4Ctrl'
        });
    }])

    .controller('view4Ctrl', [function () {
        var canvas, ctx, scores, width, curBarHeight, curX, curY, spacing, base, i, l;

        canvas = $('#testCanvas3')[0];//document.getElementById('testCanvas');
        ctx = canvas.getContext('2d');

        scores = [70, 52, 86, 100, 57, 62, 98];
        width = 50;
        curX = 50;
        spacing = 2;
        base = 200;

        ctx.fillStyle = '#d8838e';

        l = scores.length;

        for (i = 0; i < l; i++) {
            curBarHeight = scores[i];
            curY = canvas.height - curBarHeight;
            ctx.fillStyle = i === 4 ? '#ff7272' : '#d8838e';
            ctx.fillRect(curX, curY, width, scores[i]);


            ctx.fillStyle = i === 4 ? '#00AE82' : '#D84848';
            ctx.beginPath();
            ctx.arc(curX + width/2, curY, 10,0,2 * Math.PI, false);
            ctx.fill();
            ctx.strokeStyle = "pink";
            ctx.lineWidth = 2;
            ctx.stroke();

            curX += width + spacing;
        }

        console.log(ctx);
        console.log(canvas);
    }]);