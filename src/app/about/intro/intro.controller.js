(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('AboutIntroController', AboutIntroController);

  /** @ngInject */
  function AboutIntroController(SystemApi) {
    var vm = this;

    SystemApi.getIntro().then(function(res) {
      vm.info = res.data;
    });

  }
})();