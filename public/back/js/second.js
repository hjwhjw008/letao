$(function() {
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数封装
-----------------------------------------------------------------------------------------------------------*/
var currentPage = 1; //全局变量用于控制当前页
var pageSize = 5; // 全局变量用于控制每页的条数
/**
 * 此函数用于渲染二级分类表格数据以及分页按钮
 * 参数: page: 当前页数, size: 每页条数
 * 依赖插件: bootstrap-validator、artTemplate
 */
  function rander(page,size) {
    //发送请求获取数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: size
      },
      dataType: "json",
      success: function(info) {
        //动态渲染
        var htmlStr = template("tbodyTpl", info);
        $(".my-table tbody").html(htmlStr);
        //分页功能
        $(".pagenator").bootstrapPaginator({
          //配置bootstrap版本
          bootstrapMajorVersion: 3,
          //配置当前页
          currentPage: page,
          //配置最大页数
          totalPages: Math.ceil(info.total / info.size),
          //配置控制大小
          size: "small",
          //点击控件按钮的回调函数(可以理解为事件)
          onPageClicked: function (a, b , c , page) {
            //page表示当前按钮的页码
            //更新currentPage
            currentPage = page;
            //重新渲染数据
            rander(currentPage, size);
          }
        });
      }
    });
  }

/**
 * 此函数用于添加二级分类
 * 依赖插件: bootstarp - validator;jquery - fileupload;artTemplate
 */
  function addSecondCate() {
    //点击添加按钮显示模态框
    $("#addBtn").on("click", function() {
      $("#addModal").modal("show");
      //发送请求获取一级分类数据 动态渲染下拉菜单
      //ps:一般工作中有专门的借口获取所有数据(无分页的),这里只能使用一级分类查询接口模拟 
      $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        data: { //模拟成不分页获取全部数据的接口
          page: 1,
          pageSize: 100 
        },
        dataType: "json",
        success: function(info) {
          //动态渲染下拉表单
          var htmlStr = template("dropdownTpl", info);
          $("#addModal .dropdown-menu").html(htmlStr);
        }
      });
    });
    //使用事件委托为下拉菜单注册点击事件,完成选中功能
    $("#addModal .dropdown-menu").on("click", "a", function() {
      var text = $(this).text();
      $("#chkText").text(text);
    });
    //初始化文件上传插件,实现图片预览
    $("#fileImg").fileupload({
      //指定返回数据类型
      dataType: "json",
      //上传完成后触发的回调函数(完成事件)
      done: function(e,data) {
        //通过data.result.picAddr获取到图片地址, 
        var imgUrl = data.result.picAddr;
        $("#previewImg").attr("src", imgUrl);
      }
    });
  }

/*---------------------------------------------------------------------------------------------------------------
                                    功能函数调用
-----------------------------------------------------------------------------------------------------------*/

  //二级分类表格渲染与分页功能
  rander(currentPage, pageSize);

  //添加二级分类功能
  addSecondCate();
});

