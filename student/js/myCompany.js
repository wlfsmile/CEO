// 我的公司
$(function(){
    //var userId = 2014210842;
    $('.myCompany-tab').click(function(){
        $.ajax({
            url: '/usercompanies?userId='+userId,
            type: 'GET',
            success: function(data){
                if(data.status == 1){
                    if(data.data.totalNumber == 0){
                        if(type == 'CEO'){
                            $('#myCompany-table').html('您还未创建公司，请尽快创建公司......');
                        }else{
                            $('#myCompany-table').html('您还未加入公司，请尽快加入公司......');
                        }
                    }else{
                        $('.page-wrapper-head').remove();
                        student_myCompany(); 
                    }
                }
            }
        })
    })

    //点击创建公司
    $('.createCompany').click(function(){
        student_createCompany();
    }) 

    //我的公司
    function student_myCompany(){
        $('#myCompany-table').bootstrapTable({
            url: '/usercompanies?userId='+userId,
            type: 'GET',
            //striped: true, 
            detailView: true,  //父子表
            //showRefresh: true, //是否显示刷新功能
            //pageList: [10, 25, 50, 100],
            columns:[{
                    field: 'companyName',
                    title: '公司名称'
                },{
                    field: 'userName',
                    title: '公司创建人'
                },{
                    field: 'number',
                    title: '人数'
                },{
                    field: 'score',
                    title: '公司得分'
                },{
                    field: 'score',
                    title: '总分'
            }],
            //调整后台返回数据为bootstrap table所接受的
            responseHandler:function(res){
                var row = res.data.object;
                return row;
            },
            //公司成员信息（父子表）
            onExpandRow:function(index,row,$detail){
                var cur_table = $detail.html('<table></table>').find('table');
                var companyId = row.id;
                $(cur_table).bootstrapTable({
                    url:'/usercompanies?companyId='+row.companyId,
                    type:'GET', 
                    columns:[{
                        field: 'userId',
                        title: '学号'
                    },{
                        field:'userName',
                        title:'姓名'
                    },{
                        field: 'cls',
                        title: '班级'
                    },{
                        field: 'number',
                        title: '排名'
                    },{
                        field: 'position',
                        title: '职位'
                    },{
                        field: 'score',
                        title: '得分'
                    },{
                        filed: 'setting',
                        title: '操作',
                        formatter: function(value,row){
                            if(row.userId == userId){
                                return '';
                            }else{
                                return '<a type="button" class="btn btn-xs btn-info">打分</a>&nbsp;&nbsp;&nbsp;&nbsp;<a type="button" class="btn btn-xs btn-warning">设置职位</a>';
                            }
                        }
                    }],
                    responseHandler:function(res){
                        var row = res.data.object;
                        return row;
                    }
                })
            }
        })
    }

    //创建公司
    function student_createCompany(){
        var str =   '<div>'+
                        '<p>'+
                            '<lable>公司名称:</lable>'+
                            '<input class="form-control companyName" type="text" />'+
                        '</p>'+
                    '</div>';
        bootbox.dialog({
            title: '创建公司',
            message: str,
            buttons: {
                "success":{
                    "label" : "<i class='icon-ok'></i> 确定",
                    "className" : "btn-sm btn-info",
                    "callback": function() {
                        $.ajax({
                            url: '/companies',
                            type: 'POST',
                            data: {
                                name: $('.companyName').val(),
                                userId: userId
                            },
                            success: function(data){
                                if(data.status == 1){
                                    bootbox.alert(data.message);
                                    $('#myCompany-table').html('');
                                    student_myCompany();
                                }else{
                                    bootbox.alert(data.message);
                                }
                            }
                        })
                    }
                },
                "cancel": {
                    "label" : "<i class='icon-info'></i> 取消",
                    "className" : "btn-sm btn-danger"
                }
            }
        })
    }
})