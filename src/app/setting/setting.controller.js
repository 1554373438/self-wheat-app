(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SettingController', SettingController);

  /** @ngInject */
  function SettingController($scope, UserService, EbankService, $state, utils, user) {
    var vm = this;

   

    // methods
    vm.jumpSw = jumpSw;
    vm.goHscg = goHscg;
    vm.logout = logout;
    vm.goCall = goCall;

    $scope.$on('$ionicView.beforeEnter', function() {
      vm.info = user;
      UserService.updateEbankInfo();

    });

    function logout() {
      utils.confirm({
        content: '<p>确认安全退出吗？</p>',
        okType: 'button',
        cssClass: 'captcha-pop-1',
        onOk: UserService.logout
      });
    }

    function jumpSw() {
      if (vm.info.investAuth) return;

      if (!vm.info.hasPayPwd) {
        utils.confirm({
          title: '温馨提示',
          content: '<p>麦子金服财富已接入徽商存管，如需智能投资授权，请先设置交易密码。</p>',
          cssClass: 'text-left',
          okText: '确定',
          okType: 'button-positive button-clear',
          cancelText: '取消',
          cancelType: '',
          onOk: function() {
            EbankService.goPage('pwd/set.html');
          }
        });
        return;
      }

      EbankService.goPage('autoInvest/index.html?firstPage=1');
    }

    function goHscg() {
      EbankService.goPage('entrance');
    }

    function goCall() {
      utils.alert({
        'title': '拨打客服热线',
        'cssClass': 'setting-popup-container',
        'content': '<p><a href="tel:1010-0668">1010-0668</a></p><p><a href="tel:021-80225656">021-80225656</a></p>',
        'okText': '取消'
      });
    }
  }
})();
