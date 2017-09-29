(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ExternalController', ExternalController);

  /** @ngInject */
  function ExternalController($state, $stateParams, $ionicViewSwitcher, $ionicHistory, user, utils, WechatShareService) {
    var vm = this,
      link = $stateParams.link;
    vm.name = $stateParams.name;

    if (user.sessionId) {
      link += (link.indexOf('?') !== -1 ? '&' : '?') + 'sessionId=' + user.sessionId;
    }

    vm.link = link.replace('http:', 'https:');

    // handle iframe event
    window.addEventListener('message', function(evt) {
      console.log('iframe: ' + evt.data);
      var msg = evt.data;
      try {
        msg = JSON.parse(msg);
        if (msg) {
          // eg. handle backToApp
          if (msg.type === 'backToApp') {
            $ionicViewSwitcher.nextDirection('back');
            $ionicHistory.nextViewOptions({
              disableBack: true,
              historyRoot: true
            });
            $state.go('home');
          }
          // handle share
          if (msg.type === 'share') {
            WechatShareService.update(msg.data);
          }
        }

      } catch (e) {
        
      }



    }, false);

  }
})();
