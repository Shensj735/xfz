function CMSNewsList() {

}

CMSNewsList.prototype.initDataPicker = function(){
    var startPicker = $("#startpicker");
    var endPicker  = $("#endpicker");
    var todayDate = new Date();
    var todayStr = todayDate.getFullYear()+'/'+(todayDate.getMonth()+1)+'/'+todayDate.getDate();
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2019/6/20',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true,
    };
    startPicker.datepicker(options);
    endPicker.datepicker(options);
};

CMSNewsList.prototype.listenDeleteEvent = function(){
    var deleteBtns = $(".delete-btn");
    deleteBtns.click(function () {
        var btn = $(this);
        var news_id = btn.attr('data-news-id');

        xfzalert.alertConfirm({
            'text': '您确认要删除该文章吗？',
            'confirmCallback': function () {

                xfzajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        'news_id': news_id
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            xfzalert.alertSuccess("新闻删除成功！",function () {
                                window.location = window.location.href;
                            });
                        }
                    }
                });
            }
        });
    });
};

CMSNewsList.prototype.run = function(){
    var self = this;
    self.initDataPicker();
    self.listenDeleteEvent();
};

$(function () {
    var cmsNewsList = new CMSNewsList();
    cmsNewsList.run();
});