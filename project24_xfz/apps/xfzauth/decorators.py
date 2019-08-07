from utils import restful
from django.shortcuts import redirect
from functools import wraps
from django.http import Http404


def xfz_login_required(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        else:
            if request.is_ajax():
                return restful.unauth_error(message="请先登录！")
            else:
                return redirect('/')
    return wrapper


def xfz_superuser_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise Http404()
    return wrapper
