;(function() {
  $("#loginForm").bootstrapValidator({

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
            min: 6,
            max: 12,
            message: "用户长度为6-12位"
          },
          //配置正则
          regexp: {
            //正则规则
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: "用户名由数字字母下划线和.组成"
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
          }
        }
      }
    }
  });
})();