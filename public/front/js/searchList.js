/*-------------------------------------------------------------------------------------------------------------
                                      方法封装
  ----------------------------------------------------------------------------------------------------------- */
  //获取传递过来的参数key的值,赋值到input框
  function setInput() {
    var key = getSearch("key");
    $("#search").val(key);
  }
  //公用方法获取地址栏参数的方法
  //k: 要获取的参数键名
  function getSearch(k) {
    //获取地址栏参数
    var search = location.search;
    //将编码转为中文
    search = decodeURI(search);
    //去掉问号
    search = search.slice(1);
    //去掉&
    var arr = search.split("&");
    //对象存储键值对
    var obj = {};
    //遍历数组,去掉=, 存储为键值对
    arr.forEach(function (v, i) {
      var key = v.split("=")[0];
      var value = v.split("=")[1];
      obj[key] = value;
    });
    return obj[k];
  }

  /**
   * 根据input框的值动态渲染商品列表的方法
   */
  function rander() {
    //处理参数
    var param = {};
    param.proName = $("#search").val();
    param.page = 1;
    param.pageSize = 100;
    //是否排序处理
    var current = $(".lt-sort a.current");
    //是否能获取得到有current类的a
    if( current > 0) {
      //根据current的data属性决定传入哪一个排序参数
      var type = current.data("type");
      param[type] = current.find("i").hasClass("fa-angle-down") ? 2 : 1;
    }


    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: param,
      dataType: "json",
      success: function(info) {
        console.log(info);
        //根据数据动态渲染列表
        var htmlStr = template("productTpl", info);
        $(".lt-product").html(htmlStr);
      }
    });
  }

  //点击搜索按钮,根据input框的值重新搜索
  function search() {

    //为搜索按钮注册事件
    $("#searchBtn").click(function() {
      //获取到input框的值
      var item = $("#search").val()
      //如果搜索框的值为空,提示输入搜索内容
      if(item.trim() === "") {
        mui.toast("请输入关键字");
        return;
      }
      //直接调用rander方法完成搜索功能
        rander();
      //获取localStorage中的搜索历史

      //添加搜索历史
      var history = localStorage.getItem("search_list");
      //转为数组
      var arr = JSON.parse(history);
      //判断关键字是否重复
      var index = arr.indexOf(item);
      if(index != -1) { //index != -1 说明有重复的
        //删除重复的项
        arr.splice(index,1);
      }
      //限制长度为10
      if(arr.length >= 10) {
        //删除最后一项
        arr.pop();
      }
      //往数组中添加数据
      arr.unshift(item);
      //转为json字符串存回localStorage
      localStorage.setItem("search_list",JSON.stringify(arr));
    });
  }

  //排序功能
  function sort() {
    //为有type属性的a按钮注册点击事件
    $(".lt-sort a[data-type]").click(function() {
      //判断是否有current类
      if($(this).hasClass("current")) {
        //有current类
        //切换箭头的类名
        $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
      } else {
        //没有current类排他添加
        $(this).addClass("current").siblings().removeClass("current");
      }

      /**
       *重新渲染列表
       排序判断在渲染函数中已经完成
       */
      rander();
    });
  }
/*-------------------------------------------------------------------------------------------------------------
                                      方法调用
  ----------------------------------------------------------------------------------------------------------- */

  //一进入页面获取传递过来的参数key的值,赋值到input框
  setInput();

  //一进入页面,根据搜索数据,动态渲染列表
  rander();

  //搜索按钮的搜索功能
  search();

  //排序功能
  sort();