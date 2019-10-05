$(function() {
  //登录功能
  $("#loginBtn").on("click",function() {
    //获取表单数据
    var username = $("#username").val();
    var password = $("#password").val();
    //验证表单
    if(!username || !password) {
      mui.toast("用户名和密码不能为空");
    }
    //发送请求,进行登录
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        //用户名或密码错误
        if (info.error === 403) {
          mui.toast("用户名或密码错误");
        }
        //登录成功
        if(info.success) {
          //判断地址栏有无retUrl参数
          if(location.href.indexOf("retUrl") > -1) {
            //地址栏有参数,说明需要跳转回进入的页面
            //获取到retUrl的值,无法使用getSearch方法
            var retUrl = location.search.replace("?retUrl=", "");
            //跳转回原页面
            location.href = retUrl;
          } else {
            //地址栏没有,直接跳转用户中心页
            location.href = "user.html";
          }
        }
      }
    });
  });
});