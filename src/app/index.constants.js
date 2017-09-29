/* global moment:false */
(function() {
  'use strict';

  angular
    .module('nonoApp')
    .constant('HOST', 'https://m.stb.nonobank.com')
    .constant('LIVE_LINK', 'https://m.nonobank.com/nono/live/?roomId=215042')
    .constant('APPID', 'nono')
    .constant('WECHAT_SHARE_ACCOUNT', 'maqian')
    .value('user', {
      sessionId: '',
      jwt: ''
    })
    .factory('APISERVER', function($location, HOST) {
      var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;
      // var feserverHost = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST_FESERVER;
      return {
        MSAPI: host + '/msapi',
        NONOWEB: host + '/nono-web',
        FESERVER: host + '/feserver',
        HOST: host
      };
    })
    .factory('CLIENT_VERSION', function($location) {
      var search = $location.search();

      return search.version || '';
    })
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
    })

})();
