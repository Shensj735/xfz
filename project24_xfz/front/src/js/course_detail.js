function CourseDetail() {

}

CourseDetail.prototype.initPlayer = function(){
    var videoInfoSpan = $("#video-info");
    var video_url = videoInfoSpan.attr("data-video-url");
    var cover_url = videoInfoSpan.attr("data-cover-url");
    var course_id = videoInfoSpan.attr("data-course-id");

    var player = cyberplayer("playercontainer").setup({
        width: '100%',
        height: '100%',
        file: video_url,
        image: cover_url,
        autostart: false,
        stretching: 'uniform',
        repeat: false,
        volume: 100,
        controls: true,
        tokenEncrypt: true,
        ak: 'a4e4f36bf21942d5912949460ce2e939'
    });
    player.on("beforePlay", function (e) {
        if(!/m3u8/.test(e.file)){
            return;
        }
        xfzajax.get({
            'url':'/course/course_token/',
            'data': {
                'video_url': video_url,
                'course_id': course_id,
            },
            'success': function (result) {
                if (result['code'] === 200){
                    var token = result['data']['token'];
                    player.setToken(e.file, token);
                }else {
                    window.messageBox.showInfo(result["message"]);
                    player.stop();
                }
            }
        })
    })
};

CourseDetail.prototype.run = function () {
    this.initPlayer();
};

$(function () {
    var course = new CourseDetail();
    course.run();
});