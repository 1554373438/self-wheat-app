(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('AboutNewsController', AboutNewsController);

  /** @ngInject */
  function AboutNewsController(SystemApi, $ionicScrollDelegate) {
    var vm = this;

    vm.toggle = toggle;

    // init data
    init();

    function init() {
      SystemApi.getNews().then(function(res) {
        vm.lists = res.data;
      });
    }

    function toggle(index) {
      vm.lists[index].show = !vm.lists[index].show;
      $ionicScrollDelegate.resize();
    }

  }
})();
