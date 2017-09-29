(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('DefinedPopService', DefinedPopService);

  /** @ngInject */
  function DefinedPopService($ionicModal, $rootScope, $state, $interval, $timeout, user, toastr, CommonApi) {
    var self = this, time;
    self.popModal = [];
    self.needShowList = [];
    self.close = close;

    var definedPopScope = $rootScope.$new(true);
    definedPopScope.fn = {};
    definedPopScope.fn.close = close;
    definedPopScope.fn.getMore = getMore;


    // 自定义弹框；
    self.showDefinedPopup = function(_option) {
      self.needShowList = [];
      CommonApi.getPopUpBanner({
        position: '麦子(原诺诺)-微站-麦子(原诺诺)微站-首页',
        type: 3
      }).success(function(res) {
        if (res.succeed) {
          var list = res.data;
          for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            var storageKey = 'defined_modal_' + curItem.id;
            
            if((curItem.isLogin == 1 && user.sessionId) || (curItem.isLogin == 0 && !user.sessionId)){
              continue;
            }
            
            if (curItem.frequency) {
              var needShow = localStorage.getItem(storageKey) ? false : true;
              if (needShow) {
                self.needShowList.push(curItem);
              }
            } else {
              var needShow = sessionStorage.getItem(storageKey) ? false : true;
              if (needShow) {
                self.needShowList.push(curItem);
              }
            }
          }
          showModal();

        } else {
          // toastr.info(res.errorMessage);
        }
      });
    }

    function showModal() {
      var curPop = self.needShowList.shift();
      if (!curPop) {
        return;
      }

      var isShow = curPop.isShow;
      if(!isShow){
        showModal();
        return;
      }

      definedPopScope.fn.path = curPop.path;
      definedPopScope.fn.link = curPop.link;
      definedPopScope.fn.countdown = curPop.countdown;
      definedPopScope.fn.ableClose = curPop.ableClose;

      $ionicModal.fromTemplateUrl('app/home/defined.modal.html', {
        scope: definedPopScope,
        animation: 'slide-in-up'
      }).then(function(_modal) {
        self.popModal.push(_modal);
        _modal.show();
        if (curPop.frequency == 1) {
          localStorage.setItem('defined_modal_' + curPop.id, '自定义弹出设备只弹一次');
        } else {
          sessionStorage.setItem('defined_modal_' + curPop.id, '每次都弹');
        }
      });

      if (definedPopScope.fn.countdown > 0) {
        time = $interval(function() {
          definedPopScope.fn.countdown--;
          if (definedPopScope.fn.countdown <= 0) {
            $interval.cancel(time);
            close();
          }
        }, 1000);
      }
    }

    function close(closeAll) {
      var lastModal = self.popModal.pop();
      lastModal.remove();
      $interval.cancel(time);
      if(closeAll) {
        return;
      }
      showModal();
    }

    function getMore(bannerTitle, bannerLink) {
      if (bannerLink) {
        this.close(true);
        $state.go('external', {
          name: bannerTitle,
          link: bannerLink
        });
      }
    }

  }
})();
