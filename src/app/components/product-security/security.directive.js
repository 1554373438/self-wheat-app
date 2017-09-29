(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('productSecurity', productSecurity)

  /** @ngInject */
  function productSecurity(BasicApi, utils) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/product-security/security.html',
      link: function(scope, element, attr) {
    
        scope.showModal = function() {
          BasicApi.multipleProtectPlan()
              .success(function(res) {
                if (+res.flag === 1) {
                  utils.alert({
                    'title': '三重保障',
                    'cssClass': 'product-detail-security',
                    'content': '<b>' + res.data[0].remark + '</b><p>' + res.data[0].data_value + '</p><b>' + res.data[1].remark + '</b><p>' + res.data[1].data_value + '</p><b>' + res.data[2].remark + '</b><p>' + res.data[2].data_value + '</p>',
                    'okText': '确定'
                  });
                }
              });
        }
     
      }
    };

    return directive;
  }

  

})();
