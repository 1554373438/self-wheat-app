(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ExchangeController', ExchangeController);

  /** @ngInject */
  function ExchangeController($state, SystemApi, $log, $ionicLoading, $stateParams, localStorageService, toastr) {

    var vm = this;

    vm.goBack = goBack;

    vm.fabulous = fabulous;

    vm.getDate = [];

    vm.cbId = localStorageService.get("cd_Id");

    vm.getlw = getlw;

    function getlw() {
      if (+vm.getDate.cb_first_type == 1) {
        getExchange();
      } else {
        getlottery();
      }
    }

    function getExchange() {
      SystemApi.getExchange({ "cb_id": vm.getDate.cb_id }).success(function(res) {
        $log.debug(vm.getDate.cb_id);
        if (+res.flag == 1) {
          toastr.info(res.msg);
          getDate({ "cb_id": vm.cbId });
        } else {
          toastr.info(res.msg);
        }
      })
    }

    function getlottery() {
      SystemApi.getlottery({ "cb_id": vm.getDate.cb_id }).success(function(res) {
        $log.debug(vm.getDate.cb_id)
        if (+res.flag == 1) {
          toastr.info(res.msg);
          getDate({ "cb_id": vm.cbId });
        } else {
          toastr.info(res.msg);
        }
      })
    }

    function getDate(obj) {

      SystemApi.getBannerDetails(obj).success(function(res) {

        if (+res.flag == 1) {
          var data = res.data;
          vm.getDate = data;
        }
      })
    }

    function goBack(detailImg) {
      var DetailImg = detailImg;
      localStorageService.set('DetailImg', DetailImg);
      $state.go("mall:exchange:detaild");

    }

    function fabulous() {
      if (+vm.getDate.praise_type == 0) {
        SystemApi.getSaveUserPraise({ "cb_id": vm.getDate.cb_id }).success(function(res) {
          if (+res.flag == 1) {
            vm.getDate.praise_type = 1;
          }
        })
      } else if (+vm.getDate.praise_type == 1) {
        SystemApi.getCancelUserPraise({ "cb_id": vm.getDate.cb_id }).success(function(res) {
          if (+res.flag == 1) {
            vm.getDate.praise_type = 0;
          }
        })
      }
    }

    getDate({ "cb_id": vm.cbId });
  }
})();
