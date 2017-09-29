(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('UpdatePasswordController', UpdatePasswordController);

  /** @ngInject */
  function UpdatePasswordController($state, $stateParams, localStorageService, $timeout, $log, user,  UserService, UserApi, toastr, utils) {
    var vm = this,
        pattern = /^(?!\d+$|[a-zA-Z]+$|[\W-_]+$)[\s\S]{6,16}$/;

    vm.user = {};

    vm.checkNew = checkNew;
    vm.checkConfirm = checkConfirm;
    vm.submit = submit;

    function checkNew() {
      if(vm.user.newPassword && !pattern.test(vm.user.newPassword)) {
        toastr.info('新密码不符合规则！');
        vm.nInvalid = true;
      }
    }

    function checkConfirm() {
      if(vm.user.confirm && (vm.user.newPassword !== vm.user.confirm)) {
        toastr.info('两次输入密码不一致！');
        vm.nMismatch = true;
      }
    }
    
    function changePassword() {
      UserApi.changePassword(vm.user).success(function(res) {
        if(!res.succeed){
          toastr.info(res.errorMessage);
          return;
        }
        toastr.info('登录密码修改成功！');
        $timeout(utils.goBack, 1000);
      });
    }

    function submit() {
      UserApi.checkOldPassword(vm.user.oriPassword).success(function (res) {
        if(!res.data){
          toastr.info('原密码输入错误！');
          return;
        }
        changePassword();
      })
    }
    

  }
})();
