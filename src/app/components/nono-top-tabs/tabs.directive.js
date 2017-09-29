(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('nonoTabs', nonoTabs)
    .directive('nonoTab', nonoTab);

  /** @ngInject */
  function nonoTabs($timeout) {
    var directive = {
      restrict: 'E',
      transclude: true,
      scope: {
        tabsTop: '@',
        ngModel: '='
      },
      required: 'type',
      // replace: true,
      templateUrl: function(element, attr) {
        var tmp =  attr.tabsTop ? 'tabs-top.html' : 'tabs.html'

        return 'app/components/nono-top-tabs/' + tmp;
      },
      /** @ngInject */
      controller: function($scope) {
        var vm = this;

        vm.tabs = [];

        vm.addTab = addTab;
        vm.select = select;

        function addTab(tab) {
          vm.tabs.push(tab);

          if(vm.tabs.length === 1 && !$scope.ngModel) {
            select(0);
          }
        }

        function select(index) {
          angular.forEach(vm.tabs, function(tab) {
            tab.active = false;
          });

          var tab = vm.tabs[index];
          tab.active = true;
          $scope.ngModel = tab.value;
        }

        
      },
      controllerAs: 'tabset',
      link: function(scope, element, attr, tabsCtrl) {
        $timeout(function() {
          var type = attr.type;

          element.find('a').addClass('tab-item-' + type);
        }, 100);

        scope.$watch(function() {
          return scope.ngModel;
        }, function(val) {
          var i = 0, len = tabsCtrl.tabs.length;
          for(; i < len; i++) {
            if(+tabsCtrl.tabs[i].value === +val) {
              tabsCtrl.select(i);
              break;
            }
          }
        });
      }
    };

    return directive;
  }

  /** @ngInject */
  function nonoTab() {
    var directive = {
      restrict: 'E',
      transclude: true,
      replace: true,
      require: '^nonoTabs',
      scope: {
        title: '@',
        value: '@'
      },
      template: '<div class=\"tab-pane\" ng-show=\"active\" ng-transclude></div>',
      controller: function() {},
      controllerAs: 'tab',
      link: function(scope, element, attr, tabsCtrl) {
        tabsCtrl.addTab(scope);
      }
    };

    return directive;
  }

})();