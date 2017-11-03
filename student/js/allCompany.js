//所有公司
$(function(){
    student_getCompanyInfo();

    $('.allCompanyInfo-tab').click(function(){
        student_getCompanyInfo();
    })

    //查询公司
    $('#companySearch').click(function(){
		//学号姓名
		var companyName = $('#companyName').val();
		
		$('#allCompanyInfo-table').bootstrapTable('refresh',{url:'/ceo/companies?name='+companyName})
    })
    
    //设置表格 采用bootstrap table
    function student_getCompanyInfo(){
        $('#allCompanyInfo-table').bootstrapTable({
            url:'/ceo/companies',
            type:'GET',
            striped: true, 
            pagination: true,  //是否分页
            detailView:true,  //父子表
            //showRefresh: true, //是否显示刷新功能
            pageNumber:1, //当前第几页
            sidePagination: "server", //表示服务端请求 
            dataField: "object",
            pageSize: 10,
            queryParams:queryParams,
            pageList: [10, 25, 50, 100],
            columns:[{
                    field: 'name',
                    title: '公司名称'
                },{
                    field: 'id',
                    title: '公司创建人'
                },{
                    field: 'number',
                    title: '班级'
                },{
                    field: 'isScored',
                    title: '已得分'
                },{
                    field: 'score',
                    title: '总分'
            }],
            //调整后台返回数据为bootstrap table所接受的
            responseHandler:function(res){
                var row = res.data.object;
                return {
                    "total": res.data.totalNumber,//总页数
                    "object": row   //数据  key与前面的dataField一致
                };
            },
            //公司成员信息（父子表）
            onExpandRow:function(index,row,$detail){
                var cur_table = $detail.html('<table></table>').find('table');
                var companyId = row.id;
                $(cur_table).bootstrapTable({
                    url:'/ceo/usercompanies?companyId='+row.id,
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
                        field: 'isScored',
                        title: '已得分'
                    },{
                        field: 'score',
                        title: '总分'
                    // },{
                    //     filed: 'setting',
                    //     title: '操作',
                    //     formatter: function(value,row){
                    //         return '<a type="button" class="btn btn-xs btn-info">打分</a>&nbsp;&nbsp;&nbsp;&nbsp;<a type="button" class="btn btn-xs btn-warning">设置职位</a>';
                    //     }
                    }],
                    responseHandler:function(res){
                        var row = res.data.object;
                        return row;
                    }
                })
            }
        })
        //请求服务数据时所传参数
        function queryParams(params){
            return {
                order:'DESC',
                pageSize : params.limit, //每一页的数据行数，默认是上面设置的10(pageSize)
                currentPage : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
                orderType:'id'
            }
        }
    }
})