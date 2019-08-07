from apps.payinfo.models import PayinfoOrder
from django import template

register = template.Library()


@register.filter
def is_buyed(payinfo, user):
    if user.is_authenticated:
        result = PayinfoOrder.objects.filter(payinfo=payinfo, buyer=user, status=0).exists()
        return result
    else:
        return False