(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MallProductDetailController', MallProductDetailController);

  /** @ngInject */
  function MallProductDetailController(BasicApi, $stateParams) {
    var vm = this;
    var id = $stateParams.id;
    BasicApi.getMallProductDetail({ id: id }).then(function(res) {
      if (res.flag == 1) {
        vm.info = res.data.data.text.trim();
      }
    });
  }
})();
