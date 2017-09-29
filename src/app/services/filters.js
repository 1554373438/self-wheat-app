(function() {
  'use strict';

  angular
    .module('nonoApp')
    .filter('collectionMode', collectionMode)
    .filter('authType', authType)
    .filter('withdrawStatus', withdrawStatus)
    .filter('phoneEncrypt', phoneEncrypt)
    .filter('nameEncrypt', nameEncrypt)
    .filter('iconStatus', iconStatus)
    .filter('yysStatus', yysStatus)
    .filter('floor', floor)

  var iconStatusMap = {
    '0': '',
    '1': 'new',
    '2': 'hot'
  }
  var modeMap = {
    '0': '先息后本',
    '1': '到期还本付息',
    '2': '等额本息'
  };

  var authTypeMap = {
    1: '易联支付',
    2: '快钱支付',
    3: '新生支付'
  };

  var withdrawStatusMap = {
    0: '待受理',
    1: '已受理',
    2: '处理中',
    3: '撤消申请',
    4: '提现成功',
    5: '提现失败'
  };

  var yysStatusMap = {
    0: '锁定期内不可退出',
    1: '退出中',
    2: '已退出'
  };

  /** @ngInject */
  function collectionMode() {
    return function(str) {
      return modeMap[str];
    };
  }

  function phoneEncrypt() {
    return function(str) {
      if (str) {
        return str.substr(0, 3) + '****' + str.substr(-4);
      }
    };
  }

  function nameEncrypt() {
    return function(str) {
      if (str) {
        return str.replace(/(\w{2}).*/g, '$1**');
        // return str.replace(/.{2}(?=.)/g, '*');

      }
    };
  }

  function authType() {
    return function(str) {
      return authTypeMap[str];
    };
  }

  function withdrawStatus() {
    return function(str) {
      return withdrawStatusMap[str];
    };
  }

  function iconStatus() {
    return function(str) {
      return iconStatusMap[str];
    };
  }

  function yysStatus() {
    return function(str) {
      return yysStatusMap[str];
    }
  }

  function floor() {
    return function(str) {
      if(str) {
        return Math.floor(+str);
      }
      
    }
  }


})();
