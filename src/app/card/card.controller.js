(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CardController', CardController);

  /** @ngInject */
  function CardController($state, AccApi, EbankService) {
    var vm = this;
    vm.data = null;
    vm.goDetail = goDetail;
    init();

    function init() {
      AccApi.getBankCard({ isLimit: 1 }).success(function(res) {
        if (res.succeed) {
          vm.data = res.data;
          vm.data.tail = res.data.bankCardNo && res.data.bankCardNo.slice(-4);
        }
      });
    }

    function goDetail() {
      EbankService.goPage('eBank/eBank.html');
    }

  }
})();
