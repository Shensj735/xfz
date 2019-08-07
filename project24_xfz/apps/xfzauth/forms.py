from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(min_length=6, max_length=10,
                               error_messages={"min_length": "密码长度应不少于6个字符", "max_length": "密码长度应不多于10个字符"})
    remember = forms.IntegerField(required=False)


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(min_length=6, max_length=10,
                                error_messages={"min_length": "密码长度应不少于6个字符", "max_length": "密码长度应不多于10个字符"})
    password2 = forms.CharField(min_length=6, max_length=10,
                                error_messages={"min_length": "密码长度应不少于6个字符", "max_length": "密码长度应不多于10个字符"})
    img_captcha = forms.CharField(min_length=4, max_length=4)
    sms_captcha = forms.CharField(min_length=4, max_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError("两次密码输入不一致")

        cleaned_img_captcha = cleaned_data.get('img_captcha')
        cache_img_captcha = cache.get(cleaned_img_captcha.lower())
        if not cache_img_captcha or cleaned_img_captcha.lower() != cache_img_captcha.lower():
            raise forms.ValidationError("图形验证码错误")

        telephone = cleaned_data.get('telephone')
        cleaned_sms_captcha = cleaned_data.get('sms_captcha')
        cache_sms_captcha = cache.get(telephone)
        if not cache_sms_captcha or cleaned_sms_captcha.lower() != cache_sms_captcha.lower():
            raise forms.ValidationError("手机验证码错误")

        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            raise forms.ValidationError("该手机号码已被注册")
