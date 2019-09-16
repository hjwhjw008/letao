/*-------------------------------------------------------------------------------
                          公用js
-----------------------------------------------------------------------------*/
var flag = true; //控制setTableBox值调用一次的阀门
//--------------进度条功能
/**
 * 利用jquery的全局ajax事件
 * 在发送页面的第一个请求时开启进度条
 * 页面的所有请求完成后结束进度条
 * 进度条使用Nprogress插件
 * $(document).ajaxStart事件在页面中发送第一个ajax请求时触发
 * $(document).ajaxStop事件在页面所有ajax请求完毕时触发
 */
//注册事件
$(document).ajaxStart(function() {
  //开启进度条
  NProgress.start();
});
$(document).ajaxStop(function() {
  //结束进度条
  NProgress.done();
  //在ajax请求完成后设置tableBox的高
  if(flag) {
    setTableBox();
  }
});

//-------------------登录拦截功能
//判断是否是登录页面, 登录页面不需要拦截 
if(location.href.indexOf("login") === -1) { //不是登录页
  //进入页面立即发送请求验证是否登录
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function(info) {
      if(info.success) {
        //登录成功, 什么都不用做
      }
      if(info.error === 400) {
        //没有登录, 拦截到登录页面
        location.href = "login.html";
      }
    }
  });

}

//---------------动态设置tableBox的高, 撑开分页按钮

function setTableBox() {
  flag = false;
  var tableHeight = $("#tableBox .my-table").height();
  $("#tableBox").height(tableHeight);
}


  //调用函数设置tableBox的高
$(function() {
  //---------------分类导航弹出与隐藏功能
  $(".aside-nav .nav-cate").on("click", function () {
    $(".aside-inner-nav").stop().slideToggle();
  });

  //---------------退出功能
  //点击模态框退出按钮发送ajax进行退出
  $("#logoutModal .btn-logout").on("click", function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        //判断退出是否成功
        if (info.success) {
          //退出成功, 跳转登录页
          location.href = "login.html";
        }
      }
    });
  });
  
  //--------------隐藏显示侧边栏
  /**
   * 点击菜单按钮, 切换类名通过过渡动画隐藏显示侧边栏
   * 在css中定义好两个状态
   */
  //注册点击事件
  $(".topbar .topbar-menu").on("click",function() {
    //切换侧边栏类名
    $(".lt-aside").toggleClass("hide-menu");
    //切换topbar类名
    $(".topbar").toggleClass("hide-menu");
    //切换main模块类名
    $(".lt-main").toggleClass("hide-menu");
  });


});