(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('CommonApi', CommonApi);

  /** @ngInject */
  function CommonApi($http, $log, APISERVER, WECHAT_SHARE_ACCOUNT) {

    //获取系统当前时间
    this.getSysTime = function() {
      return $http.get(APISERVER.FESERVER + '/common/current');
    };

    // Common_Agreement
    this.getAgreementRegPrivacy = function(obj) {
     return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/agreement/privacy',
        params: {
          bizCode: obj.bizCode
        }
      });
    };

    this.getAgreementTemplate = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/agreement/template',
        params: {
          type: obj.type,
          productId: obj.productId
        }
      });
    };

    this.getAgreementInvest = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/agreement/invest',
        params: {
          vaId: obj.vaId,
          dblId: obj.dblId
        }
      });
    };

    // 消息-未读数
    this.getNoticeUnread = function() {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/notice/unread'
      });
    }

    // 消息-设置已读
    this.setNoticeRead = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/notice/read',
        params: {
          ids: obj.ids,
          isAll: obj.isAll
        }
      });
    }

    // 消息列表
    this.getNoticeList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/notice/list',
        params: {
          type: obj.type,
          pageNo: obj.pageNo,
          pageSize: obj.pageSize
        }
      });
    }

     // 消息详情
    this.getNoticeDetail = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/notice/detail',
        params: {
          type: obj.type,
          noticeId: obj.noticeId
        }
      });
    }





    this.getWechatSignature = function() {
      return $http.get(APISERVER.FESERVER + '/wechat/signature', {
        params: {
          url: location.href.split('#')[0],
          type: /m.nonobank.com/.test(location.host) ? 'nonobank' : WECHAT_SHARE_ACCOUNT
        }
      });
    };

    this.getPopUpBanner = function(obj) {
     return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/banner',
        params: {
          position: obj.position,
          type: obj.type
        }
      });
    };

    $log.debug('CommonApi end');

  }
})();
