function uploadFile() {

}

uploadFile.prototype.initUEditor = function (){
    window.ue = UE.getEditor('editor',{
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });
};

uploadFile.prototype.listenUploadFileEvent = function(){
    var uploadBtn = $("#thumbnail-btn");
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file',file);
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200){
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                    console.log(url);
                }
            }
        })
    })
};

uploadFile.prototype.listenUploadFileToQiNiuEvent = function(){
    var self = this;
    var uploadBtn = $("#thumbnail-btn");
    uploadBtn.change(function () {
        var file = this.files[0];
        xfzajax.get( {
            'url': '/cms/qntoken/',
            'success': function (result) {
                if (result['code'] === 200){
                    var token = result['data']['token'];
                    var pre_keys = (new Date()).getTime() + ".";
                    var next_keys = file.name.split(".");
                    // 获取最后一个数组元素，也可以使用pop()方法
                    var key = pre_keys + next_keys[next_keys.length-1];
                    var putExtra = {
                        fname: key,
                        params: {},
                        mimeType: ['image/png', 'image/gif', 'image/jpeg']
                    };
                    var config = {
                        useCdnDomain: true,
                        retryCount: 6,
                        region: qiniu.region.z2
                    };
                    var observable = qiniu.upload(file, key, token, putExtra, config);
                    observable.subscribe ({
                        'next': self.handleFileUploadProgress,
                        'error': self.handleFileUploadError,
                        'complete': self.handleFileUploadComplete
                    });
                }
            }
        })
    })
};

uploadFile.prototype.handleFileUploadProgress = function(response){
    var total = response.total;
    var percent = total.percent;
    var percentText = percent.toFixed(0)+"%";
    var progressGroup = uploadFile.progressGroup;
    progressGroup.show();
    var progressBar = uploadFile.progressBar;
    progressBar.css({"width": percentText});
    progressBar.text(percentText);
};

uploadFile.prototype.handleFileUploadError = function(error){
    window.messageBox.showError(error.message);
    console.log(error.message);
    var progressGroup = uploadFile.progressGroup;
    progressGroup.hide();
};

uploadFile.prototype.handleFileUploadComplete = function(response){
    console.log(response);
    var progressGroup = uploadFile.progressGroup;
    var thumbnailInput = $("input[name='thumbnail']");
    progressGroup.hide();
    var domain = "http://ptr0aa5vs.bkt.clouddn.com";
    var filename = response.key;
    var url = domain + filename;
    thumbnailInput.val(url);
    var progressBar = uploadFile.progressBar;
    progressBar.css({"width": "0%" });
    progressBar.text("0%");
};

uploadFile.prototype.listenSubmitEvent = function(){
    var submit = $("#submit-btn");
    submit.click(function (event) {
        var btn = $(this);
        var news_id = btn.attr('data-news-id');
        var url = "";
        if (news_id){
            url = '/cms/edit_news/';
        } else {
            url = '/cms/write_news/';
        }
        event.preventDefault();
        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = window.ue.getContent();

        xfzajax.post({
            'url': url,
            'data': {
                'title': title,
                'desc': desc,
                'thumbnail': thumbnail,
                'category': category,
                'content': content,
                'pk': news_id,
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    if (news_id) {
                        xfzalert.alertSuccess("恭喜！新闻编辑成功！", function () {
                            // window.location.reload();
                            console.log("编辑新闻id"+news_id);
                        });
                    } else {
                        xfzalert.alertSuccess("恭喜！新闻发表成功！", function () {
                        // window.location.reload();
                            console.log("发表新闻id"+news_id);
                        });
                    }
                }
            }
        });
    });
};

uploadFile.prototype.run = function () {
    var self = this;
    self.listenUploadFileEvent();
    self.listenUploadFileToQiNiuEvent();
    self.initUEditor();
    self.listenSubmitEvent();
};

$(function () {
    var upload = new uploadFile();
    upload.run();
    uploadFile.progressGroup = $("#progress-group");
    uploadFile.progressBar = $(".progress-bar");
});