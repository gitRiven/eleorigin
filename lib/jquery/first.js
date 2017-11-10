$(function () {
    var currentPage = 1;
    var pageSize = 5;

    function render() {

        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                var html = template("tpinner", data);
                $("tbody").html(html);

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render()
                    }
                })
            }
        })
    }

    render()

    $(".btn_add").on("click", function () {
        $("#addModal").modal("show")
    })

    var $form = $("form");
    $form.bootstrapValidator({
        //小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类"
                    }
                }
            }
        }
    });
    
    
    
    
    $form.on("success.form.bv",function(e){

        e.preventDefault();

        $.ajax({
            url:"/category/addTopCategory",
            type:"post",
            data:$form.serialize(),
            success:function(data){
                if(data.success){
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render();

                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset;
                }
            }
        })


    })




})