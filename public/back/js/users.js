
//--------------------------表格渲染函数封装
/**
 * 此函数用于通过ajax请求动态渲染表格
 * 参数: page 当前页, size 条数
 */
var currentPage = 1; //当前页变量
var size = 5; //每页条数变量
function rander(page, size) {
  $.ajax({
    type: "get",
    url: "/user/queryUser",
    data: {
      page: page,
      pageSize: size
    },
    dataType: "json",
    success: function(info) {
      console.log(info);
      var htmlStr = template("tpl",info);
      $(".users-table tbody").html(htmlStr);
    }
  });
}

//一进入发送请求页面渲染数据
rander(currentPage, size);