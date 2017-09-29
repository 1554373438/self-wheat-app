(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SafeController', SafeController);

  /** @ngInject */
  function SafeController($ionicHistory, $location, $ionicScrollDelegate, $scope, $timeout, $stateParams) {
    var vm = this,
      part2, part3, part4, scrollContentStyle, mainScroll, timer = null;
    vm.tabIndex = 1;
    vm.watchScroll = watchScroll;
    vm.selectTab = selectTab;
   

    if ($ionicHistory.backView() || /terminal/.test($location.absUrl())) {
      vm.showBackButton = true;
    }

    $scope.$on('$ionicView.loaded', function() {
      $timeout(function() {
        part2 = document.getElementById('part2').offsetTop;
        part3 = document.getElementById('part3').offsetTop;
        part4 = document.getElementById('part4').offsetTop;
        scrollContentStyle = getComputedStyle(document.getElementById('scroll_content').getElementsByClassName("scroll")[0]);
        mainScroll = $ionicScrollDelegate.$getByHandle('mainScroll');

        init();
      }, 250);
    });



    function init() {
      var stateParams = $stateParams.part;
      switch (stateParams) {
        case 'cunguan':
          selectTab(2);
          break;
        case 'data':
          selectTab(4);
          break;
        case 'fengkong':
          selectTab(3);
          break;
        default:
          selectTab(1);
          break;
      }
    }



    function getTx() {

      // if (!scrollContentStyle) {
      //   return 0;
      // }
      var matrix = scrollContentStyle.getPropertyValue("-webkit-transform") ||
        scrollContentStyle.getPropertyValue("-moz-transform") ||
        scrollContentStyle.getPropertyValue("-ms-transform") ||
        scrollContentStyle.getPropertyValue("-o-transform") ||
        scrollContentStyle.getPropertyValue("transform");

      var top = matrix.split(',')[5].replace(/\)/g, '');
      return -(+top) || 0;
    }


    function watchScroll() {
      if (timer) {
        $timeout.cancel(timer);
        timer = null;
      }
      timer = $timeout(function() {
        var top = getTx();
        if (top == undefined || top == null) {
          return;
        }

        if (top < part2) {
          vm.tabIndex = 1;
        } else if (top < part3) {
          vm.tabIndex = 2;
        } else if (top < part4) {
          vm.tabIndex = 3;
        } else {
          vm.tabIndex = 4;
        }
      }, 50);
    }


    function selectTab(index) {
      // if (!mainScroll) {
      //   return;
      // }
      var index = index || vm.tabIndex;
      switch (+index) {
        case 1:
          mainScroll.scrollTo(0, 0, true);
          break;
        case 2:
          mainScroll.scrollTo(0, part2, true);
          break;
        case 3:
          mainScroll.scrollTo(0, part3, true);
          break;
        case 4:
          mainScroll.scrollTo(0, part4, true);
      }
    }

  }
})();
