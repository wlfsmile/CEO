// 我的公司
$(function(){
    var companyId = 1;
    //var userId = '';
    $('.myCompany-tab').click(function(){
        student_myCompany();
    })
    //我的公司
    function student_myCompany(){
        $.ajax({
            url: '/companies/'+companyId,
            type: 'get',
            dataType: 'json',
            success: function(data){
                if(data.status == 1){
                    console.log(data);
                }
            }
        })
    }
})