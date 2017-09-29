(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('WechatShareService', WechatShareService);

  /** @ngInject */
  function WechatShareService(CommonApi, $log) {
    var shareTitle = '麦子金服财富',
      shareDesc = '8年平台，投资安心，福利升级，精彩不断。',
      shareLink = 'https://m.nonobank.com',
      shareIcon = 'assets/images/logo.png';

    this.init = function() {
      CommonApi.getWechatSignature().success(function(res) {
        if (res.errcode) {
          alert(res.errmsg);
          return;
        }

        var appId = res.appId;
        var timeline = res.timestamp;
        var code = res.nonceStr;
        var sign = res.signature;

        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timeline, // 必填，生成签名的时间戳
          nonceStr: code, // 必填，生成签名的随机串
          signature: sign, // 必填，签名，见附录1
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.error(function(res) {
          $log.info('error=' + JSON.stringify(res));
        });

        wx.ready(function() {
          updateListener();
        });
      });
    };

    this.update = function(obj) {
      shareTitle = obj.share_title;
      shareDesc = obj.share_desc;
      shareLink = obj.share_url;
      shareIcon = obj.share_icon;

      updateListener();
    };

    function updateListener() {
      //朋友圈
      wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: shareLink, // 分享链接
        imgUrl: shareIcon, // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });

      //分享给朋友
      wx.onMenuShareAppMessage({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareLink, // 分享链接
        imgUrl: shareIcon, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          //alert(1)// 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });

      //分享到QQ
      wx.onMenuShareQQ({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareLink, // 分享链接
        imgUrl: shareIcon, // 分享图标
        success: function() {
          //alert(1)// 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });

      //分享到腾讯微博
      wx.onMenuShareWeibo({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareLink, // 分享链接
        imgUrl: shareIcon, // 分享图标
        success: function() {
          //alert(1)// 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });

      //分享到QQ空间
      wx.onMenuShareQZone({
        title: shareTitle, // 分享标题
        desc: shareDesc, // 分享描述
        link: shareLink, // 分享链接
        imgUrl: shareIcon, // 分享图标
        success: function() {
          //alert(1)// 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
    }
  }
})();
