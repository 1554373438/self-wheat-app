/**
 * Created by lucongcong on 17/8/1.
 */
(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsTransferController', RecordsTransferController);

  /** @ngInject */
  function RecordsTransferController($scope, $rootScope, $stateParams, $state, localStorageService, InvtApi, BasicApi, toastr, utils, AgreementService, $log) {
    var vm = this,
      PAGE_SIZE ,
      pageNo ,
      type = $stateParams.type,
      listItem = localStorageService.get('record');

    vm.info = {};
    vm.hasMoreData = false;
    vm.loadData = init;

    $scope.$on('$ionicView.beforeEnter', function() {
      pageNo = 1;
      PAGE_SIZE = 15;
      init(true);

    });
    function init(firstPage) {
      if(firstPage){ //下拉加载和首次进入 都请求首页数据
        pageNo = 1;
      }
      var obj = {
        pageSize: PAGE_SIZE,
        pageNo: pageNo
      };
      if (type == 1) { //全部转出记录
        InvtApi.getAllTransferList(obj).success(function (res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          var data = res.data.list;
          if(data){
            vm.info = firstPage ? data : vm.info.concat(data);
            vm.hasMoreData = PAGE_SIZE === data.length;
          }

        }).finally(function() {
          $rootScope.$broadcast('scroll.refreshComplete');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
      } else { //单个转出记录
        if(listItem){
            obj.isVip = listItem.productType?1:0, //1为精选，0非精选
            obj.boId = listItem.productType?listItem.vaId:listItem.boId,
            obj.seriNo = listItem.productType?'':listItem.seriNo
        }

        InvtApi.getSingleTransferList(obj).success(function (res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          var data = res.data;
          if(data){
            vm.info = firstPage ? data.list : vm.info.concat(data.list);
            vm.hasMoreData = PAGE_SIZE === data.list.length;
          }
        }).finally(function() {
          $rootScope.$broadcast('scroll.refreshComplete');
          $rootScope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
      pageNo++;
    }



  }
})();
