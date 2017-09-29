(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DiscoverController', DiscoverController);

  /** @ngInject */
  function DiscoverController($state, $scope, BasicApi, SystemApi, AppService, user, toastr, $interval, $window) {
    var vm = this;
    vm.bannerList = [];
    vm.info = {};
    vm.needLogin = false;
    vm.goPage = goPage;
    vm.toBBS = toBBS;
    vm.bannerSelect = bannerSelect;
    var mallToken, taskToken, slider, ticker;

    vm.options = {
      loop: true,
      effect: 'fade',
      speed: 500
    };
    
    // // banner sliders
    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
      // data.slider is the instance of Swiper
      slider = data.slider;
      triggerTicker();
    });

    $scope.$on('$ionicView.afterLeave', function(event, data) {
      ticker && $interval.cancel(ticker);
    });

    $scope.$on('$ionicView.beforeEnter', function(event, data) {
      slider && triggerTicker();
      init();
    });

    function triggerTicker() {
      if (!slider) return;
      ticker = $interval(function() {
        if (slider.previousIndex === (slider.slides && (slider.slides.length - 1))) {
          slider.slideTo(0);
        } else {
          slider.slideNext();
        }
      }, 3000);
    }


    $scope.$on('$ionicView.beforeEnter', init);

    function init() {

      SystemApi.getNonoStoreIndex().success(function(res) {
        if (+res.flag === 1) {
          var data = res.data;
          vm.bannerList = data.storeBanner;
        }
      });
      if (!user.sessionId) {
        vm.needLogin = true;
        return;
      }
      BasicApi.getDiscoveryInfo().success(function(res) {
        if (res.flag == 1) {
          var data = res.data;
          vm.info.taskFlag = data.task_flag;
          vm.info.mallFlag = data.app_shop_flag;
          vm.info.taskNum = data.unfinishedTaskNum;
          mallToken = data.shop_token;
          taskToken = data.task_token;

        }
      });
    }

    function goPage(router) {
      var position, token;
      if (!user.sessionId) {
        AppService.login();
        return;
      }
      if(router == 'envoy') {
        $state.go(router);
        return;
      }

      if(router == 'vip') {
       $state.go('mall:level', { number: user.level });
       return;
      }

      if (router == 'mall') {
        position = 'shop';
        token = mallToken;
      } else if (router = 'task') {
        position = 'task';
        token = taskToken;
      }

      BasicApi.clearDiscoveryFlag({
        position: position,
        discovery_token: token
      }).success(function(res) {
        if (res.flag != 1) {
          toastr.info(res.msg);
        }
      });
      $state.go(router);
    }


    function toBBS() {
      BasicApi.goBBSLogin().success(function(res) {
        if (res.flag == 2) {
          window.location.href = 'https://bbs.nonobank.com';
          return;
        }
        if (res.flag == 1) {
          var bbs_login_address = res.data.bbs_login_address;
          if (!bbs_login_address) {
            window.location.href = 'https://bbs.nonobank.com';
            return;
          }
          var BBS_login_address = bbs_login_address.replace("http://", "https://");
          loadScript(BBS_login_address, function() {
            window.location.href = 'https://bbs.nonobank.com';
          });
        }
      });

      function loadScript(src, callback) {
        var script = document.createElement('script'),
          head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
          script.addEventListener('load', function() {
            callback();
          }, false);
        } else if (script.attachEvent) {
          script.attachEvent('onreadystatechange', function() {
            var target = window.event.srcElement;
            if (target.readyState == 'loaded') {
              callback();
            }
          });
        }
        head.appendChild(script);
      }
    }

    // function toVip() {
    //   if (!user.sessionId) {
    //     AppService.login();
    //     return;
    //   }
    //   $state.go('mall:level', { number: user.level });
    // }

    function bannerSelect(index) {
      $state.go('external', {
        name: '麦子金服财富',
        link: vm.bannerList[index].link
      });
    }

  }
})();
