(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController($state, user, toastr, $location, ActivityApi, BridgeService) {
    _czc.push(['_trackEvent', '我的任务', 'PV']);
    var vm = this;
    vm.goPage = goPage;

    vm.taskListInfo = [{
      title: '进阶任务',
      taskLists: []
    }, {
      title: '每月任务',
      taskLists: []
    }, {
      title: '已完成任务',
      taskLists: []
    }];

    init();

    function init() {
      ActivityApi.getTaskInfo().success(function(res) {
        if (res.succeed) {
          vm.taskListInfo[0].taskLists = res.data.advanced;
          vm.taskListInfo[1].taskLists = res.data.monthly;
          vm.taskListInfo[2].taskLists = res.data.finished;
        }
      });
    }

    function goPage(router) {
      if (router == 'invite_count') {
        _czc.push(['_trackEvent', '我的任务', '点击', '去邀请']);
        $state.go('envoy');
      } else if (router == 'sign_count') {
        _czc.push(['_trackEvent', '我的任务', '点击', '去签到']);
        if (BridgeService.bridge) {
          BridgeService.send({
            type: 'pageSwitch',
            data: {
              name: 'mall'
            }
          });
          return;
        }
        $state.go('mall');
      } else if(router == 'welfare'){
        _czc.push(['_trackEvent', '我的任务', '点击', '我的福利']);
        if (BridgeService.bridge) {
          BridgeService.send({
            type: 'pageSwitch',
            data: {
              name: 'bonus',
              tab: 'cash'
            }
          });
          return;
        }
        $state.go('welfare');
      }else {
        _czc.push(['_trackEvent', '我的任务', '点击', '去投资']);
        if (BridgeService.bridge) {
          var ua = navigator.userAgent;
          var isAndroid = ua.toLowerCase().indexOf('android') > -1 || ua.toLowerCase().indexOf('adr') > -1;
          var search = $location.search();
          var version = search.version
          if(!isAndroid && version < '5.3.2'){
            toastr.info("请将版本升级～");
            return;
          }
          BridgeService.send({
            type: 'pageRoute',
            data: {
              link: 'mzjf://product_jumpToInvestList/?index=0',
              showType: 2
            }
          });
          return;
        }
        $state.go('product', { type: 0 });
      }
    }

  }
})();
