$(function(){
    function student_ceoCompanyInfo(){
        $('.ceoCompanyInfo-table').bootstrapTable({
            url:'/ceo/applications?companyId='+companyId,
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
        })
    }
})