(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('OpenAppService', OpenAppService);

  function OpenAppService($location, $window, $rootScope, $timeout) {
    var self = this,
      isIOS = ionic.Platform.isIOS(),
      isAndroid = ionic.Platform.isAndroid(),
      downloadPath = "https://m.nonobank.com/mxdsite/skipurl/?comefrom=BrandSpokesman&nexturl=http%3A%2F%2Fa.app.qq.com%2Fo%2Fsimple.jsp%3Fpkgname%3Dcom.nonoapp";

    self.openApp = function(_page) {
      if (isIOS) {
        openIOS(_page);
      } else if (isAndroid) {
        openAndroid(_page);
      } else {
        window.location = _page;
      }
    }

    function openIOS(page) {
      $window.location.href = 'NONOBANK://';
      var timer = $timeout(function() {
        $window.location.href = page || downloadPath;
      }, 1500);
      //打开APP后，自动移除下载跳转
      window.onblur = function() {
        if (timer) {
          timer = null;
        }
      }
    }

    function openAndroid(page) {
      var timer;
      // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
      var ifr = document.createElement("iframe");
      ifr.style.cssText = "display:none;width:0px;height:0px;";
      document.body.appendChild(ifr);
      ifr.src = 'NONOBANK://'; //APP定义的打开协议
      //1秒内未打开APP，则跳转下载等。
      var t = Date.now();
      $timeout(function() {
        if (Date.now() - t < 600) {
          $window.location.href = page || downloadPath;
        }
      }, 500);

      //摘自“淘宝”，打开APP后，自动移除下载跳转
      window.onblur = function() {
        if (timer) {
          timer = null;
        }
        if (ifr) {
          document.body.removeChild(ifr);
        }
      }
    }
  }

})();
