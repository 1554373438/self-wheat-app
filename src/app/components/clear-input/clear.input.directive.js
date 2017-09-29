(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('clearInput', clearInput);

  /** @ngInject */
  function clearInput() {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      scope: {
        val: '=ngModel',
        readonly: '=ngReadonly'
      },
      link: function(scope, element, attrs) {
        if(scope.readonly) return;
        element.on('focus',function(){
          var focusEle = document.getElementById('log_in');//解决安卓键盘挡住的问题
          setTimeout(function(){
            focusEle && focusEle.scrollIntoView(true);
          },100);
          if(element.parent().parent().hasClass('dbl-margin-bottom')){
            element.parent().parent().addClass('focus');
            return;
          }
          element.parent('.dbl-margin-bottom').addClass('focus');
        });
        element.on('blur',function(){
          if(element.parent().parent().hasClass('dbl-margin-bottom')){
            element.parent().parent().removeClass('focus');
            return;
          }
          element.parent('.dbl-margin-bottom').removeClass('focus');
        });
        var btn = angular.element('<i class="icon clear-val"></i>');

        element.after(btn);
        element.parent().addClass('item-icon-right');

        btn.on('click', function() {
          scope.$apply(function () {
            scope.val = '';
          });
        });

        element.on('blur', function() {
          btn.css({'visibility':'hidden'});
          element.css({'padding-right': '16px'});
        });

        scope.$watch('val', function(val) {
          btn.css('visibility', val ? 'visible' : 'hidden');
          if(attrs.code == 'pwd'){
            btn.css('right',  '45px' );
            return;
          }
          element.css('padding-right', val ? '30px' : '16px');
        });
      }
    };

    return directive;
  }

})();
