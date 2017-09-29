(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('OrderService', OrderService);

  /** @ngInject */
  function OrderService(localStorageService) {
    var self = this;
    self.productType = {
      jingxuan: 1,
      xinke: 2,
      tiexin: 5,
      lingyuan: 7,
      santou: 8,
      zhaizhuan:9,
      yys: 15,
      nny:  16
    };

    self.resetOrder = function() {
      localStorageService.set('order', {});
    };

    self.setOrder = function(_order) {
      self.resetOrder();
      localStorageService.set('order', _order);
    };

    self.updateOrder = function(_order) {
      var order = self.getOrder();
      angular.merge(order, _order);
      localStorageService.set('order', order);
    };

    self.getOrder = function() {
      return localStorageService.get('order') || {};
    };
  }
})();
