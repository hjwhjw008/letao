$(function() {
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数封装
-----------------------------------------------------------------------------------------------------------*/

//渲染函数封装
function rander() {
  //添加定时器,模拟网络延迟
  setTimeout(function() {
    $.ajax({
      type: "get",
      url: "/cart/queryCart",
      dataType: "json",
      success: function (info) {
        //如果用户未登录,拦截到登录页
        if(info.error === 400) {
          location.href = "login.html";
          return;
        }
        //已登录渲染数据
        //info是一个数组,需要包装成对象,才能在template模板中使用
        var htmlStr = template("cartTpl", {
          arr: info
        });
        $(".lt-main .mui-table-view").html(htmlStr);
        //渲染完毕关闭下拉刷新
        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
      }
    });
  }, 500);
}

//下拉刷新功能封装
function pullDownRefresh() {
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        auto: true,
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据;
          //刷新完成,调用渲染函数
          rander();
        }
      }
    }
  });

}

//删除功能封装
function del() {
  //因为使用了mui的下拉刷新,所以不能使用点击事件,需要用tap事件
  $(".lt-main").on("tap", ".del-btn", function() {
    //获取id
    var id = $(this).data("id");
    //发送请求删除数据
    $.ajax({
      type: "get",
      url: "/cart/deleteCart",
      data: {
        id: [id] //要求传数组
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        if(info.success) {
          //删除成功,调用一次下拉刷新重新渲染数据
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        }
      }
    });
  });
}
//编辑功能
function edit() {
  $(".lt-main").on("tap", ".edit-btn", function() {
    //获取存储在标签中的自定义数据
    var obj = this.dataset;
    var htmlStr = template("editTpl",obj);
    //因为mui会识别换行符\n所以需要,利用字符串方法,取消换行符
    htmlStr = htmlStr.replace(/\n/g, "");
    //mui消息模板中,可以穿html字符串
    mui.confirm(htmlStr,"编辑商品",["确认","取消"],function (e) {
      //点击确认按钮,发送请求修改数据
      if(e.index === 0) {
      //获取参数
      var id = obj.id;
      var size = $(".size span.current").text();
      var num = $(".mui-numbox-input").val();
      $.ajax({
        type: "post",
        url: "/cart/updateCart",
        data: {
          id: id,
          size: size,
          num: num
        },
        dataType: "json",
        success: function(info) {
          if(info.success) {
            //修改成功,调用下拉刷新重新渲染页面
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
          }
        }
      });
      }
    });
    //初始化数字框
    mui(".mui-numbox").numbox();
  });
}

//模态框旋转尺码功能
function modalCheckSize() {
  //模态框是动态创建的,父元素是body
  $("body").on("click", ".size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });
}
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数使用
-----------------------------------------------------------------------------------------------------------*/
//进入页面渲染数据
rander();

//下拉刷新功能
pullDownRefresh();

//删除功能
del();

//编辑功能
edit();

//模态框旋转尺码功能
modalCheckSize();


});