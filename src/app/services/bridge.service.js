(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('BridgeService', BridgeService);

  /** @ngInject */
  function BridgeService($log, $rootScope, $ionicScrollDelegate, CLIENT_VERSION) {
    var self = this,
      isAndroid = ionic.Platform.isAndroid(),
      newIosBridge = CLIENT_VERSION >= '4.4.0' && !isAndroid;

    function setupNewIosBridge(callback) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
    }


    self.init = function() {
      $log.info('init BridgeService');

      if(window.WebViewJavascriptBridge) {
        self.bridge = window.WebViewJavascriptBridge;
      } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
          self.bridge = WebViewJavascriptBridge;
        }, false);
      }

      if(newIosBridge) {
        setupNewIosBridge(function(bridge) {
          self.bridge = bridge;

          // reset scroll
          bridge.registerHandler('pageShow', function(data, responseCallback) {
            $ionicScrollDelegate.scrollTop(true);
            responseCallback && responseCallback();
          });
        });
      }

      // for handle android back event
      window.back = function() {
        $rootScope.$ionicGoBack();
      };
    };


    self.backToApp = function() {
      self.send({ type: 'backToApp' });
    };

    self.send = function(obj) {
      $log.info(obj);
      if (self.bridge) {
        self.bridge.callHandler('MZNativeHandler', obj, function(data) {
          obj.callback && obj.callback(data);
        });
      } else {
        $log.error('no js bridge');
      }
    };

    self.openNativePage = function(options) {
      if (!self.bridge) {
        return;
      }
      var link = "mzjf://" + options.target + '_' + options.action + "/";
      var count = 0;
      for (var key in options.search) {
        if (count++ === 0) {
          link += "?";
        } else {
          link += "&";
        }
        link += key + '=' + encodeURIComponent(options.search[key]);
      }

      self.send('pageRoute', {
        link: link
      }, function(msg) {
        if (options.callback) { options.callback(msg); }
      });
    }

  }
})();
