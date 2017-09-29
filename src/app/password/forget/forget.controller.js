(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ForgetPasswordController', ForgetPasswordController);

  /** @ngInject */
  function ForgetPasswordController(UserApi, toastr, $timeout, $state) {
    var vm = this;

    vm.sendMsgText = '发送验证码';
    vm.sendValidateMobile = sendValidateMobile;
    vm.findPwd = findPwd;


    function sendValidateMobile() {
      if(!vm.user.mobile) {
        toastr.info('请输入手机号');
        vm.invalid = true;
        return;
      }
      if(!/^1\d{10}$/.test(vm.user.mobile)) {
        toastr.info('手机号格式不正确');
        vm.invalid = true;
        return;
      }
      UserApi.sendValidateMobile({'mobilenum':vm.user.mobile}).success(function(res) {
        if(res.flag !=1 ) {
          toastr.info(res.msg);
          return;
        }
        if (res.flag === 1) {
          startCountdown();
        }
      });
    }

    function startCountdown() {
      vm.countdown = 60;
      var fn = function() {
        if (vm.countdown) {
          vm.countdown--;
          vm.sendMsgText  = vm.countdown;
          $timeout(fn, 1000);
        } else {
           vm.sendMsgText  = '重新发送';
        }
      };

      fn();
    }

    function findPwd() {
      if(!vm.user.mobile) {
        toastr.info('请输入手机号');
        vm.invalid = true;
        return;
      }
      if(!/^1\d{10}$/.test(vm.user.mobile)) {
        toastr.info('手机号格式不正确');
        vm.invalid = true;
        return;
      }

      if(!/^\d{4}$/.test(vm.user.messageCode)) {
        toastr.info('验证码格式不正确');
        vm.invalid = true;
        return;
      }
      UserApi.findLoginPwd({
        mobilenum: vm.user.mobile,
        validation: vm.user.messageCode,
        idCard: vm.user.idCard
      }).success(function(res) {
        if(res.flag !=5 ) {
          toastr.info(res.msg);
          return;
        }
        $state.go('password:reset',{sessionId: res.data.session_id});
      })
    }
  }
})();
