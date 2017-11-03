$(function () { 
	$('#collapseOne').collapse({
		toggle: false
	})
	//请求默认页信息
	var teacherId = userId; //从session获取teacherId
	teacher_getStudentInfo();

	$('.studentInfo-tab').click(function(){
        teacher_getStudentInfo();
    })
	//搜索按钮
	$('#studentSearch').click(function(){
		//学号姓名
		var studentNo = $('#studentNo').val();
		var studentName = $('#studentName').val();
		
		$('#studentTable').bootstrapTable('refresh',{url:'/ceo/teacherclasses?teacherId='+teacherId+'&userId='+studentNo+'&userName='+studentName});
	})

	function teacher_getStudentInfo(){
	//设置表格 彩印bootstrap table插件
		$('#studentTable').bootstrapTable({
			url:'/ceo/teacherclasses?teacherId='+teacherId,
			striped: true, 
			pagination: true,  //是否分页
			//showRefresh: true, //是否显示刷新功能
			//search:true,
			pageNumber:1, //当前第几页
			sidePagination: "server", //表示服务端请求 
			dataField: "object",
			pageSize: 10,
			queryParams:queryParams,
			pageList: [10, 25,050, 100],
			columns:[{
				field: 'userId',
				title: '学号'
				},{
					field: 'userName',
					title: '姓名'
				},{
					field: 'classId',
					title: '班级'
				},{
					field: 'type',
					title: '职位'
				},{
					field: 'teacherScore',
					title: '老师给分'
				},{
					field: 'score',
					title: '总分'
				},{
					field: 'caozuo',
					title: '操作',
					formatter:function(value,row){
						return '<a type="button" class="btn btn-xs btn-info" onclick="setCeo(\''+row.id+'\',\''+row.type+'\',\''+row.userName+'\',\''+teacherId+'\');">指定CEO</a>';
				}
			}],
			//调整后台返回数据为bootstrap table所接受的
			responseHandler:function(res){
				var row = res.data.object;
				return {
					"total": res.data.totalNumber,//总页数
					"object": row   //数据  key与前面的dataField一致
				};
			}
		})
		//请求服务数据时所传参数
		function queryParams(params){
			return {
				pageSize : params.limit, //每一页的数据行数，默认是上面设置的10(pageSize)
				currentPage : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
				//param : "Your Param" //这里是其他的参数，根据自己的需求定义，可以是多个
			}
		}
	}

});

//教师指定CEO
function setCeo(id,type,userName,teacherId){
	bootbox.confirm({
		size:'small',
		message:'你确定要指定'+userName+'为CEO？',
		callback: function(result){
			if(result){
				if(type == 'CEO'){
					bootbox.alert('该学生已经是CEO了，不能重复指定');
				}else{
					$.ajax({
						url: '/ceo/studentclasses/'+id,
						type: 'put',
						data:{
							type: 'CEO'
						},
						success: function(data){
							if(data.status == 1){
								bootbox.alert('成功');
								$('#studentTable').bootstrapTable('refresh',{url:'/ceo/teacherclasses?teacherId='+teacherId})
							}else{
								bootbox.alert('失败');
							}
						}
					})
				}
			}else{

			}
		}
	})
}