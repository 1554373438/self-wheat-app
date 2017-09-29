(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MobileUpdateController', MobileUpdateController);

  /** @ngInject */
  function MobileUpdateController($state, $timeout, user, UserService, UserApi, toastr, utils) {
    var vm = this;
    vm.info = {
      oriMobile: user.mobile,
      loginPwd: null,
      newMobile: null,
      validCode: null

    };
    vm.sms = {
      label: '发送验证码',
      countdown: null,
      validCode: null
    };

    vm.validLoginPwd = validLoginPwd;
    vm.sendCode = sendCode;
    vm.submit = submit;

    function validLoginPwd() {
      UserApi.validateUserPwd({ pwd: vm.info.loginPwd }).success(function(res) {
        if (res.flag != 1) {
          toastr.info(res.msg);
          return;
        }
        $state.go('mobile:update:step2');
      })
    }



    function sendCode() {
      if (!vm.info.newMobile) {
        toastr.info('请输入手机号');
        return;
      }
      if (!/^1\d{10}$/.test(vm.info.newMobile)) {
        toastr.info('手机号格式不正确');
        return;
      }
      UserApi.validateMobile({ mobile: vm.info.newMobile }).success(function(res) {
        if (res.flag != 1) {
          toastr.info(res.msg);
          return;
        }
        if (res.flag === 1) {
          startCountdown();
        }
      });
    }

    function startCountdown() {
      vm.sms.countdown = 60;
      var fn = function() {
        if (vm.sms.countdown) {
          vm.sms.countdown--;
          vm.sms.label = vm.sms.countdown;
          $timeout(fn, 1000);
        } else {
          vm.sms.label = '重新发送';
        }
      };

      fn();
    }

    function submit() {
      if (!vm.info.newMobile) {
        toastr.info('请输入手机号');
        return;
      }
      if (!/^1\d{10}$/.test(vm.info.newMobile)) {
        toastr.info('手机号格式不正确');
        return;
      }

      if (!/^\d{6}$/.test(vm.sms.validCode)) {
        toastr.info('验证码格式不正确');
        return;
      }
      UserApi.validateMobileVerification({
        mobile: vm.info.newMobile,
        validCode: vm.sms.validCode
      }).success(function(res) {
        if (res.flag != 1) {
          toastr.info(res.msg);
          return;
        }
        user.mobile = utils.formatPhone(vm.info.newMobile);
        UserService.updateUser(user);
        $state.go('setting');
      });
    }

  }
})();
