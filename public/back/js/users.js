
//--------------------------功能函数封装封装
/** 表格渲染函数
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
          //更新currentPage的值
          currentPage = page;
          //点击按钮重新渲染数据
          rander(page, size);
          
        }
      });
    }
  });
}

/**
 * 用户状态切换函数
 * 此函数用于切换用户状态
 * 给所有的启用禁用按钮注册事件
 * 
 */
function isDelete() {
  var id; //全局变量用于传递id数据
  var isDelete; //全局变量用于传递状态数据
  //使用事件委托为按钮注册事件
  $("table").on("click", "tbody .btn", function() {
    //显示模态框
    $("#isDeleteModal").modal("show");
    //获取id数据
    id = $(this).parent().data("id");
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });

  //为模态框的确认按钮注册事件
  $("#isDeleteModal .btn-sure").on("click", function () {
    //发送请求修改数据
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: id,
        isDelete: isDelete
      },
      dataType: "json",
      success: function(info) {
        if(info.success) { //修改成功
          //隐藏模态框
          $("#isDeleteModal").modal("hide");
          //重新渲染数据
          rander(currentPage, size);
        }
      }
    });
  });

}

/*---------------------------------------------------------------------------------------------------------------
                                    功能函数调用
-----------------------------------------------------------------------------------------------------------*/
//一进入发送请求页面渲染数据
rander(currentPage, size);

//启用禁用用户状态功能
isDelete();