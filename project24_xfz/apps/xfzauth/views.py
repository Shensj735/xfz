from django.contrib.auth import login, logout, authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from utils import restful
from django.shortcuts import reverse, redirect
from django.http import HttpResponse
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from utils.aliyunsdk import aliyunsms
from django.core.cache import cache
# get_user_model 会读取setting文件中AUTH_USER_MODEL = 'xfzauth.User'中User模型 等价于from .models import User
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()
# 参考返回的Json数据格式
# {'code': '200', 'message': '', 'data': {}, **kwargs}


@require_POST
@csrf_exempt
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, telephone=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth_error(message="你的账号已冻结")
        else:
            return restful.params_error(message="账号或密码错误")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
@csrf_exempt
def register_view(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message=form.get_errors())


def img_captcha(request):
    text, image = Captcha.gene_code()
    out = BytesIO()
    image.save(out, 'png')
    out.seek(0)
    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    response['Content-length'] = out.tell()
    cache.set(text.lower(), text.lower(), 60*5)
    return response


def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    # 在调试阶段为了方便就不发送验证码了，直接在控制台打印出来
    result = aliyunsms.send_sms(telephone, code)
    print(code)
    cache.set(telephone, code, 60)
    return restful.ok()


def cache_test(request):
    cache.set('username', 'ssj')
    result = cache.get('username')
    print(result)
    return HttpResponse("success")
