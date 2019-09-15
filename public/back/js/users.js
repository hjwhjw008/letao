
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
      //模板动态渲染
      var htmlStr = template("tpl",info);
      $(".users-table tbody").html(htmlStr);
      //分页模块渲染
      $(".pagenator").bootstrapPaginator({
        bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
        currentPage: currentPage, //当前页
        totalPages: Math.ceil(info.total / info.size), //总页数 
        size: "samll", //设置控件的大小，mini, small, normal,large
        onPageClicked: function (event, originalEvent, type, page) {
          //为按钮绑定点击事件 page:当前点击的按钮值
          //点击按钮重新渲染数据
          rander(page, size);
        }
      });
    }
  });
}

//一进入发送请求页面渲染数据
rander(currentPage, size);