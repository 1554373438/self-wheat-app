(function(){
	'use strict';

	angular
		.module('nonoApp')
		.controller('ErrorController', ErrorController);

	/** @ngInject */
	function ErrorController($stateParams){
		var vm = this;
		vm.title='敬请期待';
		
		vm.type = $stateParams.type || '';
		if(vm.type == '404'){
			vm.title = '网络故障';
		}
	}


})();