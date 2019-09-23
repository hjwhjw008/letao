/*-------------------------------------------------------------------------------------------------------------
                                      方法封装
  ----------------------------------------------------------------------------------------------------------- */
  //添加假数据(只执行一次,然后注释掉)
  // var arr = ["耐克","阿迪","阿迪王","匡威","耐克王","新百伦"];
  // var jsonStr = JSON.stringify(arr);
  // localStorage.setItem("search_list",jsonStr);

  //获取本地历史记录数组的方法
  function getHistory() {
    var jsonStr = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(jsonStr);
    return arr;
  }

  //根据本地历史记录数组来动态渲染历史记录 
  function rander() {
    //获取历史记录数组
    var arr = getHistory();
    //生成htmlStr
    var htmlStr = template("historyTpl",{arr: arr});
    $(".lt-history").html(htmlStr);
  }

  //清空历史记录
  function clearHistory() {
    //点击清空按钮事件
    $(".lt-history").on("click", "#clearBtn", function () {
      //生成模态框
      mui.confirm("你确定要清空历史记录吗?","温馨提示",["取消","确认"],function(e) {
        //点击按钮关闭模态框触发的回调函数
        //根据e.index获取索引判断点击的是哪一个按钮
        if(e.index === 1) {
          //点击确认按钮,删除localStorage里面的search_list
          localStorage.removeItem("search_list");
          //重新渲染数据
          rander();
        }
      });
    });
  }

  //删除单条历史记录
  function removeHistory() {
    //为删除按钮注册点击事件(事件委托)
    $(".lt-history").on("click", ".btn-del", function () {
      var that = this;
      //弹出模态框
      mui.confirm("您确定要删除该条记录吗?", "温馨提示", ["取消", "确认"] , function(e) {
        if(e.index === 1) {
          //点击确认按钮
          //获取索引
          var index = $(that).data("index");
          //获取历史记录数组
          var arr = getHistory();
          //移除对应历史记录
          arr.splice(index,1);
          //将数组存回localStorage中
          localStorage.setItem("search_list", JSON.stringify(arr));
          //重新渲染数据
          rander();
        }
      });
    });
  }

  //添加历史记录功能
  function addHistory() {
    //为搜索按钮注册点击事件
    $("#searchBtn").on("click",function() {
      //获取搜索框的值
      var text = $("#search").val().trim();
      //非空校验
      if(text === "") {
        alert("关键字不能为空");
        return;
      }
      //获取历史记录数组
      var arr = getHistory();
      /**
       * 需求:
       * 1.不能有重复的历史记录
       * 2.历史记录不能超过10条
       */
      //去重
      var index = arr.indexOf(text);
      if(index !== -1) {
        //不等于-1说明有重复的且索引值就是index
        //删除重复项
        arr.splice(index,1);
      }
      //限制为10条
      if(arr.length >= 10) {
        //大于10条删除最后一项
        arr.pop();
      }
      //将数据添加到数组最前面
      arr.unshift(text);
      //将数组存回localStorage
      localStorage.setItem("search_list",JSON.stringify(arr));
      //重新渲染数据
      rander();
      //清空搜索框
      $("#search").val("");
    });
  }
/*-------------------------------------------------------------------------------------------------------------
                                      方法调用
  ----------------------------------------------------------------------------------------------------------- */

  //动态渲染历史记录列表
  rander();

  //清空功能
  clearHistory();

  //单条删除
  removeHistory();

  //添加历史记录功能
  addHistory();