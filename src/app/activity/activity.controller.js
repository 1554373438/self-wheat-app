(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('ActivityController', ActivityController);

  /** @ngInject */
  function ActivityController($rootScope, $state, $stateParams, $ionicTabsDelegate, $ionicHistory, utils, BasicApi, BridgeService) {
    var vm = this;

    vm.select = select;
    vm.goBack = goBack;

    init();

    function init() {
      BasicApi.getActivity().success(function(res) {
        if(res.flag == 1) {
          vm.items = res.data;
        }
      });
    }

    function select(index) {
      var selectItem = vm.items[index];
      
      if(BridgeService.bridge) {
        BridgeService.send({
          type:'activity',
          data:{
            name: selectItem.title,
            link: selectItem.link,
            needLogin : true,
            target: 'HtmlModuleTarget',
            action:  'htmlViewController'
          }

        });
      } else {
        $state.go('external', {
          name: selectItem.title,
          link: selectItem.link
        });
      }
    }

    function goBack() {
      if($stateParams.from === 'home') {
        $ionicTabsDelegate.select(0);
      } else {
        $rootScope.$ionicGoBack();
      }
    }
    
  }
})();
