$(function() {
/*-------------------------------------------------------------------------------------------------------------
                                      方法封装
  ----------------------------------------------------------------------------------------------------------- */
  var currentPage = 1; //当前页
  var pageSize = 2; //每页的条数


//获取传递过来的参数key的值,赋值到input框
function setInput() {
  var key = getSearch("key");
  $("#search").val(key);
}


/**
 * 根据input框的值动态渲染商品列表的方法
 */
function rander(callback) {
  //处理参数
  var param = {};
  param.proName = $("#search").val();
  param.page = currentPage;
  param.pageSize = pageSize;
  //是否排序处理
  var current = $(".lt-sort a.current");
  //是否能获取得到有current类的a
  if (current > 0) {
    //根据current的data属性决定传入哪一个排序参数
    var type = current.data("type");
    param[type] = current.find("i").hasClass("fa-angle-down") ? 2 : 1;
  }


  //利用定时器模拟网络延迟
  setTimeout(function() {
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: param,
      dataType: "json",
      success: function (info) {
        console.log(info);
        //调用回调函数
        callback && callback(info);
      }
    });
  },500);
}

//点击搜索按钮,根据input框的值重新搜索
function search() {

  //为搜索按钮注册事件
  $("#searchBtn").click(function () {
    //获取到input框的值
    var item = $("#search").val()
    //如果搜索框的值为空,提示输入搜索内容
    if (item.trim() === "") {
      mui.toast("请输入关键字");
      return;
    }
    //直接调用一次下拉刷新方法完成搜索功能
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    //获取localStorage中的搜索历史

    //添加搜索历史
    var history = localStorage.getItem("search_list");
    //转为数组
    var arr = JSON.parse(history);
    //判断关键字是否重复
    var index = arr.indexOf(item);
    if (index != -1) { //index != -1 说明有重复的
      //删除重复的项
      arr.splice(index, 1);
    }
    //限制长度为10
    if (arr.length >= 10) {
      //删除最后一项
      arr.pop();
    }
    //往数组中添加数据
    arr.unshift(item);
    //转为json字符串存回localStorage
    localStorage.setItem("search_list", JSON.stringify(arr));
  });
}

//排序功能
function sort() {
  //为有type属性的a按钮注册点击事件,mui的下拉刷新框架,禁用了a的点击事件,需要使用tap事件
  $(".lt-sort a[data-type]").on("tap",function () {
    //判断是否有current类
    if ($(this).hasClass("current")) {
      //有current类
      //切换箭头的类名
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      //没有current类排他添加
      $(this).addClass("current").siblings().removeClass("current");
    }

    /**
     *重新渲染列表
     排序判断在渲染函数中已经完成
     调用一次下拉刷新即可
     需要使用tap事件
     */
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();    
  });
}

//下拉刷新和上拉加载功能
function pullRefresh() {
  //调用mui的init方法,初始化刷新插件
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //配置下拉刷新
      down: {
        style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
        auto: true, //可选,默认false.首次加载自动上拉刷新一次
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          //操作currentPage刷新第一页数据
          currentPage = 1;
          //调用rander渲染数据
          rander(function( info ) {
            //根据数据动态渲染列表
            var htmlStr = template("productTpl", info);
            $(".lt-product").html(htmlStr);
            //渲染成功手动关闭刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            //手动启动上拉加载功能,(有可能被禁用)
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      //配置上拉加载
       up: {
         callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          //操作currentPage切换下一页
          currentPage++;
          rander(function(info) {
            var htmlStr = template("productTpl", info);
            $(".lt-product").append(htmlStr);
            //如果到了最后一页没有更多数据, 禁用上拉加载,以防发出无用请求
            //渲染完毕手动结束上拉加载效果,
            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(info.data.length === 0);
          }); 
          } 
      }
    }
  });
}
/*-------------------------------------------------------------------------------------------------------------
                                      方法调用
  ----------------------------------------------------------------------------------------------------------- */

//一进入页面获取传递过来的参数key的值,赋值到input框
setInput();

//下拉刷新功能,包括了一进入页面渲染数据
pullRefresh();

//搜索按钮的搜索功能
search();

//排序功能
sort();

});