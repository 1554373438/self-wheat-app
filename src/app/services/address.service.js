(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AddressService', AddressService);

  /** @ngInject */
  function AddressService(SystemApi) {
    var self = this;

    self.provinceList = [];
    self.cityList = [];
    self.selectProvince = selectProvince;

    init();

    function init() {
      self.provinceList.length = 0;
      SystemApi.getProvinceList().success(function(res) {
        if(res.flag === 1) {
          res.data.forEach(function(_item) {
            var item = {
              name: _item.province_name,
              id: _item.province_code
            };

            self.provinceList.push(item);
          });
        }
      });
    }

    function selectProvince(province) {
      self.cityList.length = 0;
      SystemApi.getCityList({
        provinceName: province.name
      }).success(function(res) {
        if(res.flag === 1) {
          res.data.forEach(function(_item) {
            var item = {
              name: _item.city_name,
              id: _item.city_id
            };

            self.cityList.push(item);
          });
        }
      });
    }
    
  }
})();
