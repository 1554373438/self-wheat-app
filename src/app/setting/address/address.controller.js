(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('AddressController', AddressController);

  /** @ngInject */
  function AddressController($scope, $timeout, toastr, utils, UserApi, AddressService) {
    var vm = this;

    vm.provinceList = AddressService.provinceList;
    vm.cityList = AddressService.cityList;
    vm.cityList.length = 0; // fix vm.info.city = null

    vm.save = save;

    init();

    function init() {
      UserApi.shippingAddr().success(function(res) {
        if(res.flag === 1) {
          var data = res.data;
          vm.info = {
            province: {
              id: data.current_province_code,
              name: data.cur_province
            },
            city: {
              id: data.current_city_code,
              name: data.current_city
            },
            detail: data.cur_address
          };

          addListener();
        }
      });
    }

    function addListener() {
      $scope.$watch(function() {
        return vm.info.province;
      }, function(val, old) {
        if(val && val.id && val.name) {
          AddressService.selectProvince(val); 
          if(old && !angular.equals(val, old)) {
            vm.info.city = null;
          }
        }
      }, true);
    }

    function save() {
      UserApi.shippingAddr(vm.info).success(function(res) {
        if(res.flag === 1) {
          toastr.info('地址更新成功~');
          $timeout(utils.goBack, 1000);
        } else {
          toastr.info(res.msg);
        }
      });
    }

  }
})();
