(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ResetPasswordController', ResetPasswordController);

  /** @ngInject */
  function ResetPasswordController(UserApi, $state, $stateParams, toastr) {
    var vm = this;
    var pwdPattern = /^(?!\d+$|[a-zA-Z]+$|[\W-_]+$)[\s\S]{6,16}$/;

    vm.checkNew = checkNew;
    vm.checkConfirm = checkConfirm;
    vm.submit = submit;

    function checkNew() {
      if(!pwdPattern.test(vm.user.newPwd)) {
        toastr.info('新密码不符合规则！');
        vm.invalid = true;
      }
    }

    function checkConfirm() {
      if(vm.user.newPwd != vm.user.confirmPwd) {
        toastr.info("两次输入密码不一致！");
        vm.invalid = true;
      }
    }


    function submit() {
      UserApi.changeLoginPwd({
        sessionId: $stateParams.sessionId,
        password: vm.user.newPwd
      }).success(function(res) {
        if(res.flag == 3) {
          $state.go('home');
        } else {
          toastr.info(res.msg);
        }
      })

    }


  }
})();
