(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EnvoyController', EnvoyController);

  /** @ngInject */
  function EnvoyController($rootScope, UserApi, ActivityApi, BridgeService, AppService, $location, $state, user, $log, HOST, WechatShareService, toastr) {
    var vm = this;
    vm.info = {};
    vm.goRewardDetail = goRewardDetail;
    vm.goMyBonus = goMyBonus;
    vm.invite = invite;
    vm.getMore = getMore;

    // init envoy info
    init();

    function init() {
      vm.info.haveRedPacket = false;
      UserApi.getEnvoyEarnings().success(function(res) {
        if (res.succeed) {
          vm.info.earnings = +res.data.pay;
        }
      });

      getCashPacket();
    }

    function getCashPacket() {
      ActivityApi.getCashPacket().success(function(res) {
        if (res.succeed) {
          vm.info.haveRedPacket = res.data.haveRedPacket;
          vm.info.redPacket = res.data.newestCashPacket;
          if (vm.info.redPacket) {
            vm.info.shareBalance = vm.info.redPacket.remainingBalance;
            if (vm.info.redPacket.invalid) {
              vm.info.shareBalance = 0;
            }
          }
        }
      });
    }

    function goRewardDetail() {
      _czc.push(['_trackEvent', '镑客大使', '点击', '累计奖励详情']);
      $state.go('envoy:reward');

    }

    function goMyBonus() {
      _czc.push(['_trackEvent', '镑客大使', '点击', '查看现金券']);
      if (BridgeService.bridge) {
        BridgeService.send({
          type: 'pageSwitch',
          data: {
            name: 'bonus',
            tab: 'cash' //tab参数：现金券：'cash'，加息券：'jiaxi'，诺币：'nb'
          }
        });
      } else {
        $state.go('welfare', { index: 0 });
      }

    }

    function getMore() {
      // _czc.push(['_trackEvent', '镑客大使', '点击', '了解更多']);
      $state.go('envoy:rules');
    }

    function invite() {
      _czc.push(['_trackEvent', '镑客大使', '分享', '邀请好友']);
      var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;
      var shareUrl, shareIconPath;
      UserApi.getBasicInfo().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var mobile = res.data.mobile;
        var regTime = new Date(res.data.registerTime && res.data.registerTime.replace(/\-/g, '/'));
        var day = parseInt((new Date() - regTime) / (1000 * 60 * 60 * 24));
        var timestamp = (new Date()).getTime();
        shareUrl = host + '/nono/envoy-land-page/index.html?mobile=' + mobile + '&regtime=' + day + '&balance=' + vm.info.shareBalance + '&timestamp=' + timestamp;
        shareIconPath = $location.absUrl().split('#')[0] + 'assets/images/logo.png';
        share(shareUrl, shareIconPath);

      });

    }

    function share(shareUrl, iconPath) {
      var isWx = /micromessenger/.test(navigator.userAgent.toLowerCase());

      var title = '',
        desc = '',
        sms = '';

      if (vm.info.haveRedPacket && +vm.info.shareBalance) {
        title = '麦子金服财富（原诺诺镑客）八周年88800元特权本金立抢~~';
        desc = '银行存管正式上线，8年相伴送888元新手红包，更有新手专享历史收益12%！';
        sms = '我分享了88800元8周年特权本金，邀请你一起来瓜分。新人加入立享888元新手红包，历史年化收益12%。戳' + shareUrl + '领取您的特权本金';
      } else {
        title = '我在麦子金服财富（原诺诺镑客）投资很久了，邀你一起赚钱！';
        desc = '银行存管正式上线，8年相伴送888元新手红包，更有新手专享历史收益12%！';
        sms = '【麦子金服财富】推荐您加入麦子金服财富（原诺诺镑客），8周年888元新人红包等你来领，更有新手专享历史收益12%。立即领取戳：' + shareUrl;
      }

      if(BridgeService.bridge) {
        BridgeService.send({
          type: 'share',
          data: {
            share_title: title,
            share_desc: desc,
            share_url: shareUrl,
            share_icon: iconPath,
            share_type: 2, //1 普通分享 2 二维码
            share_sms: sms
          }
        });
      } else if (isWx) {
        alert('点击微信右上角分享');
        WechatShareService.update({
          share_title: title,
          share_desc: desc,
          share_url: shareUrl,
          share_icon: iconPath,
        });
      } else {
        alert('请关注微信“麦子金服财富服务号”或打开麦子金服财富APP分享');
      }

    }



  }
})();
