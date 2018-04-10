$.ajaxSetup({    headers: {        'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content')    }});//用于编辑的时候设置值(function ($) {    $.fn.setform = function (jsonValue,prefix) {        var obj=this;        $.each(jsonValue, function (id, ival) {            $.each(jsonValue, function (id, ival) {obj.find("#"+ prefix + id).val(ival); })        })    }})(jQuery)//获取表格数据function get_id_arr(table) {    var data_id = table.bootstrapTable('getSelections');    var id_arr = [];    if (data_id.length) {        for (var i = 0; i < data_id.length; i++) {            id_arr.push(data_id[i].id);        }        return id_arr;    } else {        layer.msg('需要先选择数据行哦！', {icon: 0});    }}//设置文件上传进度条function progress(event) {    if (event.lengthComputable) {        var value = (event.loaded / event.total * 100 | 0);        $("#progress-bar").text(value + '%').css('width', (value + '%'));    }}// 用户列表操作封装function user_operate(tableobj,addurl,delurl,editurl,reseturl,defriendurl) {    $("#add").click(function () {        $('.add-model').modal('toggle');    })    $("#defriend").click(function () {        var id_arr = get_id_arr(tableobj);        //判断是否有数据        if (id_arr) {            //询问框            layer.confirm('确定禁用ID为【' + id_arr.join('，') + '】的用户吗？', {                btn: ['确定', '取消'],//按钮                skin: 'layui-layer-molv' //样式类名            }, function () {                //请求后台                $.ajax({                    url: defriendurl,                    type: 'POST',                    data: {                        id:id_arr                    },                    success: function (result) {                        if (result.code) {                            //status为1成功                            layer.msg('' + result.msg, {icon: 1});                            tableobj.bootstrapTable('refresh');                        } else {                            layer.msg('' + result.msg, {icon: 2});                        }                    },                    error:function () {                        layer.msg('网络开小差了!', {icon: 5});                    }                });            });        }    })//单击禁用操做    $('#table').on('click','.defriend',function (event) {        $('#table').bootstrapTable('uncheckAll');        var id_arr = [];        id_arr.push($(this).attr('data_id'));        //请求后台        $.ajax({            url: defriendurl,            type: 'POST',            data: {                id:id_arr            },            success: function (result) {                if (result.code) {                    //status为1成功                    layer.msg('' + result.msg, {icon: 1});                    tableobj.bootstrapTable('refresh');                } else {                    layer.msg('' + result.msg, {icon: 2});                }            },            error:function () {                layer.msg('网络开小差了!', {icon: 5});            }        });        //防止冒泡        return false;    })    $("#reset").click(function () {        var id_arr = get_id_arr($('#table'));        //判断是否有数据        if (id_arr) {            //询问框            layer.confirm('确定重置ID为【' + id_arr.join('，') + '】的用户的密码吗？', {                btn: ['确定', '取消'],//按钮                skin: 'layui-layer-molv' //样式类名            }, function () {                //请求后台                $.ajax({                    url: reseturl,                    type: 'POST',                    data: {                        id:id_arr                    },                    success: function (result) {                        if (result.code) {                            //status为1成功                            layer.msg('' + result.msg, {icon: 1});                        } else {                            layer.msg('' + result.msg, {icon: 2});                        }                    },                    error:function () {                        layer.msg('网络开小差了!', {icon: 5});                    }                });            });        }    })    $("#del").click(function () {        var id_arr = get_id_arr(tableobj);        //判断是否有数据        if (id_arr) {            //询问框            layer.confirm('确定删除ID为【' + id_arr.join('，') + '】的行吗？', {                btn: ['确定', '取消'],//按钮                skin: 'layui-layer-molv' //样式类名            }, function () {                //请求后台                $.ajax({                    url: delurl,                    type: 'POST',                    data: {                        id:id_arr                    },                    success: function (result) {                        if (result.code) {                            //status为1成功                            layer.msg('' + result.msg, {icon: 1});                            var data_id = tableobj.bootstrapTable('getSelections');                            //$('#table').bootstrapTable('removeAll');                            if (data_id.length) {                                for (var i = 0; i < data_id.length; i++) {                                    tableobj.bootstrapTable('removeByUniqueId', data_id[i].id);                                }                            }                        } else {                            layer.msg('' + result.msg, {icon: 2});                        }                    },                    error:function () {                        layer.msg('网络开小差了!', {icon: 5});                    }                });            });        }    });    $("#edit").click(function () {        var data_id = tableobj.bootstrapTable('getAllSelections');        if (data_id.length > 1) {            layer.msg('选择多个将默认第一个哦！', {icon: 6});            $('.edit-model').modal('toggle');        } else if(data_id.length<1) {            layer.msg('需要先选择数据行哦！', {icon: 0});            return false;        }else{            $('.edit-model').modal('toggle');        }        $('#edit-form').setform(data_id[0], 'B-');        $('#edit-form').attr('data_id',data_id[0]['id']);        //添加        //$('#table').bootstrapTable('updateByUniqueId', {id:id, row: data_id[0]});        //$('#table').bootstrapTable('updateCell',7,'name','xiuxiu');        //$('#table').bootstrapTable('resetView');    })    $("#add-confirm").click(function () {        if($('#add-form').validate().form()){            $.ajax({                url: addurl,                type: 'POST',                data: $('#add-form').serialize(),                success: function (result) {                    if (result.code) {                        //status为1成功                        layer.msg('' + result.msg, {icon: 1});                        tableobj.bootstrapTable('refresh');                        $('.add-model').modal('toggle');                        $('#add-form input').val("");                    } else {                        layer.msg('' + result.msg, {icon: 2});                    }                },                error:function () {                    layer.msg('网络开小差了!', {icon: 5});                }            });        }    })    $("#edit-confirm").click(function () {        if($('#edit-form').validate().form()){            $.ajax({                url: editurl+$('#edit-form').attr('data_id'),                type: 'POST',                data: $('#edit-form').serialize(),                success: function (result) {                    if (result.code) {                        //status为1成功                        layer.msg('' + result.msg, {icon: 1});                        tableobj.bootstrapTable('refresh');                        $('.edit-model').modal('toggle');                    } else {                        layer.msg('' + result.msg, {icon: 2});                    }                },                error:function () {                    layer.msg('网络开小差了!', {icon: 5});                }            });        }    })}function import_file(name,url, from) {    $("#info").click(function () {        $('.info-model').modal('toggle');    });    $("#import").click(function () {        $('.import-model').modal('toggle');        $("#file").val("");        $("#progress").hide();    });    $("#import-confirm").click(function () {        if ($('#import-form').validate().form()) {            var formData = new FormData();            formData.append(name, $("#file")[0].files[0]);            formData.append('from', from);            $.ajax({                url: '/admin/excel/import',                type: 'POST',                data: formData,                contentType:false,                processData:false,                beforeSend :function () {                    $("#progress").show();                },                // xhr: function () {                //     //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用                //     myXhr = $.ajaxSettings.xhr();                //     if (myXhr.upload) {                //         //progress事件会在浏览器接收新数据期间周期性地触发。而onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着三个额外的属性：lengthComputable、loaded和total。其中，lengthComputable是一个表示进度信息是否可用的布尔值，loaded表示已经接收的字节数，loaded表示根据Content-Length响应头部确定的预期字节数。                //         myXhr.upload.addEventListener('progress', progress, false)                //     }                // },                success: function (result) {                    if (result.status) {                        //status为1成功                        layer.msg('' + result.msg, {icon: 1});                        $('#table').bootstrapTable('refresh');                        $('.import-model').modal('toggle');                    } else {                        layer.msg('' + result.msg, {icon: 2});                    }                },                error: function () {                    $("#progress").hide();                    layer.msg('网络开小差了!', {icon: 5});                }            });        }    });}