$(function () {

    var currentPage = 1;
    var pageSize = 5;


    function render() {

        $.ajax({
            url: "/user/queryUser",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                var html = template("tpinner", data)
                $("tbody").html(html);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    size: "small",
                    onPageClicked: function (a, b, c, page) {
                      currentPage = page;
                      render();
                    }
                  });
            }
        })
    }

    render()
    $("tbody").on("click",".btn",function(){
        $("#userModal").modal("show");

        var id = $(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-danger")?0:1;

        $(".btn_sure").off().on("click",function(){
           
            $.ajax({
                url:"/user/updateUser",
                type:"post",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(data){
                    if(data.success){
                        $("#userModal").modal("hide");
                        render();
                        
                    }

                }
            })



        })



    })




})