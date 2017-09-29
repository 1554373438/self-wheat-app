(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('nonoAgree', nonoAgree);

  /** @ngInject */
  function nonoAgree($ionicActionSheet, $state, AgreementService) {
    var directive = {
      restrict: 'E',
      templateUrl: "app/components/nono-agree/agree.html",
      scope: {
        agree: '=',
        type: '=',
        id: '=',
        title: '='
      },
      link: function(scope, element, attr) {
        scope.agree = true;
        var protocolTitle = scope.title || '', agreementType = '';
        switch(scope.type) {
          case 2:
            agreementType = 5;//新客
            break;
          case 5:
            agreementType = 4; //贴心
            protocolTitle = protocolTitle + '协议书';
            break;
          case 9:
            agreementType = 1;//自动债转 
            protocolTitle = '债权转让协议书';
          case 10:
            agreementType = 2;//手动债转 
            protocolTitle = '债权转让协议书';
            break;
          case 15:
            agreementType = 3;//月月升
            protocolTitle ='月月升协议书';
            break;
          case 16:
            agreementType = 10;//诺诺盈
            protocolTitle = '借款协议';
        };
       

        scope.showSheet = function() {
          $ionicActionSheet.show({
            buttons: [
              { text: protocolTitle},
              { text: '电子签章使用授权书'}
            ],
            cancelText: '取消',
            cssClass: 'agree-sheet',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {
              if (index == 0) {
                AgreementService.getTemplate({type: agreementType, productId: scope.id, name: protocolTitle});
              } else {
                AgreementService.getTemplate({type: 12, name: '电子签章使用授权书'});

              }
              return true;
            }
          });
        }
      }
    };

    return directive;
  }

})();
