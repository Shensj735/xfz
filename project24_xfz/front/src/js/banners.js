function Banners() {

}

Banners.prototype.listenImageSelectEvent = function(bannerItem){
    var image = bannerItem.find(".thumbnail");
    var imageInput = bannerItem.find(".image-input");
    image.click(function () {
        imageInput.click();
    });
    imageInput.change(function () {
        var file = this.files[0];
        var formData = new FormData();
        formData.append("file", file);
        xfzajax.post( {
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200) {
                    var url = result['data']['url'];
                    image.attr("src", url);
                }
            }
        })
    })
};

Banners.prototype.listenCloseBtnEvent = function(bannerItem){
    var closeBtn = bannerItem.find(".close-btn");
    var bannerId = bannerItem.attr("banner-id");
    closeBtn.click(function () {
        if (bannerId){
            xfzalert.alertConfirm( {
                'text': "确定要删除该轮播图吗？",
                'confirmCallback': function () {
                    console.log("删除成功");
                    xfzajax.post({
                        'url': '/cms/delete_banner/',
                        'data': {
                            'banner_id':bannerId
                        },
                        'success': function (result) {
                            if (result['code'] === 200){
                                xfzalert.alertSuccess("轮播图删除成功！",function () {
                                    bannerItem.remove();
                                });
                            }
                        }
                    })
                }
            })
        } else {
            bannerItem.remove();
        }
    })
};

Banners.prototype.listenAddBannerSaveEvent = function(bannerItem){
    var saveBtn = bannerItem.find(".save-btn");
    var priorityTag = bannerItem.find("input[name='priority']");
    var linkToTag = bannerItem.find("input[name='link_to']");
    var imagelTag = bannerItem.find(".thumbnail");
    var prioritySpan = bannerItem.find(".priority");
    var banner_id = bannerItem.attr("banner-id");
    var url = '';
    if (banner_id){
        url = '/cms/edit_banner/';
    }else {
        url = '/cms/add_banners/'
    }
    saveBtn.click(function () {
        var priority = priorityTag.val();
        var linkTo = linkToTag.val();
        var imageUrl = imagelTag.attr("src");
        xfzajax.post({
            'url': url,
            'data': {
                'priority': priority,
                'link_to': linkTo,
                'image_url': imageUrl,
                'pk': banner_id,
            },
            'success': function (result) {
                if (result['code'] === 200){
                    if (banner_id){
                        xfzalert.alertSuccess("轮播图修改成功！", function () {
                        })
                    } else {
                        banner_id = result['data']['banner_id'];
                        xfzalert.alertSuccess("轮播图添加成功！", function () {
                            bannerItem.attr("banner-id", banner_id)
                        })
                    }
                     prioritySpan.text("优先级："+priority);
                }
            }
        })
    })
};

Banners.prototype.listenAddBtnEvent = function(){
    var self = this;
    var addBtn = $("#add-banners-btn");
    var bannerGroup = $(".banners-list-group");
    addBtn.click(function () {
        var length = bannerGroup.children().length;
        if(length>=6) {
            window.messageBox.showInfo("最多只能添加6张轮播图！");
            return;
        }
        self.createBannerItem();
    })
};

Banners.prototype.loadBannerEvent = function(){
    var self = this;
    xfzajax.get({
        'url': '/cms/banner_list/',
        'success': function (result) {
           if (result['code'] === 200){
               var banners = result['data'];
               for (var i=0;i<banners.length; i++){
                   var banner = banners[i];
                   self.createBannerItem(banner);
               }
           }
        }
    });
};

Banners.prototype.createBannerItem = function(banner){
    var self = this;
    var bannersListGroup = $(".banners-list-group");
    var tpl = template("banners-group" ,{"banners": banner});
    var bannerItem = null;
    if (banner){
        bannersListGroup.append(tpl);
        bannerItem = bannersListGroup.find(".banner-item:last");
    }else {
        bannersListGroup.prepend(tpl);
        bannerItem = bannersListGroup.find(".banner-item:first");
    }
    self.listenImageSelectEvent(bannerItem);
    self.listenCloseBtnEvent(bannerItem);
    self.listenAddBannerSaveEvent(bannerItem);
    // self.listenEditBannerEvent(bannerItem);
};

// Banners.prototype.listenEditBannerEvent = function(bannerItem){
//     var editBtn = bannerItem.find(".edit-btn");
//     var priorityTag = bannerItem.find("input[name='priority']");
//     var linkToTag = bannerItem.find("input[name='link_to']");
//     var imagelTag = bannerItem.find(".thumbnail");
//     var banner_id = bannerItem.attr("banner-id");
//     editBtn.click(function () {
//         var priority = priorityTag.val();
//         var linkTo = linkToTag.val();
//         var imageUrl = imagelTag.attr("src");
//         xfzajax.post({
//             'url': '/cms/edit_banner/',
//             'data': {
//                 'priority': priority,
//                 'link_to': linkTo,
//                 'image_url': imageUrl,
//                 'pk': banner_id,
//             },
//             'success': function (result) {
//                 if (result['code'] === 200){
//                     xfzalert.alertSuccess("轮播图修改成功", function () {
//                         window.location.reload();
//                     })
//                 }
//             }
//         })
//     })
// };

Banners.prototype.run = function () {
    var self = this;
    self.listenAddBtnEvent();
    self.loadBannerEvent();
};

$(function () {
    var banners = new Banners();
    banners.run();
});