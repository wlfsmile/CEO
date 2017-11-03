//判断登录人身份，获取信息
var type='';
var userId = '';
var companyId = '';
var userName = '';
$.ajax({
    url: '/ceo/userInfo',
    type:'get',
    async: false,
    success: function(data){
        if(data.status == 1){
            userId = data.data.userId;
            userName = data.data.userName;
            $('.dropdown-name').html(userName);
            //请求type(CEO)之类的信息
            $.ajax({
                url: '/ceo/usercompanies?userId='+userId,
                type: 'get',
                async: false,
                success: function(data){
                    if(data.status == 1){
                        console.log()
                        //console.log(data.data.object[0].position);
                        if(data.data.totalNumber == 0){
                            $('.page-wrapper-head').remove();
                            $('#ceoCompanyInfo').remove();
                            $('#companySure').remove();
                        }else{
                            type = data.data.object[0].position;
                            companyId = data.data.object[0].companyId;
                        }
                        if(type !== 'CEO'){
                            $('.page-wrapper-head').remove();
                            $('#ceoCompanyInfo').remove();
                            $('#companySure').remove();
                        }else{
                            $('.joinCompany-tab').remove();
                            $('#joinCompany').remove();
                        }
                    }
                }
            })
        }
    }
})

// 注销登录
function logout(){
    bootbox.confirm({
        title: '注销登录',
        message: '你确定要退出系统么？',
        callback: function(result){
            if(result){
                $.ajax({
					url:'/User_logout?userId='+userId,
					type:'post',
					dataType:'json',
					success:function(obj){
						//登陆成功后的操作，如	关闭dialog messager提示
						//json数据	
						if(obj){
							window.location.href='http://172.22.4.16';
						}
					}
				});
            }
        }
    })
}