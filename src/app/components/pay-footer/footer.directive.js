(function() {
  'use strict';

  angular
    .module('nonoApp')
    .directive('nonoPayFooter', nonoPayFooter);

  /** @ngInject */
  function nonoPayFooter($state, $ionicPopup, $rootScope, user, utils, toastr, CouponService, EbankService, TrdApi, APISERVER, OrderService, $location, $log, localStorageService, CLIENT_VERSION) {
    var directive = {
      restrict: 'E',
      scope: {
        order: '=',
        balance: '=',
        agreetos: '=',
        pay: "="
      },
      replace: true,
      templateUrl: 'app/components/pay-footer/footer.html',
      link: function(scope, element) {
        scope.order.needPay = scope.order.price;
        var selectedCash = CouponService.selectedCash;
        var canChangeAmount = true; //是否可以改变投资金额

        init();

        function init() {
          scope.checked = true;
          scope.submit = submit;

          if (scope.order.productType == 9) { //债转
            canChangeAmount = false;
          }

          addListener();

        }

        function addListener() {
          scope.$watch(function() {
            return +scope.balance
          }, function(newVal, oldVal) {
            if (newVal == oldVal) {
              return;
            }
            updatePrice();
          });
          // 监测购买金额变化
          if (canChangeAmount) {
            scope.$watch(function() {
              return +scope.order.price;
            }, function(newVal, oldVal) {
              if (newVal == oldVal) {
                return;
              }
              if (!newVal) {
                scope.order.needPay = 0;
                scope.balancePayShow = 0;
                return;
              }
              updatePrice();
            });
          }

          // 券选择
          scope.$watch(function() {
            return selectedCash.value
          }, function(newVal, oldVal) {
            updatePrice();

          }, true);

          function updatePrice() {
            var dis = scope.balance - (scope.order.price - selectedCash.value);
            scope.order.needPay = dis >= 0 ? 0 : -dis;
            if (scope.order.needPay == 0) {
              scope.balancePayShow = scope.order.price - selectedCash.value;
            } else {
              scope.balancePayShow = scope.balance;
            }
            $log.debug('needPay', scope.order.needPay);
          }

        }


        function submit() {
          _czc.push(['_trackEvent', '微站-投资', '点击', '确认支付／充值']);
          // 判断是否设置支付密码
          //计划类判断是否开通自动投标
          // 如果余额不足去充值
          // 计划类弹确认投资弹窗
          //非计划类调接口 去输入密码
          if (scope.order.increment && (scope.order.price % scope.order.increment)) {
            toastr.info('投资金额必须是' + scope.order.increment + '的整数倍');
            return;
          }

          if (!user.hasPayPwd) {
            utils.confirm({
              title: '温馨提示',
              content: '<p>麦子金服财富已接入徽商存管，如需投资，请先设置交易密码。</p>',
              cssClass: 'text-left',
              okText: '确定',
              okType: 'button-positive button-clear',
              cancelText: '取消',
              cancelType: '',
              onOk: function() {
                EbankService.goPage('pwd/set.html');
              }
            });
            return;
          }

          // 计划类判断是否开通了自动投标和自动债转
          var needAutoInvest = scope.order.productType != 9 && scope.order.productType != 16;

          if (needAutoInvest && !user.investAuth) {
            utils.confirm({
              title: '智能投资授权',
              content: '<p>麦子金服财富已接入徽商存管，如需购买计划类产品，请先开通徽商银行自动投标和自动债转。</p>',
              cssClass: 'text-left',
              okText: '确定',
              okType: 'button-positive button-clear',
              cancelText: '取消',
              cancelType: '',
              onOk: function() {
                EbankService.goPage('autoInvest/index.html?firstPage=1');
              }
            });
            return;
          }

          if (+scope.order.needPay > 0) {
            localStorageService.set("needPay", scope.order.needPay);
            $state.go('topup');
            return;
          }

          if (scope.order.productType != 9) {
            //计划类、诺诺盈有弹框提示
            showConfirmPop();
          } else {
            confirmPay();
          }

        }

        function showConfirmPop() {
          var confirmScope = $rootScope.$new(true);
          confirmScope.amount = scope.balancePayShow;
          confirmScope.earnings = scope.order.earnings;
          if (scope.order.productType != 9) {
            confirmScope.hasCoupon = true;
            confirmScope.couponVal = selectedCash.value || 0
          } else {
            confirmScope.hasCoupon = false;
          }
          $ionicPopup.show({
            title: '确认投资',
            templateUrl: 'app/components/pay-footer/confirmPay.popup.html',
            scope: confirmScope,
            buttons: [{
              text: '取消'
            }, {
              text: '确定',
              type: 'button-positive button-clear',
              onTap: function(e) {
                confirmPay();
              }
            }]
          });
        }

        function confirmPay() {
          var couponList = [];


          // 现金券、加息券
          if (scope.order.productType != 9) {
            var cashArr = CouponService.selectedCash.list;
            var interestArr = CouponService.selectedInterest.list;
            cashArr.forEach(function(_item) {
              couponList.push({ 'couponType': 'userCoupon', 'couponCode': _item.code });
            });
            interestArr.forEach(function(_item) {
              couponList.push({ 'couponType': 'userCoupon', 'couponCode': _item.code });
            });
            $log.debug('couponList', couponList);
          }
          var rate = scope.order.rate && scope.order.rate.replace('%', '');
          var title = encodeURIComponent(scope.order.title);


          if (CLIENT_VERSION) {
            var surl = APISERVER.HOST + '/hscg/purchase/success.html?amount=' + scope.order.price + '&type=' + scope.order.productType;
            var furl = APISERVER.HOST + '/hscg/purchase/fail.html?fpTitle=' + title;
            var purl = APISERVER.HOST + '/hscg/pwd/reset.html?sessionId=' + user.sessionId + '&terminal=3';
          } else {
            var homePage = encodeURIComponent(APISERVER.HOST + '/nono-app/');
            var failUrl = encodeURIComponent(APISERVER.HOST + '/nono-app/#/freeze');
            var curPage = encodeURIComponent($location.absUrl());

            var surl = APISERVER.HOST + '/hscg/purchase/success.html?amount=' + scope.order.price + '&type=' + scope.order.productType + '&urlCallBack=' + homePage;
            var furl = APISERVER.HOST + '/hscg/purchase/fail.html?fpTitle=' + title + '&urlCallBack=' + failUrl;
            var purl = APISERVER.HOST + '/hscg/pwd/reset.html?sessionId=' + user.sessionId + '&terminal=3&urlCallBack=' + curPage;
          }

          var params = {
            transAmount: scope.order.price,
            productId: scope.order.id,
            productName: scope.order.title,
            productType: scope.order.productType,
            productYield: rate,
            couponList: couponList,
            surl: surl,
            furl: furl,
            purl: purl,
            needRedis: true,
            systemId: 0
          };

          TrdApi.purchase(params).success(function(res) {
            if (!res.succeed) {
              //散标存在冻结记录
              if (res.errorCode == '0300022') {
                $state.go('freeze');
              } else {
                toastr.info(res.errorMessage);
              }
              return;
            }
            var data = res.data;
            if (!data.isRedirect) {
              OrderService.updateOrder({ paySuccess: true, amount: scope.order.price });
              $state.go('purchase:success');
            } else {
              EbankService.formPOST(res.data.targetUrl, res.data.formData);
            }

          })
        }

      }
    }
    return directive;
  }

})();
