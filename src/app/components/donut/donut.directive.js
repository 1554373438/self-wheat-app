(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('donut', donut);

  /** @ngInject */
  function donut() {
    var directive = {
      restrict: 'E',
      scope: {
        info: '=data'
      },
      replace: true,
      controller: function() {
        function DonutChart(op) {
          this.svgns = "http://www.w3.org/2000/svg";
          this.chart = document.createElementNS(this.svgns, "svg:svg");
          this.size = op.size || 160;
          this.radius = this.size / 2;

          this.chart.setAttribute("width", this.size);
          this.chart.setAttribute("height", this.size);
          this.chart.setAttribute("viewBox", "0 0 " + this.size + " " + this.size);

          // step 1: background circle
          this.drawBackgroundCircle();
          // step 2: sectors
          var offset = 0, self = this;
          op.items.forEach(function(_item) {
            if(_item.percentage > 100) {
              _item.percentage = 100;
            }
            self.drawSector(offset, _item.percentage, _item.color);
            offset += _item.percentage;
          });

          // step 3: forground circle
          this.drawForegroundCircle();
          // step 4: content
          this.drawContent({
            label: op.label,
            color: '#999',
            position: 'first'
          });

          this.drawContent({
            label: op.total,
            color: '#333',
            position: 'second'
          });

          return this.chart;
        }

        // Background circle
        DonutChart.prototype.drawBackgroundCircle = function() {
          var back = document.createElementNS(this.svgns, "circle");
          back.setAttributeNS(null, "cx", this.radius);
          back.setAttributeNS(null, "cy", this.radius);
          back.setAttributeNS(null, "r", this.radius);
          var color = "#f5f5f5";
          if (this.size > 50) {
            color = "#ebebeb";
          }
          back.setAttributeNS(null, "fill", color);

          this.chart.appendChild(back);
        };

        // Foreground circle
        DonutChart.prototype.drawForegroundCircle = function() {
          var front = document.createElementNS(this.svgns, "circle");
          front.setAttributeNS(null, "cx", (this.radius));
          front.setAttributeNS(null, "cy", (this.radius));
          front.setAttributeNS(null, "r", (this.radius * 0.86)); //about 60% as big as back circle 
          front.setAttributeNS(null, "fill", "#fff");

          this.chart.appendChild(front);
        };

        DonutChart.prototype.drawSector = function(offsetpercent, percentage, color) {
          // primary wedge
          var path = document.createElementNS(this.svgns, "path");
          var unit = (Math.PI * 2) / 100;
          var radius = this.radius;
          var startangle = offsetpercent * unit+Math.PI*.5;
          var endangle = startangle + percentage * unit - 0.001;
          var x1 = (radius) + (radius) * Math.sin(startangle);
          var y1 = (radius) - (radius) * Math.cos(startangle);
          var x2 = (radius) + (radius) * Math.sin(endangle);
          var y2 = (radius) - (radius) * Math.cos(endangle);
          var big = 0;
          if (endangle - startangle > Math.PI) {
            big = 1;
          }
          var d = "M " + (radius) + "," + (radius) + // Start at circle center
            " L " + x1 + "," + y1 + // Draw line to (x1,y1)
            " A " + (radius) + "," + (radius) + // Draw an arc of radius r
            " 0 " + big + " 1 " + // Arc details...
            x2 + "," + y2 + // Arc goes to to (x2,y2)
            " Z"; // Close path back to (cx,cy)
          path.setAttribute("d", d); // Set this path 
          path.setAttribute("fill", color || '#f05f3b');

          this.chart.appendChild(path); // Add wedge to chart
        };

        // Content
        DonutChart.prototype.drawContent = function(_op) {
          _op = _op || {};
          var text = document.createElementNS(this.svgns, "text");
          text.setAttributeNS(null, 'x', '50%');
          // vertical position
          var y = this.radius, fs = 36;

          if(_op.label =='稍后查看'){
            fs = 22;
          } 
          if (_op.position === 'first') {
            y -= 10;
            fs = 14;
          } else if (_op.position === 'second') {
            y += 25;
          }
          text.setAttributeNS(null, 'y', y);
          text.setAttributeNS(null, 'font-size', fs);
          text.setAttributeNS(null, 'text-anchor', 'middle');
          text.setAttributeNS(null, "fill", _op.color);
          text.innerHTML = _op.label;

          this.chart.appendChild(text);
        }

        this.getChart = function(data) {
          return new DonutChart(data);
        };

      },
      link: function(scope, element, attr, ctrl) {
        scope.$watch('info', function(val) {
          if(val) {
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
