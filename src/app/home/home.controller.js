(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('HomeController', HomeController);

  /** @ngInject */

  function HomeController($scope, $rootScope, $state, user, AppService, BasicApi, UserApi, InvtApi, toastr, toastrConfig, $timeout, $interval, $ionicScrollDelegate, $location, $ionicModal, localStorageService, $log, AppPopService, DefinedPopService) {
    _czc.push(['_trackEvent', '微站-首页', 'PV']);
    var vm = this,
      slider, ticker, modal, mScope = $rootScope.$new(true);
    vm.user = user;
    mScope.fn = {};
    mScope.fn.close = closeModal;
    mScope.fn.goProductDetail = goProductDetail;


    var tip = {
      active: false,
      info: function(msg) {
        var _this = this;
        if (_this.active) {
          return; 
        }
        _this.active = true;
        vm.tipInfo = msg;
        $timeout(function() {
          vm.tipInfo = '';
          _this.active = false;
        }, 3000);
      }
    };

    vm.hideNavBar = true;
    vm.infoNull = true;
    vm.doRefresh = loadHomeData;
    vm.bannerDetail = bannerDetail;

    vm.nonoAppInfo = {};

    vm.goPage = goPage;
    vm.goRegPage = goRegPage;
    vm.goToProduct = goToProduct;
    vm.goToIconDetail = goToIconDetail;
    vm.login = login;

    vm.options = {
      loop: true,
      effect: 'fade',
      speed: 500,
      autoplay: 2000
    };
    // banner sliders
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

    // main scroll
    $scope.$watch(function() {
      return $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition() && $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
    }, function(val) {
      vm.hideNavBar = val < 44;
    });

    // init();


    function init() {
      checkModal();

      var oldData = localStorageService.get('oldHomeData');
      var newData = localStorageService.get('newHomeData');
      if (oldData && newData) {
        initData(oldData);
        initNewData(newData);
      }
      loadHomeData();
    }

    function checkModal() {
      // if ($location.search().showPop) {
      //   if (AppPopService.renameStoraged) {
      //     showModal('app/home/reg.success.modal.html');
      //   } else {
      //     $rootScope.$on('renameModal.closed', function() {
      //       showModal('app/home/reg.success.modal.html');
      //     })
      //   }
      //   $location.url($location.path());
      // } else {
      //   if (AppPopService.renameStoraged) {
      //     DefinedPopService.showDefinedPopup();
      //   } else {
      //     $rootScope.$on('renameModal.closed', function() {
      //       DefinedPopService.showDefinedPopup();
      //     })
      //   }
      // }
      if (AppPopService.renameStoraged) {
        DefinedPopService.showDefinedPopup();
      } else {
        $rootScope.$on('renameModal.closed', function() {
          DefinedPopService.showDefinedPopup();
        })
      }
    }

    function showModal(templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: mScope,
        animation: 'slide-in-up'
      }).then(function(_modal) {
        modal = _modal;
        modal.show();
      });
    }

    function closeModal() {
      modal.remove();
      DefinedPopService.showDefinedPopup();
    }

    function goProductDetail() {
      closeModal();
      goToProduct(0);
    }

    function initData(oldData) {
      if (!oldData) {
        return;
      }
      vm.banners = oldData.banner;

      vm.hotRecommend = [];
      oldData && oldData.hotRecommend.forEach(function(_item) {
        var rateStr = _item.rateShow;
        var isAdd = rateStr.indexOf('+');
        if (+_item.proType == 1 && +isAdd > -1) {
          var rateSplite = rateStr.split("+");
          var ratePre = rateSplite[0].replace(/([\d.])/g, '<span class="font-30">$1</span>');
          var rateNext = rateSplite[1].replace(/([\d.])/g, '<span class="font-20">$1</span>');
          _item.rateShow = ratePre + '<span class="font-20 bold">+</span>' + rateNext;
        } else {
          _item.rateShow = rateStr.replace(/([\d.])/g, '<span class="font-30">$1</span>');
        }
        
        if(_item.proType != 0){
          vm.hotRecommend.push(_item);
        }
      });
    }

    function initNewData(newData) {
      if (!newData) {
        return;
      }
      vm.nonoAppInfo = newData;
      vm.xinKeRateShow = newData.xinke.fp_rate.replace(/%/g, '<span class="small">%</span>');
    }

    function loadHomeData() {
      BasicApi.getHomeData().success(function(res) {
        vm.infoNull = false;
        if (res.flag == 1) {
          var oldData = res.data;
          localStorageService.set('oldHomeData', oldData);
          // sessionStorage.setItem('oldHomeData', JSON.stringify(oldData));
          initData(oldData);
        }
      }).finally(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
      });
      getNewData();
      getCoupon();
    }

    function getNewData() {
      InvtApi.getHomeDataAppMobile().success(function(res) {
        vm.infoNull = false;
        if (res.succeed) {
          var newData = res.data;
          localStorageService.set('newHomeData', newData);
          // sessionStorage.setItem('newHomeData', JSON.stringify(newData));
          initNewData(newData);
        }
      });
    }

    function getCoupon() {
      if (!user.sessionId) {
        return;
      }
      BasicApi.getAppCoupon().success(function(res) {
        if (res.flag == 1) {
          var info = res.data.info;
          if (info) {
            tip.info(info);
          }
        }
      });
    }

    function bannerDetail(index) {
      var item = vm.banners[index];
      $state.go('external', { name: item.name, link: item.link });
    }

    function goToProduct(index) {
      _czc.push(['_trackEvent', '微站-首页', '点击', '为你的推荐']);
      var p = vm.hotRecommend[index];
      var type = p.proType || p.type;
      switch (+type) {
        case 0:
          $state.go('invest:detail', { scope: p.scope, id: p.fp_id }); //新客
          break;
        case 1:
          $state.go('invest:detail', { scope: p.scope, id: p.fp_id }); //计划类
          break;
        case 2:
          $state.go('yys:detail', { scope: p.scope, id: p.fp_id }); //月月升详情
          break;
        case 3:
          $state.go('product', { type: 2 }); //诺诺盈
          break;
        case 4:
          $state.go('product', { type: 3 }); //债权转让
          break;
      }
    }


    function goPage(router) {
      if (router == 'safe') {
        $state.go(router);
        return;
      }
      if (router == 'envoy') {
        $state.go(router);
        return;
      }
      if (router == 'task') {
        $state.go(router);
        return;
      }
    }

    function goRegPage(isLogin, isXinke) {
      if (isLogin && isXinke) {
        $state.go('invest:detail', { scope: vm.nonoAppInfo.xinke.fp_status, id: vm.nonoAppInfo.xinke.fp_id });
        return;
      }
      if (!isLogin) {
        AppService.register({
          onSuccess: function() {
            AppService.showNotePopup();
            loadHomeData();
          }
        });
      }
    }

    function goToIconDetail(index) {
      var item = vm.nonoAppInfo.modules[index];
      $state.go('external', { name: item.name, link: item.link });
    }

    function login() {
      AppService.login({
        onSuccess: function() {
          checkModal();
          loadHomeData();
          AppService.showNotePopup();
        }
      });
    }

  }
})();
