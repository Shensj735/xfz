// 登陆成功后用户的Hover事件

function FrontBase() {

}

FrontBase.prototype.run = function () {
    self = this;
    self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    })
};

function Auth() {
    this.maskWrapper = $('.mask-wrapper');
    this.scrollWrapper = $(".scroll-wrapper");
    this.smsCaptcha = $(".sms-captcha-btn");
}

Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();

};

Auth.prototype.hideEvent =  function () {
    var self = this;
    self.maskWrapper.hide();
};

Auth.prototype.listenShowHide = function(){
    var self = this;
    var signinBtn = $(".signin-btn");
    var signupBtn = $(".signup-btn");
    var closeBtn = $(".close-btn");
    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": "0px"});
    });
    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({"left": "-400px"});
    });
    closeBtn.click(function () {
        self.hideEvent();
    });
};

Auth.prototype.listenSwitchEvent = function(){
    var self = this;
    var switcher = $(".switch");
    switcher.click(function () {
        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft<0){
            self.scrollWrapper.animate({"left":"0"});
        }else {
            self.scrollWrapper.animate({"left":"-400px"});
        }
    });
};

Auth.prototype.listenSigninEvent = function(){
    var self = this;
    var signinGroup = $(".signin-group");
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");
    var submitBtn = signinGroup.find(".submit-btn");

    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop("checked");

        xfzajax.post({
            'url':'/account/login/',
            'data':{
                'telephone':telephone,
                'password':password,
                'remember':remember?1:0,
            },
            'success':function (result) {
                self.hideEvent();
                window.location.reload();
            },
        });
    });
};

Auth.prototype.listenSignupEvent = function(){
    var self = this;
    var signupGroup = $(".signup-group");
    var submitBtn = signupGroup.find(".submit-btn");
    submitBtn.click(function (event) {
        event.preventDefault();
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var img_captchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var sms_captchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = img_captchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = sms_captchaInput.val();

        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha,
            },
            'success': function (result) {
                self.hideEvent();
                window.location.reload();
            },
        })
    })
};

Auth.prototype.listenImageCaptcha = function(){
  var imgCaptcha = $(".img-captcha");
  imgCaptcha.click(function () {
      // account/img_captcha/?random=1
      imgCaptcha.attr("src","/account/img_captcha/"+"?random="+Math.random())
  });
};

Auth.prototype.listenSuccessEvent = function(){
    var self = this;
    messageBox.showSuccess("短信验证码发送成功！");
    self.smsCaptcha.addClass("disabled");
    self.smsCaptcha.unbind("click");
    var count = 60;
    var timer = setInterval(function () {
        self.smsCaptcha.text(count+"s");
        count --;
        if (count<=0) {
            clearInterval(timer);
            self.smsCaptcha.removeClass("disabled");
            self.smsCaptcha.text("发送验证码");
            self.listenSmsCaptcha();
        }
    },1000)
};

Auth.prototype.listenSmsCaptcha = function(){
    var self = this;
    var telephoneInput = $(".signup-group input[name=telephone]");
    self.smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if (!telephone){
            messageBox.showInfo("请输入手机号码！");
        }
        xfzajax.get({
            'url': '/account/sms_captcha/',
            'data':{
                'telephone': telephone
            },
            'success': function (result) {
                self.listenSuccessEvent();
            },
        })
    })
};

Auth.prototype.run = function () {
    var self = this;
    self.listenShowHide();
    self.listenSwitchEvent();
    self.listenSigninEvent();
    self.listenImageCaptcha();
    self.listenSmsCaptcha();
    self.listenSignupEvent();
};

$(function () {
    var auth = new Auth();
    auth.run();
});


$(function () {
    var frontBase = new FrontBase();
    frontBase.listenAuthBoxHover();
});

$(function () {
    if (window.template) {
        template.defaults.imports.timeSince = function (timeValue) {
            var date = new Date(timeValue);
            var dates = date.getTime();
            var nowts = (new Date()).getTime();// 获取当前时间
            var timestamp = (nowts-dates)/1000;
            if (timestamp < 60)
                return '刚刚';
            else if (60 <= timestamp && timestamp < 60 * 60) {
                var minutes = parseInt(timestamp / 60);
                return minutes+'分钟前';
            } else if (60 * 60 <= timestamp && timestamp< 60 * 60 * 24) {
                var hours = parseInt(timestamp / 60 / 60);
                return hours+'小时前';
            } else if (60 * 60 * 24 <= timestamp && timestamp< 60 * 60 * 24 * 30) {
                var days = parseInt(timestamp / 60 / 60 / 24);
                return days+'天前';
            } else {
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                return year+"/"+month+"/"+day+"/"+hour+":"+minute;
            }

        }
    }
});