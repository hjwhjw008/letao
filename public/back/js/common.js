/*-------------------------------------------------------------------------------
                          公用js
-----------------------------------------------------------------------------*/

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
});


//---------------分类导航弹出与隐藏功能
$(".aside-nav .nav-cate").on("click", function() {
  $(".aside-inner-nav").stop().slideToggle();
});