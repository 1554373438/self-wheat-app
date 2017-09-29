(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AgreementService', AgreementService);

  /** @ngInject */
  function AgreementService($rootScope, CommonApi, toastr, $state, $log) {
    var self = this;
    $log.debug('AgreementService.init');
    self.templateUrl = '';

    self.getTemplate = function(params) {
      if(params.type == 4 || params.type == 5) {
        var obj = {
          type: params.type,
          productId: params.productId
        };
      } else {
        var obj = {
          type: params.type
        }
      }
      CommonApi.getAgreementTemplate(obj).success(function(res) {
        if (res.succeed) {
          if (!res.data.status) {
            toastr.info('协议生成中，请耐心等待');
          } else {
            var imgPath = res.data && res.data.img;
            $state.go('agreement', { title: params.name, url: imgPath });
          }
        } else {
          toastr.info(res.errorMessage);
        }
      })
    }

    self.getAgreementInvest = function(params, name) {
      CommonApi.getAgreementInvest(params).success(function(res) {
        if (res.succeed) {
          if (!res.data.status) {
            toastr.info('协议生成中，请耐心等待');
          } else {
            var imgPath = res.data && res.data.img;
            $state.go('agreement', { title: name, url: imgPath });
          }
        } else {
          toastr.info(res.errorMessage);
        }
      });
    }
  }
})();
