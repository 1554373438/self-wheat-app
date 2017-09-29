(function() {
  'use strict';

  angular
    .module('nonoApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('product', {
        url: '/product/:type',
        templateUrl: 'app/product/product.html',
        controller: 'ProductController',
        controllerAs: 'product'
      })
      .state('discover', {
        url: '/discover',
        templateUrl: 'app/discover/discover.html',
        controller: 'DiscoverController',
        controllerAs: 'discovery'
      })
      .state('mine', {
        url: '/mine',
        templateUrl: 'app/mine/mine.html',
        controller: 'MineController',
        controllerAs: 'mine'
      })

      // home tab pages
      .state('envoy', {
        url: '/envoy',
        templateUrl: 'app/envoy/envoy.html',
        controller: 'EnvoyController',
        controllerAs: 'envoy'
      })
      .state('envoy:reward', {
        url: '/envoy/reward',
        templateUrl: 'app/envoy/reward/reward.html',
        controller: 'EnvoyRewardController',
        controllerAs: 'reward'
      })
      .state('envoy:rules', {
        url: '/envoy/rules',
        templateUrl: 'app/envoy/rules.html'
      })
      .state('envoy:record', {
        url: '/envoy/record/:balance/:haveRedPacket',
        templateUrl: 'app/envoy/record/list.html',
        controller: 'EnvoyRecordController',
        controllerAs: 'record'
      })

      .state('safe', {
        url: '/safe/:part',
        templateUrl: 'app/safe/safe.html',
        controller: 'SafeController',
        controllerAs: 'safe'
      })
      .state('safe1', {
        url: '/safe',
        templateUrl: 'app/safe/safe.html',
        controller: 'SafeController',
        controllerAs: 'safe'
      })
      .state('error', {
        url: '/error/:type',
        templateUrl: 'app/error/error.html',
        controller: 'ErrorController',
        controllerAs: 'error'
      })

      // discover tab pages
      .state('activity', {
        url: '/activity',
        templateUrl: 'app/activity/activity.html',
        controller: 'ActivityController',
        controllerAs: 'activity'
      })
      .state('entertainment', {
        url: '/entertainment',
        templateUrl: 'app/entertainment/entertainment.html',
        controller: 'EntertainmentController',
        controllerAs: 'entertainment'
      })

      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html'
      })
      .state('about:intro', {
        url: '/about/intro',
        templateUrl: 'app/about/intro/intro.html',
        controller: 'AboutIntroController',
        controllerAs: 'intro',
        defaultBack: {
          state: 'about'
        }
      })
      .state('about:team', {
        url: '/about/team',
        templateUrl: 'app/about/team/team.html',
        controller: 'AboutTeamController',
        controllerAs: 'team'
      })
      .state('about:news', {
        url: '/about/news',
        templateUrl: 'app/about/news/news.html',
        controller: 'AboutNewsController',
        controllerAs: 'news',
        defaultBack: {
          state: 'about'
        }
      })
      .state('mall', {
        url: '/mall',
        templateUrl: 'app/mall/index.html',
        controller: 'MallController',
        controllerAs: 'mall'
      })
      .state('mall:data', {
        url: '/mall/data',
        templateUrl: 'app/mall/data/data.html',
        controller: 'MallDataController',
        controllerAs: 'data'
      })
      .state('mall:level', {
        url: '/mall/level/:number',
        templateUrl: 'app/mall/level/level.html',
        controller: 'MallLevelController',
        controllerAs: 'level'
      })
      .state('mall:productDetail', {
        url: '/mall/productDetail/:id',
        templateUrl: 'app/mall/product-detail/detail.html',
        controller: 'MallProductDetailController',
        controllerAs: 'detail'
      })
      .state('mall:exchange', {
        url: '/mall/exchange',
        templateUrl: 'app/mall/commodity-exchange/exchange.html',
        controller: 'ExchangeController',
        controllerAs: 'exchanges'
      })
      .state('mall:exchange:detaild', {
        url: '/mall/exchangedetailed',
        templateUrl: 'app/mall/commodity-detailed/commodity-detailed.html',
        controller: 'CommodityDetailedController',
        controllerAs: 'edetailed'
      })
      .state('mall:product:list', {
        url: '/mall/productlist',
        templateUrl: 'app/mall/product-list/product-list.html',
        controller: 'ProductListController',
        controllerAs: 'productlist'
      })
      .state('mall:exchange:list', {
        url: '/mall/exchangelist',
        templateUrl: 'app/mall/exchange-list/exchange-list.html',
        controller: 'ExchangelistController',
        controllerAs: 'eclist'
      })
      .state('mall:nb:list', {
        url: '/mall/nblist',
        templateUrl: 'app/mall/nb/nb.html',
        controller: 'NblistController',
        controllerAs: 'nblist'
      })
      .state('mall:myproduct:list', {
        url: '/mall/myproductlist',
        templateUrl: 'app/mall/myproduct-list/myproduct-list.html',
        controller: 'MyProductListController',
        controllerAs: 'myproductlist'
      })
      .state('mall:nbRules', {
        url: '/mall/nbRules',
        templateUrl: 'app/mall/nbRules/rules.html',
        controller: 'NBRuleController',
        controllerAs: 'rule'
      })
      .state('strategy', {
        url: '/strategy',
        templateUrl: 'app/strategy/strategy.html',
        controller: 'StrategyController',
        controllerAs: 'strategy'
      })
      .state('report', {
        url: '/report',
        templateUrl: 'app/report/report.html'
      })
      .state('task', {
        url: '/task',
        templateUrl: 'app/task/task.html',
        controller: 'TaskController',
        controllerAs: 'task'
      })

      // product tab pages
      // 定投
      .state('invest:detail', {
        url: '/invest/detail/:scope/:id',
        templateUrl: 'app/invest/detail/detail.html',
        controller: 'InvestDetailController',
        controllerAs: 'detail',
        defaultBack: {
          state: 'product',
          params: {
            type: 0
          }
        }
      })
      .state('invest:bordetail', {
        url: '/invest/bordetail/:bo_id/:user_id',
        templateUrl: 'app/invest/bordetail/bordetail.html',
        controller: 'InvestBordetailController',
        controllerAs: 'bordetail'
      })
      // 月月升
      .state('yys:detail', {
        url: '/yys/detail/:scope/:id',
        templateUrl: 'app/invest/detail/detail.html',
        controller: 'InvestDetailController',
        controllerAs: 'detail',
        defaultBack: {
          state: 'product',
          params: {
            type: 1
          }
        }
      })

      //直投
      .state('directInvest:detail', {
        url: '/directInvest/detail/:id',
        templateUrl: 'app/direct-invest/detail/detail.html',
        controller: 'DirectInvestDetailController',
        controllerAs: 'detail',
        defaultBack: {
          state: 'product',
          params: {
            type: 2
          }
        }
      })
      .state('nny:protocol', { // 诺诺盈投资协议|借款协议
        url: '/directInvest/protocol/:id',
        templateUrl: 'app/direct-invest/protocol/protocol.html',
        controller: 'NnyProtocolController',
        controllerAs: 'protocol'
      })
      // 购买
      .state('purchase', {
        url: '/purchase',
        templateUrl: 'app/purchase/purchase.html',
        controller: 'PurchaseController',
        controllerAs: 'purchase',
        defaultBack: {
          state: 'product',
          params: {
            type: 1
          }
        }
      })
      .state('purchase:success', {
        url: '/purchase/success',
        templateUrl: 'app/purchase/purchase.success.html',
        controller: 'PurchaseSuccessController',
        controllerAs: 'success'
      })


      //债转
      .state('debtInvest:detail', {
        url: '/debtInvest/detail/:id',
        templateUrl: 'app/debt-invest/detail/detail.html',
        controller: 'DebtInvestDetailController',
        controllerAs: 'detail',
        defaultBack: {
          state: 'product',
          params: {
            type: 3
          }
        }
      })
      .state('debtInvest:bordetail', {
        url: '/debtInvest/bordetail/:bo_id/:user_id',
        templateUrl: 'app/debt-invest/bordetail/bordetail.html',
        controller: 'DebtInvestBordetailController',
        controllerAs: 'bordetail'
      })
      .state('debtInvest:intro', {
        url: '/debtInvest/intro/:id',
        templateUrl: 'app/debt-invest/intro/intro.html',
        controller: 'DebtInvestIntroController',
        controllerAs: 'intro'
      })
      .state('debtInvest:purchase', {
        url: '/debtInvest/purchase',
        templateUrl: 'app/debt-invest/purchase/purchase.html',
        controller: 'DebtPurchaseController',
        controllerAs: 'debtpurchase'
      })
      .state('debtpurchase:success', {
        url: '/debtpurchase/success',
        templateUrl: 'app/debt-invest/purchase/purchase.success.html',
        controller: 'DebtPurchaseSuccessController',
        controllerAs: 'debtsuccess'
      })

      // 特色投资
      .state('specInvest', {
        url: '/specInvest/:isShare',
        templateUrl: 'app/spec-invest/error.html',
        defaultBack: {
          state: 'home'
        }
        // templateUrl: 'app/spec-invest/list.html',
        // controller: 'SpecInvestController',
        // controllerAs: 'list'
      })
      .state('specInvest:detail', {
        url: '/specInvest/detail/:name/:isShare',
        templateUrl: 'app/spec-invest/error.html'
        // templateUrl: 'app/spec-invest/detail/detail.html',
        // controller: 'SpecInvestDetailController',
        // controllerAs: 'detail'
      })
      .state('specInvest:purchase', {
        url: '/specInvest/purchase/',
        templateUrl: 'app/spec-invest/purchase/purchase.html',
        controller: 'SpecInvestPurchaseController',
        controllerAs: 'purchase'
      })
      .state('specInvest:address', {
        url: '/specInvest/address/',
        templateUrl: 'app/spec-invest/address/address.html',
        controller: 'SpecInvestAddressController',
        controllerAs: 'address'
      })

      //我的债权
      .state('myDebt:list', {
        url: '/myDebt/list',
        templateUrl: 'app/my-debt/list/list.html',
        controller: 'MyDebtController',
        controllerAs: 'list'
      })
      .state('myDebt:accounts', {
        url: '/myDebt/accounts/:id/:type',
        templateUrl: 'app/my-debt/accounts/accounts.html',
        controller: 'AccountsController',
        controllerAs: 'account'
      })
      .state('myDebt:pick', {
        url: '/myDebt/pick/:id',
        templateUrl: 'app/my-debt/pick/pick.html',
        controller: 'PickController',
        controllerAs: 'pick'
      })
      .state('debt:instruction', { // 债权说明
        url: '/debt/instruction',
        templateUrl: 'app/my-debt/instruction/instruction.html',
        controller: 'DebtInstructionController',
        controllerAs: 'inst'
      })

      // 协议相关
      .state('instructions', {
        url: '/tos/instructions/:type/:collectionMode',
        templateUrl: 'app/tos/instructions.html',
        controller: 'InstructionsController',
        controllerAs: 'ins'
      })
      .state('protocol', {
        url: '/tos/protocol/:type/:id',
        templateUrl: 'app/tos/protocol.html',
        controller: 'ProtocolController',
        controllerAs: 'protocol'
      })
      .state('debt:protocol', {
        url: '/tos/debt/:id',
        templateUrl: 'app/tos/debt.protocol.html',
        controller: 'DebtProtocolController',
        controllerAs: 'protocol'
      })
      .state('nxy:plan', { //
        url: '/nxy/tos/plan',
        templateUrl: 'app/nxy/tos/instruction.html',
        controller: 'NxyInstructionController',
        controllerAs: 'instruction'
      })
      .state('login:regprivacy', {
        url: '/login/regprivacy',
        templateUrl: 'app/login/regprivacy.html',
        controller: 'RegPrivacyController',
        controllerAs: 'regPrivacy'
      })

      //月月升
      .state('monthUp:instruction', { // 月月升债权说明
        url: '/monthUp/instruction',
        templateUrl: 'app/month-up/tos/instruction.html'
      })
      .state('monthUp:help', { // 月月升债权说明
        url: '/monthUp/help',
        templateUrl: 'app/month-up/tos/help.html'
      })
      .state('monthUp:protocol', { // 月月升协议
        url: '/monthUp/protocol/:id',
        templateUrl: 'app/month-up/tos/protocol.html',
        controller: 'MonthUpProtocolController',
        controllerAs: 'protocol'
      })

      .state('coupon', {
        url: '/coupon/:type',
        templateUrl: 'app/coupon/coupon.html',
        controller: 'CouponController',
        controllerAs: 'coupon',
        defaultBack: {
          state: 'purchase'
        }
      })
      .state('noCoupon', {
        url: '/noCoupon',
        templateUrl: 'app/coupon/no.coupon.html'
      })

      // mine tab pages
      .state('msg', {
        url: '/msg',
        templateUrl: 'app/notice/list/list.html',
        controller: 'MsgController',
        controllerAs: 'msg'
      })
      .state('msg:detail', {
        url: '/msg/detail/:type/:id',
        templateUrl: 'app/notice/detail/detail.html',
        controller: 'MsgDetailController',
        controllerAs: 'detail'
      })
      .state('news', {
        url: '/news',
        templateUrl: 'app/notice/newslist/newslist.html',
        controller: 'NewsListController',
        controllerAs: 'newslist'
      })
      .state('repay', {
        url: '/repay',
        templateUrl: 'app/repay/repay.html',
        controller: 'RepayController',
        controllerAs: 'repay'
      })
      .state('welfare', {
        url: '/welfare/item/:index',
        templateUrl: 'app/welfare/welfare.html',
        controller: 'WelfareController',
        controllerAs: 'welfare'
      })
      .state('welfare:rules', {
        url: '/welfare/rules',
        templateUrl: 'app/welfare/rules.html'
      })
      .state('setting', {
        url: '/setting',
        templateUrl: 'app/setting/setting.html',
        controller: 'SettingController',
        controllerAs: 'setting',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('tender', {
        url: '/tender/:type',
        templateUrl: 'app/setting/tender/tender.html',
        controller: 'TenderController',
        controllerAs: 'tender'
      })
      .state('security', {
        url: '/security',
        templateUrl: 'app/setting/security/security.html',
        controller: 'SecurityController',
        controllerAs: 'security',
        defaultBack: {
          state: 'setting'
        }
      })
      // 登录密码相关
      .state('password:update', {
        url: '/password/update/:type',
        templateUrl: 'app/password/update/update.html',
        controller: 'UpdatePasswordController',
        controllerAs: 'pwd'
      })
      .state('password:forget', {
        url: '/password/forget',
        templateUrl: 'app/password/forget/forget.html',
        controller: 'ForgetPasswordController',
        controllerAs: 'forget'
      })
      .state('password:reset', {
        url: '/password/reset/:sessionId',
        templateUrl: 'app/password/forget/reset.html',
        controller: 'ResetPasswordController',
        controllerAs: 'reset'
      })

      // .state('feedback', {
      //     url: '/feedback',
      //     templateUrl: 'app/setting/feedback/feedback.html',
      //     controller: 'FeedbackController',
      //     controllerAs: 'feedback'
      //   })
      .state('address', {
        url: '/address',
        templateUrl: 'app/setting/address/address.html',
        controller: 'AddressController',
        controllerAs: 'address'
      })
      .state('mobile:update:step1', {
        url: '/mobile/update/step1',
        templateUrl: 'app/setting/mobile/update.step1.html',
        controller: 'MobileUpdateController',
        controllerAs: 'update'
      })
      .state('mobile:update:step2', {
        url: '/mobile/update/step2',
        templateUrl: 'app/setting/mobile/update.step2.html',
        controller: 'MobileUpdateController',
        controllerAs: 'update'
      })

      .state('limit', {
        url: '/limit',
        templateUrl: 'app/limit/limit.html',
        controller: 'LimitController',
        controllerAs: 'limit'
      })
      .state('card', {
        url: '/card',
        templateUrl: 'app/card/card.html',
        controller: 'CardController',
        controllerAs: 'card',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('card:detail', {
        url: '/card/detail',
        templateUrl: 'app/card/detail/detail.html',
        controller: 'CardDetailController',
        controllerAs: 'detail'
      })
      .state('card:add', {
        url: '/card/add',
        templateUrl: 'app/card/add/add.step1.html',
        controller: 'CardAddControllerStep1',
        controllerAs: 'add'
      })
      .state('card:add:step2', {
        url: '/card/add/2',
        templateUrl: 'app/card/add/add.step2.html',
        controller: 'CardAddControllerStep2',
        controllerAs: 'add'
      })

      .state('card:select', {
        url: '/card/select',
        templateUrl: 'app/card/select/select.html',
        controller: 'CardSelectController',
        controllerAs: 'card'
      })

      .state('assets', { // 总资产
        url: '/assets',
        templateUrl: 'app/assets/assets.html',
        controller: 'AssetsController',
        controllerAs: 'assets',
        defaultBack: {
           state: 'mine'
        }
      })
      .state('earnings', { // 累计收益
        url: '/earnings',
        templateUrl: 'app/earnings/earnings.html',
        controller: 'EarningsController',
        controllerAs: 'earnings',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('balance', { // 余额明细
        url: '/balance',
        templateUrl: 'app/balance/balance.html',
        controller: 'BalanceController',
        controllerAs: 'balance'
      })
      .state('topup', { // 充值
        url: '/topup',
        templateUrl: 'app/top-up/topup.html',
        controller: 'TopUpController',
        controllerAs: 'topup',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('withdraw', { // 提现
        url: '/withdraw',
        templateUrl: 'app/withdraw/withdraw.html',
        controller: 'WithdrawController',
        controllerAs: 'withdraw',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('withdraw:fee', { // 手续费说明
        url: '/withdraw/feeIntroduce',
        templateUrl: 'app/withdraw/feeIntroduce.html',
        controllerAs: 'withdrawFeeIntroduce'
      })
      .state('withdraw:success', { // 提现
        url: '/withdraw/success/:amount',
        templateUrl: 'app/withdraw/success.html',
        controller: 'WithdrawSuccessController',
        controllerAs: 'success'
      })
      .state('withdraw:history', { // 提现记录
        url: '/withdraw/history',
        templateUrl: 'app/withdraw/history/history.html',
        controller: 'WithdrawHistoryController',
        controllerAs: 'history'
      })
      .state('freeze', { // 冻结记录
        url: '/freeze',
        templateUrl: 'app/freeze/freeze.html',
        controller: 'FreezeController',
        controllerAs: 'freeze',
        defaultBack: {
          state: 'mine'
        }
      })
      // 投资记录
      .state('records:list', {
        url: '/records/list/:type',
        templateUrl: 'app/records/list/list.html',
        controller: 'RecordsListController',
        controllerAs: 'list',
        defaultBack: {
          state: 'mine'
        }
      })
      .state('records:investDetail', {            //投资记录计划类详情
        url: '/records/investDetail/:type',
        templateUrl: 'app/records/invest-detail/detail.html',
        controller: 'RecordsInvestDetailController',
        controllerAs: 'investDetail',
        defaultBack: {
          state: 'records:list'
        }
      })
      .state('records:debtPick', {                           //投资记录转让债权包；
        url: '/records/debtPick/:id',
        templateUrl: 'app/records/debt-pick/pick.html',
        controller: 'DebtPickController',
        controllerAs: 'debtPick',
        defaultBack: {
          state: 'records:investDetail'
        }
      })
      .state('records:nnyDetail', {            //投资记录诺诺盈/债转详情
        url: '/records/nny-detail/:type',
        templateUrl: 'app/records/nny-detail/detail.html',
        controller: 'RecordsNnyDetailController',
        controllerAs: 'nnyDetail',
        defaultBack: {
          state: 'records:list'
        }
      })
      .state('records:debtor', {
        url: '/records/debtor/:id',
        templateUrl: 'app/records/debtor/debtor.html',
        controller: 'RecordsDebtorController',
        controllerAs: 'debtor'
      })
      .state('records:collect', {  //收款记录
        url: '/records/collect',
        templateUrl: 'app/records/collect/collect.html',
        controller: 'CollectDetailController',
        controllerAs: 'collect'
      })
      .state('records:transfer', { //转出记录
        url: '/records/transfer/:type',
        templateUrl: 'app/records/transfer/transfer.html',
        controller: 'RecordsTransferController',
        controllerAs: 'transfer'
      })
      .state('records:latelyDetail', { //最近成交明细
        url: '/records/lately-detail/:dsId',
        templateUrl: 'app/records/lately-detail/detail.html',
        controller: 'RecordsLatelyDetailController',
        controllerAs: 'latelyDetail'
      })
      .state('records:bordetail', {
        url: '/records/bordetail/:bo_id',
        templateUrl: 'app/records/record-bordetail/bordetail.html',
        controller: 'RecordsBordetailController',
        controllerAs: 'recordsbordetail'
      })
      .state('records:transferDetail', {   //各种产品的转让详情
        url: '/records/transfer-detail/:id/:type/:from',
        templateUrl: 'app/records/transfer-detail/detail.html',
        controller: 'RecordsTransferDetailController',
        controllerAs: 'transferDetail'
      })
      .state('agreement', {
        url: '/agreement/:title/:url/:content',
        templateUrl: 'app/agreement/agreement.html',
        controller: 'AgreementController',
        controllerAs: 'agreement'
      })

      // iframe wrapper for external link
      .state('external', {
        url: '/external/:name/:link',
        templateUrl: 'app/external/external.html',
        controller: 'ExternalController',
        controllerAs: 'external'
      })



    $urlRouterProvider.otherwise('/home');
  }

})();
