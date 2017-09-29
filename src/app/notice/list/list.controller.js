(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MsgController', MsgController);

  /** @ngInject */
  function MsgController($scope, $rootScope, CommonApi) {
    var vm = this,
      slider, curInfo = null,
      pageSize = 10;
    vm.info = {
      notice: {
        type: 1,
        hasMoreData: true,
        pageIndex: 1,
        list: []
      },
      system: {
        type: 0,
        hasMoreData: true,
        pageIndex: 1,
        list: []
      }
    };
    vm.loadMore = getList;


    init();

    function init() {
      vm.sliderIndex = 0;
      $scope.$watch(function() {
        return vm.sliderIndex;
      }, function(val) {
        slider && slider.slideTo && slider.slideTo(+val);
      });

      $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        slider = data.slider;
      });

      $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        vm.sliderIndex = data.slider.activeIndex;
        $scope.$apply();
        getList();
      });

      getList();
    }



    function getList() {
      debugger;
      if (+vm.sliderIndex == 0) {
        curInfo = vm.info.notice;
      } else {
        curInfo = vm.info.system;
      }
      CommonApi.getNoticeList({ type: curInfo['type'], pageNo: curInfo['pageIndex'], pageSize: pageSize }).success(function(res) {
        if (res.succeed) {
          var data = res.data;
          curInfo.list = curInfo.list.concat(data);
          curInfo.hasMoreData = data.length === pageSize;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      curInfo.pageIndex++;
    }

  }


})();
