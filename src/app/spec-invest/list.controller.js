(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SpecInvestController', SpecInvestController);

  /** @ngInject */
  function SpecInvestController($scope, SpecInvestApi, $stateParams, $state, $rootScope, BridgeService, BILog, $location, $timeout) {
    var isShare = $stateParams.isShare;
    var vm = this, pageIndex, itemsPerPage;

    vm.goToDetail = goToDetail;
    vm.changeStatus = changeStatus;
    vm.loadMore = load;
    vm.share = share;

    init();

    function init() {
      pageIndex = 0;
      itemsPerPage = 6;

      vm.products = [];
      load();
    }

    function load() {
      SpecInvestApi.getSpecInvestInfo({
        pageIndex: pageIndex,
        itemsPerPage: itemsPerPage
      }).success(function(res) {
        if(res.flag === 1) {
          var info = res.data;
          if(pageIndex === 1) {
            vm.banner = info.banner && info.banner[0].path;
          }
          
          info.characterInvest.forEach(function(item) {
            vm.products.push(item);
          });

          vm.hasMoreData = info.characterInvest.length === itemsPerPage;
        }
      }).finally(function () {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      pageIndex++;
    }
    
    function changeStatus(index) {
      $timeout(function(){
        vm.products[index]['status'] = 3;
      }, 1000);
    }

    function goToDetail(index) {
      var product = vm.products[index];

      // BI Log
      BILog.click({
        page_name: 'product_list',
        page_module: 'list',
        title: product.productName,
        page_info: {
          product_id: product.id,
          pos: ++index
        }
      });

      $state.go('specInvest:detail', {name: product.productName, isShare: isShare});
    }

    function share() {
      var base = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') + location.pathname,
          url = base + '#/tab/specInvest/true',
          iconPath = base + 'assets/images/spec_invest_share_icon.jpg';

      BridgeService.send({
        type: 'share',
        data: {
          share_title: '赚钱购物，全场白拿，0元计划带你嗨！', //分享title
          share_desc: '这里有最硬的尖货，最嗨的生活，妥妥的新财商！',  //分享desc
          share_url: url,   //分享链接url
          share_icon: iconPath   //分享小图标url
        }
      });
    }

    $scope.$on('$ionicView.beforeLeave', function() {
      // BI Log
      BILog.leave({
        page_name: 'product_list',
        page_info: {
          category: 'special'
        }
      });
    });
  }
})();
