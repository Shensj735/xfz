function pubCourse() {

}

pubCourse.prototype.initUEditor = function(){
    window.ue = UE.getEditor('editor', {
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });
};

pubCourse.prototype.listenSubmitEvent = function(){
    var submitBtn = $("#submit-btn");
    submitBtn.click(function () {
        console.log("---------------------");
        console.log("click!");
        console.log("---------------------");
        var title = $("#title-input").val();
        var category = $("#category-input").val();
        var teacher = $("#teacher-input").val();
        var video_url = $("#video-input").val();
        var cover_url = $("#cover-input").val();
        var price = $("#price-input").val();
        var duration = $("#duration-input").val();
        var profile = window.ue.getContent();
        xfzajax.post({
            'url': '/cms/pub_course/',
            'data': {
                'title': title,
                'category': category,
                'teacher': teacher,
                'video_url': video_url,
                'cover_url': cover_url,
                'price': price,
                'duration': duration,
                'profile': profile,
            },
            'success': function (result) {
                if (result['code'] === 200){
                    console.log("---------------------");
                    console.log("success");
                    console.log("---------------------");
                    xfzalert.alertSuccess("课程发布成功！", function () {
                        window.location = window.location.href;
                        });
                }
            }
        });
    });
};

pubCourse.prototype.run = function () {
    this.initUEditor();
    this.listenSubmitEvent();
};

$(function () {
    var course = new pubCourse();
    course.run();
});