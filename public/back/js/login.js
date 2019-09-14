;(function() {

  //------------表单基本校验
  $("#loginForm").bootstrapValidator({
    //配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', //校验成功
      invalid: 'glyphicon glyphicon-remove', //校验失败
      validating: 'glyphicon glyphicon-refresh' //校验中
    },  
    //校验的字段
    fields: {
      //校验用户名
      username: {
        validators: {
          //非空校验
          notEmpty: {
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户长度为2-6位"
          },
          //配置正则
          regexp: {
            //正则规则
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: "用户名由数字字母下划线和.组成"
          },
          //配置回调信息
          callback: {
            message: "用户名不存在"
          }
        }
      },
      //密码校验
      password: {
        validators: {
          //非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度为6-12位"
          },
          //配置正则
          regexp: {
            //正则规则
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: "密码由数字字母下划线和.组成"
          },
          //配置回调信息
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });

  //-----------表单校验成功
  /**
   * 表单校验成功事件是validator插件自带的事件
   * 在表单校验成功时触发
   * 需要利用事件对象阻止submit按钮默认的提交事件
   * 使用ajax发送请求
   * */
  $("#loginForm").on("success.form.bv", function(e) {
    //阻止默认的提交事件
    e.preventDefault();
    //发送ajax请求校验表单
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#loginForm").serialize(),
      dataType: "json",
      success: function(info) {
        if(info.success) {
          //登录成功跳转到首页
          location.href = "index.html";
        }
        if(info.error === 1000) { //用户名错误
          //显示错误信息
          $("#loginForm").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
        if(info.error === 1001) { //密码错误
          //显示错误信息
          $("#loginForm").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    });
  })


  //-----------重置表单校验状态
  /**
   * 因为reset按钮只能重置表单的内容, 不能重置样式
   * 需要利用插件的方法来重置表单的样式
   * $("#loginForm").data("bootstarpValidator"); 可以获取实例对象, 上面有很多操作插件的方法
   * */
  //为reset按钮注册点击事件
  $("#loginForm button[type='reset']").on("click", function () {
    $("#loginForm").data("bootstrapValidator").resetForm() //重置表单样式;
  });
})();