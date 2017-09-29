(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsDebtorController', RecordsDebtorController);

  /** @ngInject */
  function RecordsDebtorController($stateParams, $rootScope, InvtApi, AgreementService, localStorageService, $log) {
    var vm = this,
      pageIndex = 1,
      pageSize = 10;
    var id = $stateParams.id;//vaId, 债转为dblId
    vm.list = [];
    vm.hasMoreData = false;
    vm.loadMore = getList;
    vm.showProtocol = showProtocol;


    init();

    function init() {
      var debtList = localStorageService.get('record').borrowDebts;
      if (debtList) {
        vm.list = debtList.map(function(_item) {
          // _item.boName = _item.boName.substr(0, 1) + '**';
          _item.boName = _item.boName.replace(/.(?=.)/g, '*');
          _item.transTime = _item.boTime;
          _item.investPrice = _item.boPrice;
          _item.agreementType = 1;
          _item.dblId = id;
          return _item;
        });
        return;
      }
      getList();
    }

    function getList() {
      InvtApi.getUserDebtDetails({
        vaId: id,
        pi: pageIndex,
        ps: pageSize
      }).success(function(res) {
        if (res.data && res.data.list) {
          vm.list = vm.list.concat(res.data.list);
        }
        vm.hasMoreData = res.data && res.data.list && res.data.list.length === pageSize;
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pageIndex++;
    }

    function showProtocol(index) {
      var item = vm.list[index];
      var params = {};
      var name = '';
      params.dblId = item.dblId;
      if (item.agreementType == 1) {
        name = '债转协议';
      } else {
        name = '借款协议';
      }
      AgreementService.getAgreementInvest(params, name);
    }
  }
})();
