(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('productList', productList)
    .directive('productItem', productItem);

  /** @ngInject */
  function productList() {
    var directive = {
      restrict: 'E',
      transclude: true,
      template: '<div class="list nono-product-list" ng-transclude></div>',
      link: function(scope, element, attr) {

      }
    };

    return directive;
  }

  /** @ngInject */
  function productItem() {
    var directive = {
      restrict: 'E',
      scope: {
        product: '=',
        type: '@'
      },
      templateUrl: 'app/components/product-list/product.html',
      link: function(scope, element, attr) {


        var format = function() {
          var p = scope.product,
            type = scope.type;
          if (type == 'jh') {
            p.rateLabel = ' 历史年化收益率约';
            p.expectLabel = '后可申请债转退出';
          } else if (type == 'nny') {
            p.rateLabel = '借款年化利率';
            p.expectLabel = '借款期限';
          } else if (type == 'debt') {
            p.rateLabel = '借款年化利率';
            p.expectLabel = '剩余期限';
          }
          if (p.rate_show && p.rate_show.indexOf('+') > -1) {
            var rates = p.rate_show.split('+');
            var rate = rates[0].replace('%', '');
            var rateNext = rates[1].replace(/([\d.])/g, '<span class="font-18">$1</span>');
            p.rateShow = '<span class="font-32">' + rate + '</span>' + '%<span class="font-18">+</span>' + rateNext;
          } else {
            p.rateShow = p.rate_show && p.rate_show.replace(/([\d.])/g, '<span class="font-32">$1</span>');
          }


          p.duration = p.expect + p.expect_unit_show;

          if (type == 'jh' && p.status == 99) {
            p.balanceShow = false;
            return;
          }
          if (type == 'nny' && p.status == 3) {
            p.balanceShow = false;
            return;
          }
         
          if (type != 'debt') {
            if (p.balance >= 50000) {
              p.balanceShow = false;
            } else if (p.balance < 50000 && p.balance >= 1000) {
             var balance = Math.floor(p.balance/1000);
             p.balanceShow = (balance/10).toFixed(1)+'万';
            } else {
              p.balanceShow = Math.floor(p.balance) + '元';
            }
          } else {
            p.balanceShow = p.price.toFixed(2);
          }

        }




        scope.$watch('product', format, true);


      }
    };

    return directive;
  }

})();
