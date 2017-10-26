//成员加入公司
$(function(){
    var companyData = '';
    //var userId = '2014210840';

    $('.joinCompany-tab').click(function(){
        joinCompany();
    })
    //请求所有公司
    function joinCompany(){
        $.ajax({
            url: '/companies',
            type: 'get',
            dataType: 'json',
            success: function(data){
                if(data.status == 1){
                    companyData = data.data.object;
                    var str = '<option disabled selected value>--请选择--</option>';
                    for(var i in companyData){
                        str += '<option num='+i+' value="'+companyData[i].id+'">'+companyData[i].name+'</option>';
                    }
                    $('.application select').html(str);
                }
            }
        })
    }

    //判断选择重复
    $('.application select').change(function(){
        var flag = false;
        var optionIndex = $(this).find('option:selected').index();
        $('.application select').each(function(){
            var onValue = $(this).val();
            if($('.application select option[value="'+onValue+'"]:selected').size()>1){
                flag = true;
            }
        })
        if(flag){
            $(this).siblings('.applyWarning').html('该公司已经是你的其他志愿选项，不可重复,请重新选择');
        }else{
            $('.applyWarning').html('');
        }
    });

    //提交按钮 申请公司
    $('.subApply').click(function(){
        var len = $('.application select').length;
        var btnFlag = true;
        $('.applyWarning').each(function(){
            if($(this).html() !== ''){
                btnFlag = false;
            }
        })
        var arr = [];
        for(var i=0;i<len;i++){
            var arrList= {
                    "userId":userId,
                    "companyId":$('.application select').eq(i).val(),
                    "createTime": "2017-10-21 15:53:50",
                    "modifiedTime": "2017-10-26 16:53:36",
                    "grade": (i+1)
                };
            arr.push(arrList);
        }
        //转化数组为json格式
        arr = JSON.stringify(arr);
        //判断填写志愿是否有误
        if(btnFlag){
            $.ajax({
                url: '/applications',
                type: 'post',
                contentType: 'application/json',
                data: arr,
                dataType: 'json',
                success: function(data){
                    if(data.status == 1){
                        bootbbox.alert('恭喜你，申报成功！请耐心等待');
                    }else{
                        bootbox.alert(data.message);
                    }
                }
            })
        }else{
            bootbox.alert('志愿填写有误，请检查后重新填写');
        }
    })
        
})