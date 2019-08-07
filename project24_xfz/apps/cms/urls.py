from django.urls import path
from . import views
from . import courses_views
from . import staff_views

app_name = 'cms'

urlpatterns = [
    path('index/', views.index, name='index'),
    path('write_news/', views.WriteNewsView.as_view(), name='write_news'),
    path('news_category/', views.news_category, name='news_category'),
    path('add_news_category/', views.add_news_category, name='add_news_category'),
    path('edit_news_category/', views.edit_news_category, name='edit_news_category'),
    path('delete_news_category/', views.delete_news_category, name='delete_news_category'),
    path('upload_file/', views.upload_file, name='upload_file'),
    path('qntoken/', views.qntoken, name='qntoken'),
    path('banners/', views.banners, name='banners'),
    path('add_banners/', views.add_banners, name='add_banners'),
    path('banner_list/', views.banner_list, name='banner_list'),
    path('delete_banner/', views.delete_banner, name='delete_banner'),
    path('edit_banner/', views.edit_banner, name='edit_banner'),
    path('news_list/', views.NewsListView.as_view(), name='news_list'),
    path('edit_news/', views.EditNewsView.as_view(), name='edit_news'),
    path('delete_news/', views.delete_news, name='delete_news'),
]

# 这是课程相关的url
urlpatterns += [
    path('pub_course/', courses_views.PubCourseView.as_view(), name='pub_course'),
]

# 员工管理相关
urlpatterns += [
    path('staffs/', staff_views.staffs_view, name='staffs'),
    path('add_staff/', staff_views.AddStaffView.as_view(), name='add_staff'),
]

