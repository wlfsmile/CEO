//成员加入公司
$(function(){
    var companyData = '';
    var num = ['第一志愿','第二志愿','第三志愿','第四志愿','第五志愿','第六志愿'];
    var btnStr = '<p><span class="btn btn-primary subApply">提交</span></p>'

    $('.joinCompany-tab').click(function(){
        joinCompany();
        applyCompany();   
    })
    //请求所有公司
    function applyCompany(){
        $.ajax({
            url: '/ceo/companies?studentId='+userId+'&pageSize='+100,
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

    function joinCompany(){
        
        var numStr = '';
        //填充志愿表单
        for(var i=0;i<num.length;i++){
            numStr +=   '<p>'+
                            '<label>'+ num[i] +'</label>'+
                            '<select class="form-control">'+
                            '</select>'+
                            '<span class="applyWarning"></span>'+
                        '</p>';
        }
        numStr = numStr+btnStr;
        $('.application').html(numStr);

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
            //一共有几个志愿，组成数组
            var selectLen = $('.application select').length;
            var selectArr = [];
            for(var i=0;i<selectLen;i++){
                selectArr.push($('.application select').eq(i).val());
            }
            //只选择有效的申请
            var selectVals = selectArr.filter(function(selectVal){
                return selectVal != null;
            })
            var len = selectVals.length;
            //console.log(selectVals);
            var arr = [];
            for(var i=0;i<len;i++){
                var arrList= {
                        "userId":userId,
                        "companyId":selectVals[i], 
                        //"createTime": "2017-10-21 15:53:50",
                        //"modifiedTime": "2017-10-26 16:53:36",
                        "grade": (i+1)
                    };
                arr.push(arrList);
            }
    
            //转化数组为json格式
            //console.log(arr);
            var list = {"list":arr};
            list = JSON.stringify(list);
            //判断填写志愿是否有误
            var btnFlag = true;
            $('.applyWarning').each(function(){
                if($(this).html() !== ''){
                    btnFlag = false;
                }
            })
            if(btnFlag){
                $.ajax({
                    url: '/ceo/applications',
                    type: 'post',
                    contentType: 'application/json',
                    data: list,
                    dataType: 'json',
                    success: function(data){
                        if(data.status == 1){
                            bootbox.alert('恭喜你，申报成功！请耐心等待');
                        }else{
                            bootbox.alert(data.message);
                        }
                    }
                })
            }else{
                bootbox.alert('志愿填写有误，请检查后重新填写');
            }
        })
    }   
})