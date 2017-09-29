(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('histogram', histogram);

  /** @ngInject */
  function histogram() {
    var directive = {
      restrict: 'E',
      scope: {
        options: '=options'
      },
      replace: true,
      controller: function() {

        this.getChart = function(options) {
          return new HistogramChart(options);
        };

        function HistogramChart(options) {
          this.options = options;
          this.options.xLength = options.series.length;

          this.svgns = "http://www.w3.org/2000/svg";
          this.chart = document.createElementNS(this.svgns, "svg:svg");
          this.chart.setAttribute("width", this.options.width);
          this.chart.setAttribute("height", this.options.height);
          this.chart.setAttribute("viewBox", "0 -" + this.options.height + " " + this.options.width + " " + this.options.height); //设置坐标系原点为左下角
          this.draw();

          return this.chart;
        }

        HistogramChart.prototype.draw = function() {
          var self = this;
          this.drawAxis();
          this.drawSeries();
        }

        // 绘制坐标轴
        HistogramChart.prototype.drawAxis = function() {
          // 绘制y轴
          var yAxis = document.createElementNS(this.svgns, 'g');
          var yLine = document.createElementNS(this.svgns, 'line');
          var yLabel = document.createElementNS(this.svgns, 'text')
          yLine.setAttribute('x1', 0);
          yLine.setAttribute('y1', -20);
          yLine.setAttribute('x2', 0);
          yLine.setAttribute('y2', -this.options.height);
          yLine.setAttribute('style', 'stroke:#ddd;stroke-width:1;');

          yLabel.setAttribute('x', 10);
          yLabel.setAttribute('y', -this.options.height + 10);
          yLabel.setAttribute('font-size', 9);
          yLabel.setAttribute('text-anchor', 'middle');
          yLabel.setAttribute("fill", this.options.yLabel.color);
          yLabel.innerHTML = this.options.yLabel.text;

          yAxis.appendChild(yLine);
          yAxis.appendChild(yLabel);
          yAxis.setAttribute('transform', 'translate(0.5 0.5)');
          this.chart.appendChild(yAxis);

          // 绘制x轴
          var xAxis = document.createElementNS(this.svgns, 'g');
          var xLine = document.createElementNS(this.svgns, 'line');
          var xLabel = document.createElementNS(this.svgns, 'text');
          var xFragement = document.createDocumentFragment();

          xLine.setAttribute('x1', 0);
          xLine.setAttribute('y1', -20);
          xLine.setAttribute('x2', this.options.width);
          xLine.setAttribute('y2', -20);
          xLine.setAttribute('style', 'stroke:#ddd;stroke-width:1;');
          


          xLabel.setAttribute('x', this.options.width - 15);
          xLabel.setAttribute('y', -5);
          xLabel.setAttribute('font-size', 9);
          xLabel.setAttribute('text-anchor', 'middle');
          xLabel.setAttribute("fill", this.options.xLabel.color);
          xLabel.innerHTML = this.options.xLabel.text;

          // x轴坐标数字
          for (var i = 0; i < this.options.xLength; i++) {
            var text = document.createElementNS(this.svgns, 'text');
            var width = this.options.width - 20;
            var xStep = parseInt(width / this.options.xLength);
            text.setAttribute('y', -5);
            text.setAttribute('font-size', 10);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute("fill", this.options.xLabel.color);
            text.setAttribute('x', (i + .5) * xStep)
            text.innerHTML = this.options.series[i]['name'];
            xFragement.appendChild(text);
          }

          xFragement.appendChild(xLine);
          xFragement.appendChild(xLabel);
          xAxis.appendChild(xFragement);
          xAxis.setAttribute('transform', 'translate(0.5 0.5)');
          this.chart.appendChild(xAxis);
        }

        // 绘制柱状图
        HistogramChart.prototype.drawSeries = function() {
          var series = this.resetSeries(this.options.series);
          var fragment = document.createDocumentFragment();
          var rectGroup = document.createElementNS(this.svgns, 'g');
          rectGroup.setAttribute('transform', 'translate(1,-21)');

          for (var i = 0; i < this.options.xLength; i++) {
            var attrs = series[i];
            var rect = this.drawRect(attrs);
            fragment.appendChild(rect);

          }

          rectGroup.appendChild(fragment);
          this.chart.appendChild(rectGroup);
        }

        HistogramChart.prototype.drawRect = function(attrs) {
          var g = document.createElementNS(this.svgns, 'g');
          var rectEle = document.createElementNS(this.svgns, 'rect');
          var rectName = document.createElementNS(this.svgns, 'text');

          for (var key in attrs) {
            var val = attrs[key];
            rectEle.setAttributeNS(null, key, val);
          }

          rectName.setAttribute('y', attrs['y'] - 5);
          rectName.setAttribute('font-size', 9);
          rectName.setAttribute('text-anchor', 'middle');
          rectName.setAttribute("fill", '#228DEA');
          rectName.setAttribute('x', attrs['x'] + .5 * attrs['width']);
          rectName.innerHTML = attrs['data'];

          g.appendChild(rectEle);
          g.appendChild(rectName);
          return g;
        }

        // 设置柱状图每个矩形属性
        HistogramChart.prototype.resetSeries = function(series) {
          var resetSeries = [];
          var max = getMax(series, 'y');
          var yStep = parseInt((this.options.height - 30) / max);
          var width = this.options.width - 20;
          var xStep = parseInt(width / this.options.xLength);
          for (var i = 0; i < this.options.xLength; i++) {
            var rect = {
              x: i * xStep,
              y: -(series[i]['y'] * yStep),
              width: xStep - 1,
              height: series[i]['y'] * yStep,
              data: series[i]['y'],
              name: series[i]['name'],
              style: "stroke-width:1px;stroke:" + series[i]['color'] + ";fill:" + series[i]['color'] + ";"
            };
            resetSeries.push(rect);
          }
          return resetSeries;

        }

        // 获取最大值
        function getMax(obj, key) {
          var temp = [];
          temp = temp.concat(temp, obj);
          temp.sort(function(a, b) {
            return b[key] - a[key];
          });
          return temp[0][key];
        }

      },
      link: function(scope, element, attr, ctrl) {
        scope.$watch('options', function(val) {
          if (val) {
            var width = document.getElementById(val.boxId).offsetWidth;
            val.width = width;
            var chart = ctrl.getChart(val);
            element.empty();
            element.append(chart);
          }
        }, true);
      }
    };

    return directive;

  }

})();
