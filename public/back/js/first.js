$(function() {
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数封装
-----------------------------------------------------------------------------------------------------------*/
  var currentPage = 1; //全局变量, 用于传递当前页
  var size = 5; //全局变量 , 用于传递每页的条数

  /**
   * 渲染函数封装
   * 此函数用于渲染一级分类数据以及分页功能
   * 参数 page: 当前页;  size: 每页条数;
   */
  function rander(page,size) {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: size
      },
      dataType: "json",
      success: function(info) {
        //动态渲染一级分类数据
        var htmlStr = template("tpl", info);
        $(".my-table tbody").html(htmlStr);
        //分页功能
        $(".pagenator").bootstrapPaginator({
          //配置bootstarp版本
          bootstrapMajorVersion: 3,
          //配置当前页
          currentPage: currentPage,
          //配置最大页
          totalPages: Math.ceil(info.total / info.size),
          //配置控件大小
          size: "small",
          //按钮被点击事件
          onPageClicked: function (a,b,c, page) {
            //被点击时更新当前页码重新渲染数据
            currentPage = page;
            rander(currentPage,size)
          }
        });
      }
    });
  }


  /**
   * 此函数用于实现添加分类功能
   * 首先为添加分类按钮注册点击事件, 显示模态框
   * 为模态框添加表单非空验证,
   * 为模态框的添加按钮注册事件发送ajax请求
   */
  function addCate() {
    //点击添加分类按钮显示模态框
    $("#addBtn").on("click", function() {
      $("#addModal").modal("show");
    });
    //为模态框表单添加非空校验
    $("#cateForm").bootstrapValidator({
      //校验小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok', //成功
        invalid: 'glyphicon glyphicon-remove', //失败
        validating: 'glyphicon glyphicon-refresh' //校验中
      },
      //指定校验字段
      fields: {
        //分类名校验
        categoryName: {
          //配置校验规则
          validators: {
            //非空校验
            notEmpty: {
              message: "请输入一级分类名称"
            }
          }
        }
      }
    });

    //当表单校验成功时触发的回调函数(插件的一个事件)
    $("#cateForm").on("success.form.bv", function(e) {
      //阻止submit按钮默认的提交事件
      e.preventDefault();
      //使用ajax提交表单
      $.ajax({
        type: "post",
        url: "/category/addTopCategory",
        data: $("#cateForm").serialize(),
        dataType: "json",
        success: function(info) {
          if (info.success) { //添加成功
            //关闭模态框
            $("#addModal").modal("hide");
            //重新渲染第一页
            rander(1,size);
            //重置表单
            $("#cateForm").data("bootstrapValidator").resetForm(true);
          }
        }
      });
    });
  }
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数调用
-----------------------------------------------------------------------------------------------------------*/
//---------进入页面渲染数据
rander(currentPage, size);

//--------添加分类功能
addCate();



});


