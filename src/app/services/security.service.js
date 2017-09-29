(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('SecurityService', SecurityService);

  function SecurityService(md5, APPID, qs) {
    var self = this;
    var keyName = [
      [115, 105, 103, 110, 97, 116, 117, 114, 101],
      [110, 111, 110, 99, 101, 115, 116, 114],
      [97, 112, 112, 73, 100],
      [116, 105, 109, 101, 115, 116, 97, 109, 112]
    ];

    function getKeyName(index) {
      var ret = '';
      for (var i = 0; i < keyName[index].length; i++) {
        ret += String.fromCharCode(keyName[index][i]);
      }
      return ret;
    }

    function getTime() {
      var offsetTime = +sessionStorage.getItem('mzST');
      var curTime = Date.now() + offsetTime;
      return curTime;
    }


    self.getSign = function(params) {
      var params = params || {},
        sign = '';
      var appKey = md5.createHash(APPID).substr(7, 16);

      params[getKeyName(3)] = getTime();
      params[getKeyName(1)] = Math.random().toString(36).substr(2, 15);
      sign = qs.stringify(params, { sort: alphabeticalSort, arrayFormat: 'repeat', allowDots: true, encode: true });
      sign += appKey;
      sign = md5.createHash(sign);
      params[getKeyName(0)] = sign;
      params[getKeyName(2)] = APPID;

      return params;

      function alphabeticalSort(a, b) {
        try {
          return a.localeCompare(b);
        } catch(e) {
          return a > b;
        }
      }

    }

  }

})();
