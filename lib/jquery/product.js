$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var imgArr = [];
    var render = function () {


        $.ajax({
            url: "/product/queryProductDetailList",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (data) {
                $("tbody").html(template("tpinner", data));
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })

    }

    render()

    $(".btn_add").on("click", function () {
        $("#addModal").modal("show");
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (data) {
                $(".dropdown-menu").html(template("tpselect", data))
            }
        })
    })

    var $form = $("form")

    $(".dropdown-menu").on("click", "a", function () {
        $(".dropdown-text").text($(this).text());
        $("#brandId").val($(this).data("id"));
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
    })

    $form.bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    //非空
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则, 不能0开头，必须是数字
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: "请输入正确的数字"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "请输入正确的尺码（比如：30-50）"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            productLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传三张图片"
                    }
                }
            }
        }
    });
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, data) {
            if ($(".img_box").find("img").length >= 3) {
                //如果图片大于3张，不玩了
                return false;
            }

            //上传的结果在data.result中，每次上传到往img_box追加一张图片
            $(".img_box").append('<img data-name="' + data.result.picName + '" data-src="' + data.result.picAddr + '" src="' + data.result.picAddr + '" width="100" height="100" alt="">');

            //图片校验，判断img_box中img的数量是否是3，如果是，就成功，否则失败
            if ($(".img_box").find("img").length === 3) {
                $form.data("bootstrapValidator").updateStatus('productLogo', "VALID");
            } else {
                $form.data("bootstrapValidator").updateStatus('productLogo', "INVALID");
            }


            $(".img_box").find("img").off().on("dblclick", function () {
                //自杀
                $(this).remove();
                //图片校验，判断img_box中img的数量是否是3，如果是，就成功，否则失败
                if ($(".img_box").find("img").length === 3) {
                    $form.data("bootstrapValidator").updateStatus('productLogo', "VALID");
                } else {
                    $form.data("bootstrapValidator").updateStatus('productLogo', "INVALID");
                }
            });
        }
    });

    $form.on("success.form.bv", function (e) {
        console.log("1111");
        e.preventDefault();

        var data = $form.serialize();

        //获取到img_box下所有的图片，获取picName和picAddr，拼接到data中
        var $img = $(".img_box img");


        //图片的src在获取的时候，会自动拼接上绝对路径地址： http://localhost,不希望，也放到自定义的属性中。
        data += "&picName1=" + $img[0].dataset.name + "&picAddr1=" + $img[0].dataset.src;
        data += "&picName2=" + $img[1].dataset.name + "&picAddr2=" + $img[1].dataset.src;
        data += "&picName3=" + $img[2].dataset.name + "&picAddr3=" + $img[2].dataset.src;


        //发送ajax
        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: data,
            success: function (data) {
                if (data.success) {
                    //关闭模态框
                    $("#addModal").modal("hide");
                    //重新渲染第一页
                    currentPage = 1;
                    render();


                    //重置
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();

                    $(".dropdown-text").text("请选择二级分类");
                    $("#brandId").val('');
                    $(".img_box img").remove();
                    $("#productLogo").val('');

                }
            }
        });

    });

    //function
})