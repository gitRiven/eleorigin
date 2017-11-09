/**
 * Created by HUCC on 2017/11/8.
 */

if(location.href.indexOf("login.html") == -1){
  $.ajax({
    type:"get",
    url:"/employee/checkRootLogin",
    success:function (data) {
      if(data.error === 400){
        location.href = "login.html";
      }
    }
  });

}



//http无状态的


$(".align_justify").on("click",function(){
  console.log(11111)
  $("#right_content").toggleClass("active");
  $("#lis-left").toggleClass("active");

})

//退出功能
$(".log_out").on("click", function () {
  $("#logoutModal").modal("show");


  //on注册事件不会覆盖
  //off()解绑所有的事件
  //off("click") 只解绑click事件
  //off("click", "**"); 解绑委托事件
  $(".btn_confirm").off().on("click", function () {

    //给服务器发送ajax请求，让服务器清除session
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      success:function (data) {

        if(data.success){
          location.href = "login.html";
        }
      }
    });

  });
});

$(".child").prev().on("click", function () {
  $(this).next().slideToggle();
});





