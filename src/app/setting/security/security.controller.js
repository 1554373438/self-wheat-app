(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SecurityController', SecurityController);

  /** @ngInject */
  function SecurityController(EbankService, user) {
    var vm = this;
    vm.setPayPwd = setPayPwd;


    if (user.hasPayPwd) {
      vm.text = '重置徽商交易密码';
    } else {
      vm.text = '设置徽商交易密码';
    }

    function setPayPwd() {
      if (!user.hasEBank) {
        EbankService.showPopup('设置密码');
        return;
      }
      if (user.hasPayPwd) {
        EbankService.goPage('pwd/reset.html');
      } else {
        EbankService.goPage('pwd/set.html');
      }
    }

  }
})();
