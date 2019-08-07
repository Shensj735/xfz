from rest_framework import serializers
from .models import User


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['uid', 'email', 'telephone', 'username', 'is_active', 'is_staff']

