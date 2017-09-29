(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EntertainmentController', EntertainmentController);

  /** @ngInject */
  function EntertainmentController($state, BridgeService, user, SystemApi, AppService) {
    var vm = this;
    SystemApi.EntertainmentList().success(function(res) {
      vm.items = res.data;
    })

    vm.select = select;

    function select(index) {
      var selectItem = vm.items[index];

      if (BridgeService.bridge) {
        BridgeService.send({
          type: 'activity',
          data: {
            name: selectItem['title'],
            link: selectItem['link'],
            needLogin: selectItem['needLogin'] || true,
            target: 'HtmlModuleTarget',
            action: 'htmlViewController'
          }
        });
      } else {
        if (user.sessionId) {
          external(selectItem);
        } else {
          AppService.login({
            onSuccess: function() {
              external(selectItem);
            }
          });
        }
      }
    }

    function external(item) {
      if (item.link.indexOf('/nono/activity/') > -1) {
        window.location = item.link;
      } else {
        $state.go('external', {
          name: item.title,
          link: item.link + '?sessionId=' + user.sessionId
        });
      }

    }

  }
})();
