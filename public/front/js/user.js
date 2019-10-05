$(function() {
  //发送请求进行动态渲染
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function (info) {
      console.log(info);
      //如果未登录,跳转到登录页
      if(info.error === 400) {
        location.href = "login.html";
        return;
      }
      //如果已登录
      var htmlStr = template("tpl", info);
      $("#userinfo").html(htmlStr);
    }
  });

  //退出登录功能
  $("#logoutBtn").on("click",function() {
    $.ajax({
      type: "get",
      url: "/user/logout",
      dataType: "json",
      success: function(info) {
        console.log(info);
        //退出成功,跳转登录页
        if(info.success) {
          location.href = "login.html";
        }
      }
    });
  });
});