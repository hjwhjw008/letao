$(function() {
/*-------------------------------------------------------------------------------------------------------------
                                      方法封装
  ----------------------------------------------------------------------------------------------------------- */
  //跟地址栏获取id渲染数据的方法
  function rander() {
    //调用封装的getSearch方法获取id
    var id = getSearch("productId");
    //发送ajax请求
    $.ajax({
      type: "get",
      url: "/product/queryProductDetail",
      data: {
        id: id
      },
      dataType: "json",
      success: function(info) {
        var htmlStr = template("tpl", info);
        $(".lt-main .mui-scroll").html(htmlStr);
        //因为轮播图时动态生成的,所以需要手动初始化
        var gallery = mui('.mui-slider');
        gallery.slider({
          interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
        //因为数量框也是动态生成的所以需要手动初始化
        mui(".mui-numbox").numbox();
      }
    });
  }

  
/*-------------------------------------------------------------------------------------------------------------
                                      方法调用
  ----------------------------------------------------------------------------------------------------------- */
  //进入页面渲染数据
  rander();

  //尺码选择功能
  $(".lt-main").on("click", ".size span",function() {
    $(this).addClass("current").siblings().removeClass("current");
  });
  //前往购物车

  //添加到购物车
  $("#addCart").on("click",function() {
    //收集参数
    var productId = getSearch("productId");
    var num = $(".mui-numbox-input").val()
    var size = $(".size span.current").text();
    //验证参数
    if(!size) {
      mui.toast("请选择尺码");
      return;
    }
    //发送请求添加购物车
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        //如果未登录
        if(info.error === 400) {
          //跳转到登录页并将当前页地址作为参数传递过去
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    });
  });
});