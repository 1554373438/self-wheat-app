/**
 * Created by lucongcong on 17/5/15.
 */
(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('FreezeController', FreezeController);

  /** @ngInject */
  function FreezeController(EbankService, PayApi, toastr, $scope, utils, TrdApi) {
    var vm = this,
        submitSwitch = false;
    vm.goHscg = goHscg;

    $scope.$on('$ionicView.beforeEnter', init);

    // vm.freezeData = [
    //   {typeDesc:'提现',amount:'3000044444',time:'2017-10-20',isOper:0,statusDesc:'审核中'},
    //   {typeDesc:'诺诺',amount:'3000',time:'2017-03-20',isOper:1,statusDesc:'审核通过'}
    // ];
    function init() {
      PayApi.getFreezeInfo().success(function(res){
        vm.freezeData = [];
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;

        data && data.forEach(function(item) {
          item.time = item.time.substr(0,10);
          item.amount = item.amount.toFixed(2);
          vm.freezeData.push(item);
        });
      }).error(function () {
        vm.freezeData = [];
      });




    }

    function goHscg(item) {
      if (submitSwitch || item.isOper !== 1) return; //isOper为0时不可操作
      if (!submitSwitch) {
        submitSwitch = true;
        TrdApi.freezeTrdSubmit(item).success(function(res) {
          submitSwitch = false;
          if (!res.succeed) {
            utils.alert({
              title: '提示',
              subTitle: res.errorMessage
            });
            return;
          }
          var data = res.data;
          if (data) {
            var formData = data.formData;
            if(formData && formData.FORGERPWD_URL){
              if(formData.FORGERPWD_URL.substr(0,12) == 'https://www.'){
                utils.alert({
                  title: '提示',
                  subTitle: '该笔交易订单为PC订单，为了您的资金安全，请您去平台PC官网继续完成该笔操作！',
                });
                return;
              }
              if(formData.FORGERPWD_URL.substr(0,12) != 'https://www.' && formData.TRANSACTION_URL.indexOf('urlCallBack') < 0){
                utils.alert({
                  title: '提示',
                  subTitle: '该笔交易订单为APP订单，为了您的资金安全，请您去平台APP继续完成该笔操作！',
                });
                return;
              }

            }
            var redisKey = data.redisKey;
            EbankService.goPage('pwd/enter.html', {redisKey: redisKey});
          }
        }).error(function() {
          submitSwitch = false;
        });

      }
    }

  }
})();
