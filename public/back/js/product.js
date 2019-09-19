$(function() {
/*---------------------------------------------------------------------------------------------------------------
                                    功能函数封装
-----------------------------------------------------------------------------------------------------------*/
var currentPage = 1; //用来控制当前页的全局变量
var pageSize = 2; //用来控制每页条数的全局变量

//--------商品数据渲染和分页功能函数
function rander(page,size) {
  //发送请求获取数据
  $.ajax({
    type: "get",
    url: "/product/queryProductDetailList",
    data: {
      page: page,
      pageSize: size
    },
    dataType: "json",
    success: function(info) {
      //通过模板动态渲染数据
      var htmlStr = template("tpl", info);
      $(".my-table tbody").html(htmlStr);
      //渲染分页按钮
      $(".pagenator").bootstrapPaginator({
        //配置bootstrap版本
        bootstrapMajorVersion: 3,
        //当前页
        currentPage: page,
        //总页数
        totalPages: Math.ceil(info.total / info.size),
        size: "samll" ,
        //配置按钮上的文字
        itemTexts: function(type, page, current) {
          switch(type) {
            case "page": 
              return page;
            case "prev": 
              return "上一页";
            case "next":
              return "下一页";
            case "first":
              return "首页";
            case "last":
              return "尾页"
          }
        },
        //配置鼠标悬停时提示框的文字
        tooltipTitles: function(type, page, current) {
          switch (type) {
            case "page":
              return "前往第" + page + "页";
            case "prev":
              return "上一页";
            case "next":
              return "下一页";
            case "first":
              return "首页";
            case "last":
              return "尾页"
          }
        },
        //提示框是否使用bootstrap的样式
        useBootstrapTooltip: true,
        //配置按钮事件
        onPageClicked: function(a,b,c, page) {
          //更新cuurentPage
          currentPage = page;
          //重新渲染数据
          rander(currentPage, pageSize);
        }
      });
    }
  });
}

//-----------添加商品函数
function addProduct() {
   //用于存储上传图片数据的数组
  var picArr = [];
  //点击按钮显示模态框
  $("#addBtn").on("click", function() {
    $("#addModal").modal("show");
    //发送请求获取数据渲染下拉框
    //通过分页接口,模拟全部接口
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        //利用模板渲染下拉框
        var htmlStr = template("dropdownTpl",info)
        $("#addModal .dropdown-menu").html(htmlStr);
      }
    });
  });
  //为下拉框按钮注册事件委托,完成下拉表单功能 
  $("#addModal .dropdown-menu").on("click", "a", function() {
    //获取文本
    var text = $(this).text();
    //将文本设置给按钮
    $("#chkText").text(text);
    //将对应的id给input框
    var id = $(this).data("id");
    $("#brandId").val(id);
    $("#productForm").data("bootstrapValidator").updateStatus("brandId", "VALID");
  });

  //利用插件上传片图片实现图片预览
  $("#fileImgs").fileupload({
    //指定返回的数据类型
    dataType: "json",
    done: function(e,data) {
      //data.result获取到响应内容
      //将图片数据追加到数组最前面
      picArr.unshift(data.result);
      //动态创建img标签               
      $("#imgBox").prepend('<img src="' + data.result.picAddr + '" width="100">');
      //判断picArr的长度是否大于3
      if(picArr.length > 3) {
        //大于3删除最后一个元素
        picArr.pop();
        //删除最后一个img
        //通过.eq(-1)可以得到最后一个元素 也可以用css3选择器
        $("#imgBox img").eq(-1).remove();
      }
      //如果图片数等于3张,手动修改校验状态
      if(picArr.length === 3) {
        $("#productForm").data('bootstrapValidator').updateStatus("picStatus", "VALID");
      }
    }
  });

  //利用插件进行表单校验
  $("#productForm").bootstrapValidator({
    //配置不用校验的表单类型,(默认隐藏域不会校验, 需要校验隐藏域)
    excluded: [],
    //配置校验小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置校验字段
    fields: {
      //校验二级分类id
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      //商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      //商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      //商品库存
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: "商品库存格式, 必须是非零开头的数字"
          }
        }
      },
      //商品尺码
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "尺码格式, 必须是 32-40"
          }
        }
      },
      //商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      //商品现价
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      //图片校验
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    },

  });
  //利用插件封装好的校验成功事件提交表单
  $("#productForm").on("success.form.bv", function (e) {
    //阻止默认的提交事件
    e.preventDefault();
    //收集表单数据
    var paramStr = $("#productForm").serialize();
    //手动拼接图片数据
    paramStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    //通过ajax提交表单
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramStr,
      dataType: "json",
      success: function(info) {
        if(info.success) {
          //------新增成功
          //关闭模态框
          $("#addModal").modal("hide");
          //重新渲染第一页数据
          currentPage = 1;
          rander(currentPage, pageSize);
          //重置表单和校验样式
          $("#productForm").data("bootstrapValidator").resetForm(true);
          //因为下拉框和图片不是表单元素,所以需要手动重置
          $("#chkText").text("请选择二级分类");
          $("#imgBox").empty();
        }
      }
    });

  });
}


/*---------------------------------------------------------------------------------------------------------------
                                    功能函数调用
-----------------------------------------------------------------------------------------------------------*/
  //--------------数据渲染和分页功能
  rander(currentPage,pageSize);

  addProduct();


});