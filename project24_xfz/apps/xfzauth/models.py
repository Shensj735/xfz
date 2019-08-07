from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from shortuuidfield import ShortUUIDField


class UserManager(BaseUserManager):
    def _create_user(self, username, telephone, password, **kwargs):
        if not username:
            raise ValueError("需要传递一个email")
        if not telephone:
            raise ValueError("需要传递一个telephone")
        if not password:
            raise ValueError("需要传递一个password")
        user = self.model(username=username, telephone=telephone, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, username, telephone, password, **kwargs):
        kwargs['is_superuser'] = False
        return self._create_user(username, telephone, password, **kwargs)

    def create_superuser(self, username, telephone, password, **kwargs):
        kwargs['is_superuser'] = True
        kwargs['is_staff'] = True
        return self._create_user(username, telephone, password, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    # 使用short uuid作为主键，
    # Shortuuidfield安装命令:pip install django-shortuuidfield
    uid = ShortUUIDField(primary_key=True, unique=True)
    email = models.EmailField(unique=True, null=True)
    telephone = models.CharField(max_length=11, unique=True)
    username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    data_join = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = ['username']
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username



