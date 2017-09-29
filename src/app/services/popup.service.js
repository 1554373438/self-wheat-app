(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AppPopService', AppPopService);

  /** @ngInject */
  function AppPopService($ionicModal, $rootScope, $state) {
    var self = this, renameScope = $rootScope.$new(true);
    self.renameModal = null;

    if(localStorage.getItem('nonoRename')) {
      self.renameStoraged = true;
    } else {
      self.renameStoraged = false;
    }
    // 更名为麦子金服财富弹窗
    self.showRenamePopup = function(_option) {
      $ionicModal.fromTemplateUrl('app/home/rename.modal.html', {
        scope: renameScope,
        animation: 'slide-in-up'
      }).then(function(_modal) {
        self.renameModal = _modal;
        self.renameModal.show();
        localStorage.setItem('nonoRename', '麦子金服财富');

      });

    }

    renameScope.close = function(forbidden) {
      self.renameModal.remove();
      if(!forbidden) {
        $rootScope.$broadcast('renameModal.closed');
      } 
      self.renameStoraged = true;
    }

    renameScope.getMore = function() {
      this.close(true);
      $state.go('external', {
        name: '品牌升级落地页',
        link: 'http://bbs.nonobank.com/brandupgrade_wap.html'
      });
    }

  }
})();
