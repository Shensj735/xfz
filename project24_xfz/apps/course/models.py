from django.db import models
from shortuuidfield import ShortUUIDField


class CourseCategory(models.Model):
    name = models.CharField(max_length=100)


class Teacher(models.Model):
    username = models.CharField(max_length=100)
    avatar = models.URLField()
    position = models.CharField(max_length=100)
    profile = models.TextField()


class Course(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey('CourseCategory', on_delete=models.DO_NOTHING)
    teacher = models.ForeignKey('Teacher', on_delete=models.DO_NOTHING)
    video_url = models.URLField()
    cover_url = models.URLField()
    price = models.FloatField()
    profile = models.TextField()
    duration = models.IntegerField()
    pub_time = models.DateTimeField(auto_now_add=True)


class CourseOrder(models.Model):
    uid = ShortUUIDField(primary_key=True)
    course = models.ForeignKey('Course', on_delete=models.DO_NOTHING)
    buyer = models.ForeignKey('xfzauth.User', on_delete=models.DO_NOTHING)
    amount = models.FloatField(default=0)
    pub_time = models.DateTimeField(auto_now_add=True)
    # 1：代表支付宝支付 2：代表微信支付
    istype = models.SmallIntegerField(default=0)
    # 1：代表未支付，0：代表已支付
    status = models.SmallIntegerField(default=1)

