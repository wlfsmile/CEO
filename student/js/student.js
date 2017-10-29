//判断登录人身份，获取信息

var type = 'CEO11';
var userId = '2014210844';

if(type !== 'CEO'){
    $('.page-wrapper-head').remove();
}else{
    $('.joinCompany-tab').remove();
    $('#joinCompany').remove();
}