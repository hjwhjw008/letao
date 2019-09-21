$(function() {
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数封装
-----------------------------------------------------------------------------------------------------------*/
//----左侧一级分类动态渲染函数
function randerFirst() {
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function(info) {
      var htmlStr = template("leftTpl",info);
      $(".lt-main-left ul").html(htmlStr);
      //渲染第一个tab的二级分类
      randerSecond(info.rows[0].id);
    }
  });
}
//二级分类渲染函数, 参数:一级分类id
function randerSecond(id) {
  $.ajax({
    type: "get",
    url: "/category/querySecondCategory",
    data: {
      id: id
    },
    dataType: "json",
    success: function(info) {
      var htmlStr = template("rightTpl", info);
      $(".lt-main-right ul").html(htmlStr);
    }
    
  });
}

//tab栏切换渲染二级分类函数
function tab() {
  $(".lt-main-left ul").on("click", "a", function() {
    //切换类名
    $(this).parent().addClass("current").siblings().removeClass("current");
    //获取id
    var id = $(this).data("id");
    //根据id动态渲染二级分类
    randerSecond(id);
  });
}
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数调用
-----------------------------------------------------------------------------------------------------------*/
//一级分类动态渲染
randerFirst();

//tab栏切换
tab();
});