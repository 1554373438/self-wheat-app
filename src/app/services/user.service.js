(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('UserService', UserService);

  /** @ngInject */
  function UserService(UserApi, AccApi, $log, $rootScope, $location, $ionicHistory, user, localStorageService, $timeout, $state, utils, EbankService, toastr, AppPopService, $ionicPopup) {
    var self = this;

    self.init = function() {
      $log.info('init UserService');
      var search = $location.search();
      var userAgent = navigator.userAgent;
      var reg = /deviceIdentifier|appVersion|phoneBrand|networkType/;
      if (reg.test(userAgent) || search.sessionId || search.terminal) {
        removeUser();
        user.sessionId = search.sessionId;
        self.getJwt();
      } else {
        login();
      }
    };



    self.setUser = function(_user) {
      user.sessionId = _user.sessionId;
      user.jwt = _user.jwt;
      user.refresh = _user.refresh;

      localStorageService.set('user', user);


      self.getBasicInfo();

      self.checkCGYQ(function() {
         self.updateEbankInfo(true);
      })
      // self.updateEbankInfo(true); // do check after login

      // trigger timer
      $timeout(login, 14 * 60 * 1000); // 20min
    };

    self.updateUser = function(obj) {
      var _user = self.getUser() || {};
      angular.merge(_user, obj);
      angular.merge(user, _user);
      localStorageService.set('user', _user);

    };

    self.getUser = function() {
      return localStorageService.get('user');
    };


    self.setAccountInfo = function(info) {
      localStorageService.set('account', info);
    };

    self.getAccountInfo = function() {
      return localStorageService.get('account');
    };

    self.updateAccountInfo = function(info) {
      var _info = self.getAccountInfo() || {};
      angular.merge(_info, info);
      self.setAccountInfo(_info);
    };

    self.logout = function() {
      removeUser();

      user.sessionId = null;
      user.jwt = null;
      user.refresh = null;

      $state.go('home');

      $timeout(function() {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
      }, 1000);
    };

    self.checkCGYQ = function(callback) {
      UserApi.checkCGYQ().success(function(res) {
        if (res.succeed) {
          if (res.data) {
            self.updateUser({overdue: true});
            $ionicPopup.show({
              title: '通知',
              templateUrl: 'assets/templates/overdue.html',
              cssClass: 'popup-eBank text-left'
            });
          }
        } else {
          self.updateUser({overdue: false});
        }
        callback && callback();
      }).error(function() {
        self.updateUser({overdue: false});
        callback && callback();
      });
    }

    self.getBasicInfo = function() {
      UserApi.getUserInfo().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          var info = {
            idNo: data.idNo,
            mobile: data.mobile,
            mobileEncrypted: utils.formatPhone(data.mobile), // for display
            realName: data.realName,
            username: data.username,
          };
          self.updateUser(info);

          $rootScope.$broadcast('getUserInfo.succeed');
        }
      });

      UserApi.getUserLevel().success(function(res) {
        if (res.succeed) {
          var level = res.data.level;
          self.updateUser({ level: level });
          $rootScope.$broadcast('getUserLevel.succeed');
        }
      });
      UserApi.getUserCoin().success(function(res) {
        if (res.flag == 1) {
          var coin = res.data;
          self.updateUser({ coin: coin });
          $rootScope.$broadcast('getUserCoin.succeed');
        }
      });
    };

    self.updateAssetsInfo = function() {
      var balance = {
        assets: '-', //资产
        available: '-', // 可用
        earnings: '-', //累计收益
        lastIncome: '-', //昨日收益
        total: '-', //总资产
        lock: '-', //冻结余额
      };
      self.updateAccountInfo(balance);
      AccApi.getBalance().success(function(res) {
        if (res.succeed) {
          var info = res.data;
          balance.assets = +(+info.assets).toFixed(2);
          balance.available = +(+info.nonoAvlBalance).toFixed(2);
          balance.lock = +(+info.nonoLockBalance).toFixed(2);
          balance.total = (+info.assets + info.nonoAvlBalance + info.nonoLockBalance).toFixed(2);
          balance.earnings = +(+info.earnings).toFixed(2);
          balance.lastIncome = +(+info.lastIncome).toFixed(2);
          self.updateAccountInfo(balance);
          $rootScope.$broadcast('updateAssetsInfo.complete');
        } else if (res.errorCode == '0600003') {
          toastr.info('暂未开通徽商存管');
        }
      });
    };

    self.updateEbankInfo = function(doCheck) {
      AccApi.getEbankInfo().success(function(res) {
        if (res.succeed) {
          var data = res.data;
          var eBankInfo = {
            hasEBank: data.hasEBank, //是否开户
            isAuth: data.isAuth, //是否绑卡
            hasPayPwd: data.hasPwd, //是否设置密码
            hasSign4Bid: data.hasSign4Bid, // 是否自动投标
            hasSign4Debt: data.hasSign4Debt, // 是否自动债转
            investAuth: data.hasSign4Bid && data.hasSign4Debt
          };
          self.updateUser(eBankInfo);
          if (user.overdue) {
            return;
          }
          if (!eBankInfo.hasEBank && doCheck) {
            if (AppPopService.renameStoraged) {
              showEBankPopup();
            } else {
              $rootScope.$on('renameModal.closed', function() {
                showEBankPopup();
              })
            }
          }

        }
      });
    }

    function showEBankPopup() {
      utils.confirm({
        title: '通知',
        content: '<p>麦子金服财富全面升级徽商银行存管为您提供资金透明、符合监管、严格自律的平台服务。</p>',
        cssClass: 'popup-eBank text-left',
        okText: '立即开通徽商存管',
        okType: 'button-positive button-clear',
        cancelText: '先去逛逛',
        cancelType: 'button-positive button-clear',
        onOk: function() {
          EbankService.goPage('entrance');
        }
      });
    }

    function removeUser() {
      // Don't clear all, only user related.
      localStorageService.remove('user', 'account');
      sessionStorage.clear();
    }

    // user for first time
    function login() {
      var _user = self.getUser() || {};
      angular.merge(user, _user);
      if (_user.refresh) {
        UserApi.refreshJwt({ refresh: _user.refresh }).success(function(res) {
          if (res.succeed) {
            angular.merge(_user, res.data);
            self.setUser(res.data);
            $rootScope.$broadcast('getJwt.succeed');
          } else {
            removeUser();
          }
        }).error(function(res, status) {
          if(status == 401) {
            removeUser();
            toastr.info('请重新登录');
          }
        });
      } else {
        getJwt();
      }
    }

    function getJwt() {
      if (!user.sessionId) {
        return;
      }

      UserApi.getJWT().success(function(res) {
        if (res.succeed) {
          self.setUser(res.data);
          $rootScope.$broadcast('getJwt.succeed');
        }

      });
    }

    self.getJwt = getJwt;

  }
})();
