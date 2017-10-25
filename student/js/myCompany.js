$(function(){

    var studentId = 1;
    $('.myCompany-tab').click(function(){
        student_myCompany();
    })
    //我的公司
    function student_myCompany(){
        $.ajax({
            url: '/companies/'+studentId,
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