(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('SystemApi', SystemApi);

  /** @ngInject */
  function SystemApi($http, $log, APISERVER, user) {
    this.getNoticeList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getAppArcList', {
        catType: obj.type,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    this.getSysMsgList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getSystemMsgAndEmailList', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    }

    this.getNoticeDetail = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/getArcDetailById',
        data: {
          id: obj.id
        }
      });
    };

    this.getSysMsgDetail = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/getSystemMsgOREmailDetail',
        data: {
          sessionId: user.sessionId,
          mess_id: obj.id
        }
      });
    };

    this.getNonoStoreIndex = function() {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/getNonoStoreIndex',
        data: {}
      });
    };

    this.getsignIn = function() {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/licai/signIn',
        data: {
          sessionId: user.sessionId
        }
      });
    };

    this.getsignInLog = function() {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/licai/signInLog',
        data: {
          sessionId: user.sessionId
        }
      });
    };

    this.getBannerDetails = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/getBangDetail',
        data: {
          sessionId: user.sessionId,
          cb_id: obj.cb_id
        }
      });
    };
    this.getSaveUserPraise = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/saveUserPraise',
        data: {
          sessionId: user.sessionId,
          cb_id: obj.cb_id
        }
      });
    }
    this.getCancelUserPraise = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/activityvip/cancelUserPraise',
        data: {
          sessionId: user.sessionId,
          cb_id: obj.cb_id
        }
      });
    }
    this.getBangList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getBangList', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    }
    this.getBangDrawList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getBangCouponOrDrawList', {
        sessionId: user.sessionId,
        cb_type: obj.cbType,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    }
    this.getCoinExChangeLogList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getCoinExChangeLogList', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    }
    this.getMyBangList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/getMyBangList', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    }
    this.getExchange = function(obj) {
      return $http.post(APISERVER.MSAPI + '/activityvip/exchange', {
        sessionId: user.sessionId,
        cb_id: obj.cb_id
      });
    }
    this.getlottery = function(obj) {
        return $http.post(APISERVER.MSAPI + '/activityvip/lottery', {
          sessionId: user.sessionId,
          cb_id: obj.cb_id
        });
      }
      //--------------
    this.getIntro = function() {
      return $http.get('assets/json/intro.json');
    };

    this.getNews = function() {
      return $http.get('assets/json/news.json');
    };

    this.getVip = function() {
      return $http.get('assets/json/vip.json');
    };
    this.getLevel = function() {
      return $http.get('assets/json/level.json');
    };

    this.getTeam = function() {
      return $http.get('assets/json/team.json');
    };

    this.getNBRules = function() {
      return $http.get('assets/json/nb-rules.json');
    };

    this.getDebtInstruction = function() {
      return $http.get('assets/json/debt.instruction.json');
    };
    this.getMonthUpHelp = function() {
      return $http.get('assets/json/month.up.help.json');
    };

    this.getProvinceList = function() {
      return $http.get(APISERVER.MSAPI + '/dataBase/province');
    };

    this.getCityList = function(obj) {
      return $http.post(APISERVER.MSAPI + '/dataBase/city', {
        province: obj.provinceName
      });
    };

    this.EntertainmentList = function() {
      return $http.post(APISERVER.MSAPI + '/app/getEntertainmentList');
    }

    $log.debug('SystemApi end');

  }
})();
