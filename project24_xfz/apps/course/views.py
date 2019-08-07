from django.shortcuts import render
from .models import Course, CourseOrder
from utils import restful
from django.conf import settings
import os, time, hashlib, hmac
from hashlib import md5
from apps.xfzauth.decorators import xfz_login_required
from django.shortcuts import reverse
from django.views.decorators.csrf import csrf_exempt


def course_index(request):
    context = {
        'courses': Course.objects.select_related('teacher', 'category').all(),
    }
    return render(request, 'course/course_index.html', context=context)


def course_detail(request, course_id):
    course = Course.objects.get(pk=course_id)
    buyed = CourseOrder.objects.filter(course=course, buyer=request.user, status=0).exists()
    context = {
        'courses': Course.objects.select_related('teacher', 'category').get(pk=course_id),
        'buyed': buyed
    }
    return render(request, 'course/course_detail.html', context=context)


def course_token(request):
    course_id = request.GET.get('course_id')
    if not CourseOrder.objects.filter(course_id=course_id, buyer=request.user, status=0).exists():
        return restful.unauth_error(message="请先购买课程!")
    # video：是视频文件的完整链接
    file = request.GET.get('video_url')

    expiration_time = int(time.time()) + 2 * 60 * 60

    USER_ID = settings.BAIDU_CLOUD_USER_ID
    USER_KEY = settings.BAIDU_CLOUD_USER_KEY

    # file=http://hemvpc6ui1kef2g0dd2.exp.bcevod.com/mda-igjsr8g7z7zqwnav/mda-igjsr8g7z7zqwnav.m3u8
    extension = os.path.splitext(file)[1]
    media_id = file.split('/')[-1].replace(extension, '')

    # unicode->bytes=unicode.encode('utf-8')bytes
    key = USER_KEY.encode('utf-8')
    message = '/{0}/{1}'.format(media_id, expiration_time).encode('utf-8')
    signature = hmac.new(key, message, digestmod=hashlib.sha256).hexdigest()
    token = '{0}_{1}_{2}'.format(signature, USER_ID, expiration_time)
    return restful.result(data={'token': token})


@xfz_login_required
def course_order(request, course_id):
    course = Course.objects.get(pk=course_id)
    order = CourseOrder.objects.create(course=course, buyer=request.user, amount=course.price, status=1)
    context = {
        'goods': {
            'thumbnail': course.cover_url,
            'title': course.title,
            'price': course.price
        },
        'order': order,
        'notify_url': request.build_absolute_uri(reverse('course:course_notify_url')),
        'return_url': request.build_absolute_uri(reverse('course:detail', kwargs={'course_id': course.pk}))
    }
    return render(request, 'course/course_order.html', context=context)


@xfz_login_required
def course_order_key(request):
    goodsname = request.POST.get('goodsname')
    price = request.POST.get('price')
    istype = request.POST.get('istype')
    notify_url = request.POST.get('notify_url')
    return_url = request.POST.get('return_url')
    uid = '1c4b87e1be21e9ec28c0e783'
    token = '047b1f9648b6c8ea7138c15bc36beb7d'
    orderid = request.POST.get('orderid')
    orderuid = str(request.user.pk)
    key = md5((goodsname + istype + notify_url + orderid + orderuid + price + return_url + token + uid)
              .encode("utf-8")).hexdigest()
    return restful.result(data={"key": key})


@csrf_exempt
def course_notify_url(request):
    orderid = request.POST.get('orderid')
    print('=' * 30)
    print(orderid)
    print('=' * 30)
    CourseOrder.objects.filter(pk=orderid).update(status=0)
    return restful.ok()


