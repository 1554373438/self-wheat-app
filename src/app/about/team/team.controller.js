(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('AboutTeamController', AboutTeamController);

  /** @ngInject */
  function AboutTeamController(SystemApi) {
    var vm = this;

    SystemApi.getTeam().then(function(res) {
      vm.list = res.data;
    });

  }
})();