function Banner() {
    this.bannergroup = $("#banner-group");
    this.index = 1;
    this.bannerWidth = 798;
    this.prevArrow = $(".arrow-prev");
    this.nextArrow = $(".arrow-next");
    this.bannerUI = $("#banner-ul");
    this.pageControl = $(".page-control");
    this.bannerCount = this.bannerUI.children('li').length;
    this.listenBannerHover();
}

Banner.prototype.initBanner = function(){
    this.bannerUI.css({"width":this.bannerWidth*this.bannerCount});
    var firstBanner = this.bannerUI.children("li").eq(0).clone();
    var lastBanner = this.bannerUI.children("li").eq(this.bannerCount-1).clone();
    this.bannerUI.append(firstBanner);
    this.bannerUI.prepend(lastBanner);
    this.bannerUI.css({"width":this.bannerWidth*(this.bannerCount+2),"left":-this.bannerWidth})
};

Banner.prototype.animate= function(){
    var index;
    this.bannerUI.animate({"left": -798 * this.index},1000);
    if(this.index===0){
        index = this.bannerCount - 1;
    }else if(this.index===this.bannerCount + 1){
        index = 0;
    }else {
        index = this.index - 1;
    }
    this.pageControl.children("li").addClass("active").eq(index).siblings("li").removeClass("active");
};

Banner.prototype.loop = function(){
    var self = this;
    // bannerUI.css({"left": -798});
    self.timer = setInterval(function () {

        if(self.index>=self.bannerCount+1){
            self.bannerUI.css({"left":-self.bannerWidth});
            self.index=2;
        }else {
            self.index++
        }
        self.animate();
    },3500);
};

Banner.prototype.toggleArrow = function(isShow){
    if(isShow){
        this.prevArrow.show();
        this.nextArrow.show();
    }
    else{
        this.prevArrow.hide();
        this.nextArrow.hide();
    }
};

Banner.prototype.initPageControl = function(){

    for (var i = 0; i < this.bannerCount; i++) {
        var circle = $("<li></li>");
        this.pageControl.append(circle);
        if(i === 0){
            circle.addClass("active");
        }
    }
    this.pageControl.css({"width":12*this.bannerCount+8*2+16*(this.bannerCount-1)})
};

Banner.prototype.listenBannerHover = function(){
    var self = this;
    this.bannergroup.hover(function () {
        clearInterval(self.timer);
        self.toggleArrow(true);

    }, function () {
        self.loop();
        self.toggleArrow(false);
    })
};

Banner.prototype.listenArrowClick = function(){
    var self = this;
    this.prevArrow.click(function () {
        if(self.index === 0){
            self.bannerUI.css({"left":-self.bannerWidth*self.bannerCount});
            self.index = self.bannerCount - 1;
        }else {
            self.index--;
        }
        self.animate();
    });

    this.nextArrow.click(function () {
        if(self.index === self.bannerCount + 1){
            self.bannerUI.css({"left":-self.bannerWidth})
            self.index = 2;
        }else {
            self.index++ ;
        }
        self.animate();
    });
};

Banner.prototype.listenPageControl = function(){
    var self = this;
    this.pageControl.children("li").each(function (index, obj) {
        $(obj).click(function () {
            self.index = index + 1;
            self.animate();
        });
    })
};

Banner.prototype.run = function () {
    this.initBanner();
    this.loop();
    this.listenArrowClick();
    this.initPageControl();
    this.listenPageControl();
};

function Index(){
    this.loadMoreBtn = $("#load-more-btn");
    this.ul = $(".list-inner-group");
    this.page = 2;
    this.category_id = 0;
}

Index.prototype.listenLoadMoreEvent = function(){
    var self = this;
    self.loadMoreBtn.click(function () {
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.page,
                'category_id': self.category_id,
            },
            'success': function (result) {
                if (result['code'] === 200){
                    if (result['data'].length>0){
                        var newses = result['data'];
                        var tpl = template("news-item", {"newses": newses});
                        self.ul.append(tpl);
                        self.page++;
                    }else {
                        self.loadMoreBtn.hide();
                    }
                }
            }
        });
    });
};

Index.prototype.listenCategorySwitchEvent = function(){
    var self = this;
    var listitem = $(".list-item");
    listitem.children().click(function () {
        // 当前选中的li标签
        var currentLi = $(this);
        var category_id = currentLi.attr("data-category");
        var page = 1;
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'category_id': category_id,
                'p': page,
            },
            'success': function (result) {
                if (result['code'] === 200){
                    var newses = result['data'];
                    var tpl = template("news-item", {"newses": newses});
                    // 将当前标签下的所有子元素删除
                    self.ul.empty();
                    self.ul.append(tpl);
                    self.page=2;
                    self.category_id = category_id;
                    currentLi.addClass('active').siblings().removeClass('active');
                    self.loadMoreBtn.show();
                    console.log("success");
                }
            }
        });
    });
};

Index.prototype.run = function(){
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};

$(function () {
    var banner = new Banner();
    banner.run();

    var index = new Index();
    index.run();
});
    

