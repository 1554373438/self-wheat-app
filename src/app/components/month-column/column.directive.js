(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('monthColumn', monthColumn);

  /** @ngInject */
  function monthColumn() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        info: '='
      },
      required: 'info',
      templateUrl: "app/components/month-column/template.html",
      link: function(scope, element, attr) {
        scope.$watch('info', function(arr) {
          if(arr && arr.length) {
            draw(arr);
          }
        }, true);

        function draw(info) {
          var data = info;
          var canvas = document.createElement("canvas");
          canvas.width = 750;
          canvas.height = 500;
          canvas.innerText = "抱歉，你的浏览器不支持canvas T_T";
          document.getElementById('leoncanvas').appendChild(canvas);

          var width = canvas.width;
          var height = canvas.height;

          // data length calc & value analysis    表格尺寸
          var length = 0,
            min = 0,
            max = 0;

          for (var i in data) {
            length++;
            if (data[i] < min)
            // console.log(data[i]);
              min = data[i];
            if (data[i] > max)
              max = data[i];
            // console.log(data[i]);
          }

          var xLength = width * 0.9; //x轴长度
          var yLength = height * 0.75; //y轴长度
          var left = width * 0.02; //左边距
          var bottom = height * 0.1; //下边距
          // console.log(xLength,yLength,left,bottom);
          // origin point                         
          var x0 = left;
          var y0 = height - bottom;

          var p0 = { //图表原点坐标P0(X0,YO)
            x: x0,
            y: y0
          };
          var px = { //x轴终点Px(x,y)左边距＋x轴长度
            x: left + xLength,
            y: p0.y
          };
          var py = { //y轴终点Py(x,y)
            x: p0.x,
            y: p0.y - yLength
          };

          var xScaleMarkWidth = xLength / (length); //x轴单元格宽度
          var yScaleMarkWidth = yLength / (length + 3); //y轴单元格宽度
          // begin to draw axis
          var context = canvas.getContext('2d');
          context.beginPath();
          // offset 0.5 to draw 1 pixel line
          //http://kilianvalkhof.com/2010/design/the-problem-with-svg-and-canvas/
          // xAxis
          context.moveTo(p0.x, p0.y); //水平方向
          context.lineTo(px.x + 50, px.y);
          // yAxis
          context.moveTo(p0.x, p0.y); //竖直方向
          context.lineTo(py.x, py.y - 50);

          context.font = "normal lighter 24px sans-serif";

          // scale marker
          for (var i = 0; i < length; i++) { //x y 轴
            // xaxis
            context.moveTo(p0.x + (i + 1) * xScaleMarkWidth, p0.y);
            context.lineTo(p0.x + (i + 1) * xScaleMarkWidth, p0.y);

            // yaxis
            context.moveTo(p0.x, p0.y - (i + 1) * yScaleMarkWidth);
            context.lineTo(p0.x, p0.y - (i + 1) * yScaleMarkWidth);
          }

          // y axis marker value                                             //y轴字体
          // for (var i = 0; i <= length; i++) {
          //   // yaxis value
          //   context.fillText(yStep * i, p0.x, p0.y - i * yScaleMarkWidth);
          // }

          // draw column chart
          var lengthPerValue = (yScaleMarkWidth * (length)) / max;
          var rectX, rectY;
          var i = 0;

          for (var p in data) {
            rectX = p0.x + (i + 1) * xScaleMarkWidth - xScaleMarkWidth * 0.25; //
            rectY = p0.y - lengthPerValue * data[p];
            // console.log(rectX);
            // console.log(rectY);
            // draw column
            switch (i + 1) {
              case 1:
                context.fillStyle = "rgba(57,141,246,0.2)";
                break;
              case 2:
                context.fillStyle = "rgba(57,141,246,0.2)";
                break;
              case 3:
                context.fillStyle = "rgba(57,141,246,0.3)";
                break;
              case 4:
                context.fillStyle = "rgba(57,141,246,0.3)";
                break;
              case 5:
                context.fillStyle = "rgba(57,141,246,0.4)";
                break;
              case 6:
                context.fillStyle = "rgba(57,141,246,0.4)";
                break;
              case 7:
                context.fillStyle = "rgba(57,141,246,0.5)";
                break;
              case 8:
                context.fillStyle = "rgba(57,141,246,0.5)";
                break;
              case 9:
                context.fillStyle = "rgba(57,141,246,0.6)";
                break;
              case 10:
                context.fillStyle = "rgba(57,141,246,0.6)";
                break;
              case 11:
                context.fillStyle = "rgba(57,141,246,0.7)";
                break;
              case 12:
                context.fillStyle = "rgba(57,141,246,0.8)";
                break;
            }
            // context.fillStyle = "rgba(57,141,246,0.9)";
            context.fillRect(rectX, rectY, xScaleMarkWidth / 2, lengthPerValue * data[p]);

            // add text
            context.fillStyle = 'rgb(0,0,0)';
            // column value
            context.fillText(data[p], rectX - 5, rectY - 5);
            // x value
            context.fillText(parseInt(p) + 1, rectX + xScaleMarkWidth * 0.1, rectY + lengthPerValue * data[p] + 30);
            i++;
          }

          context.lineWidth = 2;
          context.strokeStyle = "#f4f4f4";
          context.stroke();
          context.closePath();
        }
      }
    }

    return directive;
  }

})();
