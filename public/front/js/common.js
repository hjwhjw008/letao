;(function() {
/*-------------------------------------------------------------------------------------------------------------
                                      方法封装
  ----------------------------------------------------------------------------------------------------------- */

  //区域滚动方法封装 依赖mui框架
  function scroll() {
    mui('.mui-scroll-wrapper').scroll({
      deceleration: 0.0008, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
      indicators: false
    });
  }

  //轮播图功能  依赖mui框架
  function carousel() {
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 3000, //自动轮播周期，若为0则不自动播放，默认为0；

    });
  }

  

/*-------------------------------------------------------------------------------------------------------------
                                      方法调用
  ----------------------------------------------------------------------------------------------------------- */
  //区域滚动功能
  scroll();
  //轮播图功能
  carousel();
})();


//公用方法获取地址栏参数的方法
//k: 要获取的参数键名
function getSearch(k) {
  //获取地址栏参数
  var search = location.search;
  //将编码转为中文
  search = decodeURI(search);
  //去掉问号
  search = search.slice(1);
  //去掉&
  var arr = search.split("&");
  //对象存储键值对
  var obj = {};
  //遍历数组,去掉=, 存储为键值对
  arr.forEach(function (v, i) {
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value;
  });
  return obj[k];
}