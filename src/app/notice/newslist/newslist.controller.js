(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('NewsListController', NewsListController);

  /** @ngInject */
  function NewsListController($log, $scope, $rootScope, CommonApi){
    var vm = this;
    

    vm.notice = {
      hasMoreData: true,
      pageIndex: 1,
      itemsPerPage: 10,
      list: []
    };
    vm.loadMore = loadMore;

    function loadMore() {
      CommonApi.getNoticeList({
        type: 2,
        pageNo: vm.notice.pageIndex,
        pageSize: vm.notice.itemsPerPage
      }).success(function(res) {
        if(res.succeed) {
          vm.notice.list = vm.notice.list.concat(res.data);
          vm.notice.hasMoreData = res.data.length === vm.notice.itemsPerPage;
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });

      vm.notice.pageIndex++;
    }

    loadMore();
   
  }

    
})();