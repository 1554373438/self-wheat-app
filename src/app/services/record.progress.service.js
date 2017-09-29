(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('RecordProgressService', RecordProgressService);
  /** @ngInject */
  function RecordProgressService($ionicModal, $rootScope, InvtApi, toastr) {
    var self = this,
      mScope = $rootScope.$new(true),
      modal;

    self.init = init;

    function showModal() {
      $ionicModal.fromTemplateUrl('app/records/progress/progress.modal.html', {
        scope: mScope
      }).then(function(_modal) {
        modal = _modal;
        modal.show();
      });
    }

    function init(obj) {
      //type: 产品类型(必须 1:精选，2:诺诺盈，3:债转)
      //id: 业务Id(非精选时为借款标ID,即boId；精选时为精选帐户ID,即vaId)
      obj.seriNo = obj.seriNo || '';
      InvtApi.getInvtProgress({type: obj.type, bId: obj.id, seriNo: obj.seriNo}).success(function(res) {
        if(!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        mScope.progressList = res.data;

        showModal();
      })
    }



  }
})();
