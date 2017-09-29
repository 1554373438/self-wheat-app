/**
 * Created by lucongcong on 17/7/31.
 */

(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsNnyDetailController', RecordsNnyDetailController);

  /** @ngInject */
  function RecordsNnyDetailController($scope, RecordProgressService, $stateParams, $state, localStorageService, InvtApi, BasicApi, toastr, utils, AgreementService, $log) {
    var vm = this,
        obj = {},
        boId;
    vm.fromType = $stateParams.type;
    vm.colInfo = {}; //收款记录相关
    vm.tranInfo = {}; //转出记录相关
    vm.stateInfo = {}; //订单明细相关

    vm.showProtocol = showProtocol; //借款协议
    vm.showProtocol2 = showProtocol2;
    vm.transferBtn = transferBtn; //转让按钮判断
    vm.toBorrow = toBorrow; //借款
    vm.showProgress = showProgress; //展示投资进度
    $scope.$on('$ionicView.beforeEnter', function() {
      init();

    });

    function init() {
      vm.listInfo = localStorageService.get('record');
      if(vm.listInfo){
        boId = vm.listInfo.boId;
        obj = {
          boId: boId,
          isVip:  0,//1计划类的精选，0非精选
          pageNo: 1,
          pageSize: 15,
          seriNo: vm.listInfo.seriNo

        };
      }
      //两个接口组成
      getDetail(); //获取缓存信息

      getAcceptRecord(); //获取收款记录

      getSingleTransferList(); //获取转让记录

    }

    function getDetail() {
      if(vm.listInfo){
        if(vm.fromType == 'debt'){ //债转相关判断显示字段
          vm.stateInfo.showTime = vm.listInfo.endTime && vm.listInfo.endTime.substr(0,10);
          vm.stateInfo.rateLender =  vm.listInfo.rateShow;
          vm.listInfo.amount = vm.listInfo.buyPrice;// 因为字段不同 所以要统一显示
          if(vm.listInfo.status == 1){ //还款中
            vm.stateInfo.state = '收款中';
            vm.isEnd = false;
          }else{ //已结束
            vm.stateInfo.state = '已结束';
            vm.isEnd = true;
            vm.listInfo.totalIncome = vm.listInfo.currentInterest; //债转结束时的已获收益（字段统一）
          }
        }else{ //诺诺盈 需要自己加 %
          vm.stateInfo.rateLender  = vm.listInfo.rateLender + '%'; //预期年化利率

          if(vm.listInfo.status == 2 || vm.listInfo.status == 3){
            vm.isEnd = true;
            vm.stateInfo.state = '已结束';
            vm.stateInfo.showTime = vm.listInfo.endTIme;
          }else{
            vm.isEnd = false;
            switch(parseInt(vm.listInfo.status)){
              case 0:
                vm.stateInfo.state = '待满标';
                vm.stateInfo.showTime = vm.listInfo.boExpectCat==1?'满标后'+vm.listInfo.boExpect+'天':'满标后'+vm.listInfo.boExpect+'个月';
                break;
              case 1:
                vm.stateInfo.state = '收款中';
                vm.stateInfo.showTime = vm.listInfo.endTime;
                break;
              case 4:
                vm.stateInfo.state = '已流标';
            }

          }
        }
        //按钮显示 是否可转让
        if( vm.listInfo.transferStatus !== undefined && vm.listInfo.transferStatus !== null){
          switch(+vm.listInfo.transferStatus){
            case 0:
              vm.stateInfo.transBtn = "不可转让";
              break;
            case 1:
              vm.stateInfo.transBtn = "可转让";
              break;
            case 2:
              vm.stateInfo.transBtn = "暂不可转让";
          }
        }else{
            vm.stateInfo.transBtn = "接口没给";
        }

      }
    }

    function getAcceptRecord() {
      InvtApi.getAcceptRecord(obj).success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        var data = res.data;
        if(data){
          vm.colInfo = data;
          localStorageService.set('collect',data.acceptRecordAllList);
        }
      });
    }

    function getSingleTransferList() {
      InvtApi.getSingleTransferList(obj).success(function (res) {
        if(res.succeed){
          var data = res.data;
          if(data){
            vm.tranInfo = data.lastDebtSale; //最近一笔转让记录
          }

        }
      });
    }

    //借款协议跳转
    function showProtocol() {
      AgreementService.getAgreementInvest({dblId: vm.listInfo.dblId}, vm.listInfo.title);

    }

    //借款信息跳转
    function toBorrow() {
      $state.go('records:bordetail',{bo_id:boId})
    }

    function transferBtn() {
      if(vm.listInfo.transferStatus == 0 || vm.listInfo.transferStatus == 2){ //0--不可转让 2--暂不可转让
        utils.alert({
          title: '提示',
          content: vm.listInfo.transferMsg
        });
      }else{
        $state.go('records:transferDetail',{id:vm.listInfo.deaId,type:0,from:vm.fromType});
      }
    }


    //投资进度跳转
    function showProgress() {
      var _type = vm.fromType == 'debt'?3:2;
      RecordProgressService.init({ type: _type, id: boId, seriNo: vm.listInfo.seriNo})
    }

     function showProtocol2() {
       AgreementService.getAgreementInvest({dblId: vm.listInfo.dblId}, '债转协议');
     }


  }
})();
