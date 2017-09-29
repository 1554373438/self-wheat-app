(function() {
  'use strict';

  angular
    .module('nonoApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $ionicLoading, $http, $httpParamSerializerJQLike, $ionicHistory, $ionicViewSwitcher, BridgeService, UserService, AppService, WechatShareService, BILog, user, $location, $timeout, toastr, CommonApi, CLIENT_VERSION, AppPopService) {
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
        noBackdrop: true,
        hideOnStateChange: true
      });
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    $rootScope.$on('ajax:error', function(evt, rejection) {
      if (rejection.config.method === 'POST') {
        toastr.info(rejection.status + ' : ' + rejection.statusText);
      }
    });




    // serialize http request data
    $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);

    // override ionicGoBack
    $rootScope.$ionicGoBack = function() {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else if (BridgeService.bridge) {
        BridgeService.backToApp();
      } else {
        var back = ($state.current || {}).defaultBack;
        if (!back) return;

        $ionicViewSwitcher.nextDirection('back');
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go(back.state || 'home', back.params);
      }
    };

    // routing interceptor
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState) {
      // enter from APP
      if (!user.jwt && user.sessionId && CLIENT_VERSION) {
        // prevent enter any page
        evt.preventDefault();
        // get jwt
        // UserService.getJwt();
        // continue last routing
        $rootScope.$on('getJwt.succeed', function() {
          $state.go(toState, toParams);
        });

        return;
      }
      switch (toState.name) {
        case 'product':
          var back = fromState.defaultBack;
          if (back && back.state === 'product') {
            toParams.type = back.params.type;
          }
          break;
        case 'flow':
        case 'talk':
        case 'mine':
        case 'envoy':
        case 'limit':
        case 'welfare':
        case 'mall':
        case 'card':
        case "freeze":
        case "task":
          if (!user.sessionId) {
            evt.preventDefault();
            AppService.login({
              onSuccess: function() {
                $state.go(toState.name, toParams);
                AppService.showNotePopup();
              },
              onCancel: function() {
                $rootScope.$ionicGoBack();
              }
            });
          }
          break;
        case 'external':
          if (/nono-app/.test(toParams.link)) {
            evt.preventDefault();
            $timeout(function() {
              $location.path(decodeURIComponent(toParams.link.split('#')[1]));
            }, 500);
          }
          break;
        case 'purchase':
          if (!user.sessionId) {
            evt.preventDefault();
            AppService.login({
              onSuccess: function() {
                $state.go(toState.name, toParams);
              }
            });
          }
          break;
        // case "records:investDetail":
        //   if(fromState.name == 'records:transferDetail'){
        //     console.log(55);
        //     $rootScope.$ionicGoBack = function () {
        //       $state.go('records:list',{type:0});
        //     };
        //   }
        //   break;
        // case "records:nnyDetail":
        //   if(fromState.name == 'records:transferDetail'){
        //     console.log(88);
        //     $rootScope.$ionicGoBack = function () {
        //       $state.go('records:list',{type:toParams.type});
        //     };
        //   }
        //   break;
      }

    });

    $rootScope.$on('$stateChangeSuccess', function() {
      // BI Log, page view event start
      BILog.enter();
    });

    // init security
    CommonApi.getSysTime().success(function(res) {
      if (res.succeed) {
        var sysTime = +res.data.timestamp;
        var offsetTime = sysTime - Date.now();
        sessionStorage.setItem("mzST", offsetTime);
      }
    });



    // init bridge
    BridgeService.init();

    // init UserService
    UserService.init();

    // init WechatShareService
    if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
      WechatShareService.init();
    }

    // show renamePopup
    var fromApp = /terminal=4/.test(window.location.href) ||  /terminal=5/.test(window.location.href);
    if (!localStorage.getItem('nonoRename') && !fromApp) {
      localStorage.setItem('nonoRename', '麦子金服财富');
      AppPopService.showRenamePopup();
    }
    



    $log.debug('runBlock end');
  }

})();
