//我的公司
$(function(){
    //var companyId = '';
    $('.myCompany-tab').click(function(){
        $.ajax({
            url: '/ceo/usercompanies?userId='+userId,
            type: 'GET',
            //async: false,
            success: function(data){
                if(data.status == 1){
                    if(data.data.totalNumber == 0){
                        if(type == 'CEO'){
                            $('#myCompany-table').html('您还未创建公司，请尽快创建公司......');
                        }else{
                            $('#myCompany-table').html('您还未加入公司，请尽快加入公司......');
                        }
                    }else{
                        //companyId = data.data.object[0].companyId;
                        $('.page-wrapper-head').remove();
                        student_myCompany(); 
                        allApply();
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
            url: '/ceo/usercompanies?userId='+userId,
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
                    title: '姓名'
                },{
                    field: 'number',
                    title: '成员人数'
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
                if(row[0].isScored == 1){
                    $('#companySure').remove();
                }
                return row;
            },
            //公司成员信息（父子表）
            onExpandRow:function(index,row,$detail){
                var cur_table = $detail.html('<table id="companyMember-table"></table>').find('table');
                var companyId = row.id;
                $(cur_table).bootstrapTable({
                    url:'/ceo/usercompanies?companyId='+row.companyId,
                    type:'GET', 
                    columns:[{
                        field: 'userId',
                        title: '学号'
                    },{
                        field:'userName',
                        title:'成员姓名'
                    },{
                        field: 'cls',
                        title: '班级'
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
                            //console.log(row);
                            if(row.userId == userId || row.isScored == 0){
                                return '';
                            }else if(type != 'CEO'){
                                return '<a type="button" class="btn btn-xs btn-info" onClick="setScore(\''+row.id+'\',\''+row.userName+'\',\''+row.companyId+'\')">打分</a>';
                            }else{
                                return '<a type="button" class="btn btn-xs btn-info" onClick="setScore(\''+row.id+'\',\''+row.userName+'\',\''+row.companyId+'\')">打分</a>&nbsp;&nbsp;&nbsp;&nbsp;\
                                        <a type="button" class="btn btn-xs btn-warning" onClick="setPosition(\''+row.id+'\',\''+row.userName+'\',\''+row.companyId+'\');">设置职位</a>';
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

    //点击锁定公司成员
    $('#companySure').click(function(){
        bootbox.confirm({
            size: 'small',
            message: '你确定要锁定公司成员？并不可再更改',
            callback: function(result){
                if(result){
                    $.ajax({
                        url: '/ceo/companies/'+companyId,
                        type: 'put',
                        data: {
                            isScored: "1"
                        },
                        success: function(data){
                            bootbox.alert('你已成功锁定成员');
                            $('#ceoCompanyInfo-table').bootstrapTable('refresh',{url:'/ceo/usercompanies?userId='+userId});
                        }
                    })
                }
            }
        })
        
    })

    //所有申请公司成员
    function allApply(){
        $('#ceoCompanyInfo-table').bootstrapTable({
            url: '/ceo/applications?companyId='+companyId,
            type: 'GET',
            //striped: true, 
            pagination: true,  //是否分页
            //showRefresh: true, //是否显示刷新功能
            pageNumber:1, //当前第几页
            //sidePagination: "server", //表示服务端请求 
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            columns:[{
                    field: 'id',
                    title: '姓名'
                },{
                    field: 'grade',
                    title: '志愿级别'
                },{
                    field: 'calculatedGrade',
                    title: '人数'
                },{
                    field: 'setting',
                    title: '操作',
                    formatter: function(value,row){
                        return '<a type="button" class="btn btn-xs btn-info" onClick="ceoAdmin(\''+row.id+'\',\''+companyId+'\');">录取</a>&nbsp;&nbsp;&nbsp;&nbsp;\
                                <a type="button" class="btn btn-xs btn-danger" onClick="ceoRefuse(\''+row.id+'\',\''+companyId+'\');">拒绝</a>'
                    }
            }],
            //调整后台返回数据为bootstrap table所接受的
            responseHandler:function(res){
                var row = res.data.object;
                return row;
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

//点击录取成员
function ceoAdmin(id,companyId){
    bootbox.confirm({
        size:'small',
        message:'你确定要录取'+id+'为公司成员？',
        callback: function(result){
            if(result){
                $.ajax({
                    url: '/ceo/applications/'+id,
                    type:  'delete',
                    success: function(data){
                        if(data.status == 1){
                            bootbox.alert(data.message);
                            $('#ceoCompanyInfo-table').bootstrapTable('refresh',{url:'/ceo/applications?companyId='+companyId});
                        }else{
                            bootbox.alert(data.message);
                        }
                    },
                    error: function(){
                        console.log('error');
                    }
                })           
            }
        }
    })
    
}
//点击拒绝录取成员
function ceoRefuse(id,companyId){
    bootbox.confirm({
        size:'small',
        title: '成员信息',
        message:'你确定要拒绝'+id+'为公司成员？',
        callback: function(result){
            if(result){
                $.ajax({
                    url: '/ceo/applications/'+id,
                    type: 'put',
                    success: function(data){
                        if(data.status == 1){
                            bootbox.alert(data.message);
                            $('#ceoCompanyInfo-table').bootstrapTable('refresh',{url:'/ceo/applications?companyId='+companyId});
                        }else{
                            bootbox.alert(data.message);
                        }
                    },
                    error: function(){
                        bootbox.alert('error');
                    }
                })           
            }
        }
    })
}

//成员打分
function setScore(id,name,companyId){
    bootbox.prompt({
        size:'small',
        title: '请输入你为'+ name +'所设置的分数',
        //message: '请输入你为'+ name +'所设置的分数',
        callback: function(result){
            if(result){
                $.ajax({
                    url: '/ceo/usercompanies/'+id,
                    type: 'put',
                    data: {
                        score: result
                    },
                    success: function(data){
                        if(data.status == 1){
                            bootbox.alert('设置成功');
                            $('#companyMember-table').bootstrapTable('refresh',{url:'/ceo/usercompanies?companyId='+companyId})
                        }
                    }
                })
            }
        }
    })
}

function setPosition(id,name,companyId){
    bootbox.prompt({
        size:'small',
        title: '请输入你为'+ name +'所设置的职位',
        //message: '请输入你为'+ name +'所设置的分数',
        callback: function(result){
            if(result){
                $.ajax({
                    url: '/ceo/usercompanies/'+id,
                    type: 'put',
                    data: {
                        position: result,
                        score: 100
                    },
                    success: function(data){
                        console.log(data);
                        if(data.status == 1){
                            bootbox.alert('设置成功');
                            $('#companyMember-table').bootstrapTable('refresh',{url:'/ceo/usercompanies?companyId='+companyId})
                        }
                    }
                })
            }
        }
    })
}