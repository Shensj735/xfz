function NewsList(){

}

NewsList.prototype.listenSubmitEvent = function(){
    var submitBtn = $(".submit-btn");
    var textarea = $("textarea[name='comment']");
    submitBtn.click(function () {
        var content = textarea.val();
        var news_id = submitBtn.attr("news-id");
        xfzajax.post({
            'url': '/news/public_comment/',
            'data': {
                'content': content,
                'news_id': news_id
            },
            'success': function (result){
                if (result['code'] === 200) {
                    var comment = result['data'];
                    var commentList = $(".comment-list");
                    var tpl = template("comment-item", {"comment": comment});
                    commentList.prepend(tpl);
                    textarea.val("");
                    window.messageBox.showSuccess("发表评论成功！");
                }else {
                    window.messageBox.showError(result['message']);
                }
            }
        });
    });
};

NewsList.prototype.run = function () {
    var self = this;
    self.listenSubmitEvent();
};

$(function () {
    var news = new NewsList();
    news.run();
});