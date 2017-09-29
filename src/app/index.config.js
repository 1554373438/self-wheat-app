(function() {
  'use strict';

  angular
    .module('nonoApp')
    .config(config);

  /** @ngInject */
  function config($provide, $logProvider, $httpProvider, toastrConfig, $ionicConfigProvider, localStorageServiceProvider, $sceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 2000;
    toastrConfig.positionClass = 'toast-center';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = false;
    toastrConfig.preventOpenDuplicates = true;

    $ionicConfigProvider.tabs.position('bottom').style('standard');
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);

    // http interceptor
    $httpProvider.interceptors.push(function($rootScope, $log, $q, user, SecurityService) {
      var counter = 0;
      var reg = /html|jpg|jpeg|png|gif/;

      return {
        request: function(config) {
          if (config.url && reg.test(config.url)) {
            return config;
          }

          if (!config.silence) {
            counter++;
            $rootScope.loading = true;
            $rootScope.$broadcast('loading:show');
          }

          /* 
          * add jwt to feserver api request headers
          * msapi doesn't accept `jwt` key in headers
          */
          if (user.jwt && /feserver/.test(config.url)) {
            config.headers.jwt = user.jwt;
          }
          if (config.method == 'GET') {
            var params = SecurityService.getSign(config.params || {});
            config.params = params;
          } else if (config.method == 'POST') {
            var data = SecurityService.getSign(config.data || {});
            config.data = data;
          }

          return config;
        },
        response: function(response) {
          if (response.config.url && reg.test(response.config.url)) {
            return response;
          }

          if (!response.config.silence) {
            counter--;

            if (!counter) {
              $rootScope.loading = false;
              $rootScope.$broadcast('loading:hide');
            }
          }

          return response;
        },
        responseError: function(rejection) {
          $rootScope.$broadcast('ajax:error', rejection);
          if (rejection.config.url && reg.test(rejection.config.url)) {
            return $q.reject(rejection);
          }
          if (!rejection.config.silence) {
            counter--;
            if (!counter) {
              $rootScope.loading = false;
              $rootScope.$broadcast('loading:hide');
            }
          }
          return $q.reject(rejection);
        }
      }
    });

    // set http defaults
    // $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    $httpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' };

    // local storage config
    localStorageServiceProvider
      .setPrefix('nonoApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

    // disable sec
    $sceProvider.enabled(false);

    /**
     * extra support for $location.search() can't get correct data for `?a=b#/home`
     */
    /** @ngInject */
    $provide.decorator('$location', function($delegate) {
      var obj = $delegate.search();

      function ls() {
        var query_string = {};
        var query = window.location.search.substring(1);

        if (query) {
          var vars = query.split("&");
          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
              query_string[pair[0]] = decodeURIComponent(pair[1]);
              // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
              var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
              query_string[pair[0]] = arr;
              // If third or later entry with this name
            } else {
              query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
          }
        }

        return angular.merge(obj, query_string);
      }

      $delegate.search = ls;

      return $delegate;
    });

  }

})();
