(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MsgDetailController', MsgDetailController);

  /** @ngInject */
  function MsgDetailController($stateParams, utils, CommonApi, toastr) {
    var vm = this,
      id = +$stateParams.id,
      type = +$stateParams.type, noticeType;
    vm.info = {};

    init();

    function init() {
      switch (type) {
        case 0:
          vm.viewTitle = '公告资讯';
          noticeType = 1;
          break;
        case 1:
          vm.viewTitle = '系统消息';
          noticeType = 0;
          break;
        case 2:
          vm.viewTitle = '公司新闻';
          noticeType = 2;
          break;
      }
      getDetail();

    }

    function getDetail() {
      CommonApi.getNoticeDetail({ type: noticeType, noticeId: id }).success(function(res) {
        if (res.succeed) {
          var data = res.data;
          vm.info.title = data.title;
          vm.info.content = linkFilter(data.content);
        }
      });
    }

    function linkFilter(str) {
      // return str.replace(/<a[^<>]*>[^<>]+<\/a>/ig, '');
      return str && str.replace(/href/ig, 'ext-href');
    }
  }


})();
