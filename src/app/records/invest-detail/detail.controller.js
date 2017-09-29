(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsInvestDetailController', RecordsInvestDetailController);

  /** @ngInject */
  function RecordsInvestDetailController($scope, $stateParams, $state, localStorageService, InvtApi, BasicApi, toastr, utils, AgreementService, $log, RecordProgressService) {
    var vm = this;
    vm.info = {};
    vm.singleTransferInfo = {};
    vm.planSecondLists = [];
    vm.isWelfareTip = false;
    vm.isWelfare = true;

    vm.goDebtDetail = goDebtDetail;
    vm.quitConfirm = quitConfirm;
    vm.showProtocol = showProtocol;
    vm.goTransferAlert = goTransferAlert;
    vm.showProgress = showProgress;

    $scope.$on("$ionicView.beforeEnter", init);

    function init() {
      vm.info = localStorageService.get('record');
      vm.info.type = $stateParams.type;
      switch (vm.info.type) {
        case 'plan':
          getSingleTransferList();
          getPlanSecondList(vm.info.fpId);
          break;
        case 'monUp':
          getPlanSecondList(vm.info.fpId);
          getRate(vm.info.fpId);
          break;
      }
    }

    // 获取月月升利率
    function getRate() {
      InvtApi.getRateAll({ id: vm.info.fpId }).success(function(res) {
        if (res.succeed) {
          var series = [];
          var data = res.data;

          var rateArr = data.rateAll && data.rateAll.split(',');
          var curMonth = data.currentMonth;
          rateArr.forEach(function(item, index) {
            var index = index + 1;
            if (index <= curMonth) {
              var color = '#B1DBFF';
            } else {
              var color = '#EDF5FD';
            }
            var item = {
              name: '' +index,
              y: +item,
              color: color
            }
            series.push(item);
          });

          vm.info.chartData = {
            boxId: 'chart_box',
            height: 180,
            series: series,
            xLabel: { color: '#999', text: '(个月)' },
            yLabel: { color: '#999', text: '(%)' }
          };
        }
      });
    }

    function getSingleTransferList() {
      InvtApi.getSingleTransferList({
        isVip: 1,
        boId: vm.info.vaId,
        pageNo: 1,
        pageSize: 15
      }).success(function(res) {
        if (res.succeed) {
          vm.singleTransferInfo = res.data;
        }
      });
    }

    function goDebtDetail() {
      $state.go('records:latelyDetail', { dsId: vm.singleTransferInfo.lastDebtSale.dsId });
    }

    // 计划类投资二级列表
    function getPlanSecondList(pId) {
      var fpId = pId;
      InvtApi.getPlanSecondList({
        fpId: fpId,
        pt: vm.info.productType,
        transId: vm.info.transId,
        type: 1
      }).success(function(res) {
        if (res.succeed) {
          vm.planSecondLists = res.data;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].interestCoupon) {
              vm.isWelfareTip = true;
              break;
            }
          }
          for (var i = 0; i < res.data.length; i++) {
            if (!res.data[i].cashCoupon && !res.data[i].interestCoupon) {
              vm.isWelfare = false;
              break;
            }
          }
        }
      });
    }

    function quitConfirm() {
      //月月升
      var finishDay = vm.info.leftDay;
      var moreEarning = vm.info.moreEarning;
      // 获取月月升提前退出 预期收益
      InvtApi.ladderRevenue({
        pId: vm.info.fpId,
        price: vm.info.amount
      }).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;
        var contentStr = '<p>还剩<span>' + data.nextLeftDay + '天，</span>到期收益可以多拿<span class="assertive">' + data.moreProfit + '</span>元，确定此时提前退出吗？<span>申请退出后，平均2~5个工作日到账户余额</span></p>';
        utils.confirm({
          title: '提示',
          content: contentStr,
          cssClass: 'record-popup',
          okText: '提前退出',
          okType: 'button-positive',
          cancelText: '取消',
          cancelType: 'button-positive',
          onOk: function() {
            BasicApi.quitPlan({ id: vm.info.fpId }).success(function(res) {
              if (res.flag == 1) {
                toastr.info(res.msg);
              }
              vm.info.yysStatus = res.data.status; //月月升状态待对应
            });
            $state.go('mine');
          }
        });
      });
    }

    function showProtocol() {
      var params = {};
      params.vaId = vm.info.vaId;
      AgreementService.getAgreementInvest(params, vm.info.title);
    }


    function goTransferAlert(num) {
      var stopFlag = num;
      if (stopFlag == 1) { // 0 不可转让； 1 可转让； 2 暂不可转让
        localStorageService.set('debtPick', {
          vaid: vm.info.vaId,
          title: vm.info.title
        });
        $state.go('records:debtPick', { id: vm.info.vaId });
      } else {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': vm.info.transferMsg,
          'okText': '确定'
        });
      }
    }

    // 投资进度
    function showProgress() {
      RecordProgressService.init({ type: 1, id: vm.info.vaId });
    }

  }
})();
