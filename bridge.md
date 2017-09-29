##【nonobank4.0】h5与原生交互对接文档


##h5页面链接
* 会员等级: `/#/tab/mall/level/1 `	注： 0-3会员等级

* 一元流量：`/#/tab/flow`
* 镑客大使：`/#/tab/envoy`
* 安全保障：`/#/tab/safe`
* 诺诺钱包：`/#/tab/wallet/`
* 特色投资：`/#/tab/specInvest`
* 发现——活动：`/#/tab/activity`
* 发现——娱乐：`/#/tab/entertainment`
* 发现——公司介绍：`/#/tab/about`
* 发现——运营数据：`/#/tab/report`
* 发现——新手课堂：`/#/tab/strategy`
* 我的福利——投资记录——使用规则：`/#/tab/welfare/rules`
* 产品详情协议：待完善


## JsBridge交互
h5这边统一用bridge.send方法传递数据给app端

数据格式为json，如下：

~~~javascript
json = {
	type:'xxx', //string,必传项
	data:{}    //json，可传项
}

~~~

###header左上角返回按钮
~~~javascript
bridge.send({
	type:'backToApp' //type值为'backToApp'
})
~~~

###分享
~~~javascript
 bridge.send({
  type: 'share',   //type值为'share'
  data: {
  share_title: '', //分享title
  share_desc: '',  //分享desc
  share_url: '',   //分享链接url
  share_icon: ''   //分享小图标url
  }
});
~~~

###复制

~~~javascript
 bridge.send({
  type: 'copy',  //type值为'copy'
  data: {
  	code: ''     //复制字符串
 }
});
~~~

###镑客大使奖励详情
~~~javascript
bridge.send({
 type: 'pageSwitch',  
 data: {
    name: 'rewardDetail' 
  }
});
~~~

###特色投资购买
~~~javascript
 bridge.send({
  type: 'specInvestBuy',   
  data: {
	  buy_num: '',  //购买数量
	  product: {	//商品信息
	  	'id':'', 	//产品id
	  	 ...
	  },     	 
 }
});
~~~

###诺诺钱包
~~~javascript
 bridge.send({
  type: 'walletBuy',   
  data: { 
 	 product:{	//产品信息
 	 
 	 } 
	
 }
});
~~~

###活动页面跳转
~~~javascript
 bridge.send({
  type: 'activity',   
  data: {
	  name:'', 		//活动具体名字
	  link: ''     //活动页面url
 }
});
~~~





