(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('UserApi', UserApi);

  /** @ngInject */
  function UserApi($http, $log, APISERVER, utils, md5, user) {
    var tokenId = localStorage.getItem('tongdun_token');
    if (!tokenId) {
      tokenId = "shield2016" + (new Date()).getTime();
    }
    // 获取jwt
    this.getJWT = function() {
      return $http.get(APISERVER.FESERVER + '/common/jwt/' + user.sessionId);
    }
    // 刷新jwt
    this.refreshJwt = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/common/refresh-jwt/' + obj.refresh
      });
    };

    //检查是否已经注册过了
    this.checkUserStatus = function(value) {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/common/check/' + 'mobile' + '/' + value
      })
    };
    //图形验证码获取
    this.getPic = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/common/captcha'
      })
    };
    //图形验证码校验
    this.picCheck = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/common/captcha/verify',
        params: {
          captcha: obj.captchaNum,
          uuid: obj.uuid
        }
      })
    };
    // 短信验证码发送
    this.sendCode = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/v-code', {
        mobile: obj.mobile,
        tokenId: tokenId,
        codeType: obj.codeType,
        captcha: obj.captcha,
        uuid: obj.uuid
      });
    };


    //注册接口
    this.registerCheck = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.FESERVER + '/user/register',
        data: {
          mobile: obj.mobile,
          vcode: obj.vcode,
          password: obj.password,
          tokenId: tokenId,
          inviteCode: obj.inviteCode,
          captcha: obj.captcha,
          uuid: obj.uuid
        }
      })
    };
    // 重复 待优化
    this.getBasicInfo = function() {
      return $http.get(APISERVER.FESERVER + '/user/info');
    }

    // 登录
    this.login = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER.FESERVER + '/user/login',
        data: {
          tokenId: tokenId,
          loginType: obj.userTel ? 1 : 2, //如果有验证码登录的手机号就是验证码登录 type为1
          username: obj.userTel || obj.username,
          password: obj.password,
          vcode: obj.userVcode,
          bizCode: 0,
          clientType: 2
        }
      });
    };

    //找回密码的短信验证码的校验
    this.findPwdCheckCode = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/login-password/retrieve/mobile-auth', {
        mobile: obj.mobile,
        vcode: obj.vcode
      });
    };
    // 找回密码设置接口
    this.findPwdCheck = function(obj) {
      return $http({
        method: 'post',
        url: APISERVER.FESERVER + '/user/login-password/retrieve/set',
        data: {
          mobile: obj.mobile,
          vcode: obj.vcode,
          password: obj.password,
          tokenId: tokenId,
          inviteMobile: obj.inviteMobile,
          captcha: obj.captcha,
          uuid: obj.uuid
        },
        headers: {
          jwt: obj.jwt
        }
      })
    };

    //非存管检查是否是逾期用户
    this.checkCGYQ = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/non-depository/checkCGYQ'
      });
    }
    // 获取用户基本信息
    this.getUserInfo = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/user/info'

      });
    };

    // 校验用户登录密码
    this.checkOldPassword = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/login-password/check', {
        password: md5.createHash(obj)
      });
    };

    this.getUserLevel = function() {
      return $http({
        method: 'GET',
        url: APISERVER.FESERVER + '/user/level'
      });
    };


    // 修改密码
    this.changePassword = function(obj) {
      return $http.post(APISERVER.FESERVER + '/user/login-password/update', {
        oldPassword: md5.createHash(obj.oriPassword),
        newPassword: md5.createHash(obj.newPassword)
      });
    };

    // 诺币
    this.getUserCoin = function() {
      return $http.post(APISERVER.MSAPI + '/licai/getTotalNoNOCoin', {
        sessionId: user.sessionId
      });
    }

    // 我的-累计收益详情
    // this.getEarningsInfo = function() {
    //   return $http.post(APISERVER.MSAPI + '/licai/getMyEarning', {
    //     sessionId: user.sessionId
    //   });
    // };

    // this.getEarningList = function(obj) {
    //   return $http.post(APISERVER.MSAPI + '/licai/getMyEarningListByType', {
    //     sessionId: user.sessionId,
    //     pageNo: obj.pageIndex,
    //     pageSize: obj.itemsPerPage,
    //     type: obj.type
    //   }, {
    //     silence: obj.pageIndex
    //   });
    // };

    // 我的-可用余额-余额明细
    this.getBalanceDetail = function(obj) {
      return $http.post(APISERVER.MSAPI + '/licai/moneyBalanceDetail', {
        sessionId: user.sessionId,
        pageNum: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 镑客大使累计收益
    this.getEnvoyEarnings = function() {
      return $http.get(APISERVER.FESERVER + '/bank-amb/income');
    };

    // 设置-我要反馈
    this.feedback = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/feedBack', {
        sessionId: user.sessionId,
        suggestion: obj.content
      });
    };

    // 设置-收货地址
    this.shippingAddr = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/changeUserCenterAddress', {
        sessionId: user.sessionId,
        province: obj && obj.province.id,
        city: obj && obj.city.id,
        address: obj && obj.detail
      });
    };

    // 设置-更换绑定手机号-校验用户密码
    this.validateUserPwd = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateUserPassword', {
        sessionId: user.sessionId,
        password: md5.createHash(obj.pwd)
      });
    }
    // 设置-更换绑定手机号-校验手机号
    this.validateMobile = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateMobile', {
        sessionId: user.sessionId,
        mobile: obj.mobile
      });
    }
    //设置-更换绑定手机号-更换手机号
    this.validateMobileVerification = function(obj) {
      return $http.post(APISERVER.MSAPI + '/user/validateMobileVerification', {
        sessionId: user.sessionId,
        mobile: obj.mobile,
        validCode: obj.validCode
      });
    }

    this.heguiCheck = function() {
      return $http.post(APISERVER.MSAPI + '/rebuild/userinfo/heguiCheck', {
        sessionId: user.sessionId
      });
    }

    $log.debug('UserApi end');

  }
})();
