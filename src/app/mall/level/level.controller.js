(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MallLevelController', MallLevelController);

  /** @ngInject */
  function MallLevelController($scope, $stateParams, SystemApi, $timeout, $ionicSlideBoxDelegate, user, $rootScope) {
    var vm = this;
    vm.info = {};
    vm.tabs = [];
    vm.select = select;
    init();

    $scope.$on('$ionicView.afterEnter', function() {
      $ionicSlideBoxDelegate.update();
    });

    function init() {
      vm.info.showName = user.realName || user.mobileEncrypted || '';
      $rootScope.$on('getUserInfo.succeed', function() {
        vm.info.showName = user.realName || user.mobileEncrypted || '';
      });
      
      SystemApi.getLevel().then(function(res) {
        vm.tabs = res.data;
        vm.info.number = parseInt($stateParams.number) || 0;
        if (vm.info.number > 3 || vm.info.number < 0) {
          vm.info.number = 0;
        }
        initIcon();
        select(0);
      });

    }

    function initIcon() {
      angular.forEach(vm.tabs, function(tab) {
        var levelArr = tab.level;
        var len = levelArr.length;
        tab.grayIcon = true;
        for (var i = 0; i < len; i++) {
          if (vm.info.number == levelArr[i]) {
            tab.grayIcon = false;
            return;
          }
        }
      });
    }

    function select(index) {
      angular.forEach(vm.tabs, function(tab) {
        tab.active = false;
      });

      var tab = vm.tabs[index];
      tab.active = true;
      vm.detail = tab['detail'];

      vm.slideLeft = true;

      $timeout(function() {
        vm.slideLeft = false;
      }, 500);
    }
  }
})();
