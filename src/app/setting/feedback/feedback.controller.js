(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('FeedbackController', FeedbackController);

  /** @ngInject */
  function FeedbackController($state, toastr, utils, UserApi, $timeout) {
    var vm = this;

    vm.submit = submit;

    function submit() {
      UserApi.feedback({
        content: vm.content
      }).success(function(res) {
        toastr.info(res.msg);

        if(res.flag === 1) {
          $timeout(utils.goBack, 1000);
        }
      });
    }

  }
})();
