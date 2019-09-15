$(function() {

  //绘制柱状图
  echarts1();

  //绘制饼图
  echarts2();
  
  //---------------------图表绘制函数封装
  function echarts1() {
     // 基于准备好的dom，初始化echarts实例
     var echarts1 = echarts.init(document.querySelector(".main-content .echarts-1"));

     // 指定图表的配置项和数据
     var option1 = {
       //大标题
       title: {
         text: '2019年注册人数'
       },
       //提示框
       tooltip: {},
       //图例
       legend: {
         data: ['人数']
       },
       //x轴坐标值
       xAxis: {
         data: ["一月", "二月", "三月", "四月", "五月", "六月"]
       },
       //y轴坐标值 一般为空,根据数据动态生成
       yAxis: {},
       //图标系列 (类型,参数等)
       series: [{
         name: '人数',
         type: 'bar',
         data: [500, 2000, 3600, 1000, 1000, 2500]
       }]
     };

     // 使用刚指定的配置项和数据显示图表。
     echarts1.setOption(option1);
  }
  function echarts2() {
    // 基于准备好的dom，初始化echarts实例
    var echarts2 = echarts.init(document.querySelector(".main-content .echarts-2"));
    //指定图标配置项和数据
    var option2 = {
      //标题设置
      title: {
        text: '热门品牌销售',
        subtext: '2019年6月',
        x: 'center'
      },
      //鼠标悬停提示框设置
      tooltip: {
        trigger: 'item',//鼠标悬停到元素上显示提示框
        formatter: "{a} <br/>{b} : {c} ({d}%)"//提示框格式
      },
      //图例
      legend: {
        orient: 'vertical', //垂直排列
        left: 'left', 
        data: ['耐克', '阿迪', '新百伦', '李宁', '阿迪王']//数据
      },
      series: [{
        name: '品牌', 
        type: 'pie', //类型
        radius: '50%', //圆的直径
        center: ['50%', '60%'], //圆的位置
        data: [{
            value: 335,
            name: '耐克'
          },
          {
            value: 310,
            name: '阿迪'
          },
          {
            value: 234,
            name: '新百伦'
          },
          {
            value: 135,
            name: '李宁'
          },
          {
            value: 1548,
            name: '阿迪王'
          }
        ],
        itemStyle: {
        //鼠标悬停阴影效果设置
          emphasis: {
            shadowBlur: 10, //阴影大小
            shadowOffsetX: 0, //阴影偏移
            shadowColor: 'rgba(0, 0, 0, 0.5)' //阴影颜色
          }
        }
      }]
    };


    // 使用刚指定的配置项和数据显示图表。
    echarts2.setOption(option2);
  }
});