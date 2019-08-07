from django import forms
from apps.forms import FormMixin
from apps.news.models import News, Banners
from apps.course.models import Course


class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={'Min_length': "pk值不能为空"})
    name = forms.CharField(max_length=20)


class WriteNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['pub_time', 'category', 'author']


class EditNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()
    pk = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['pub_time', 'category', 'author']


class AddBannersForm(forms.ModelForm, FormMixin):
    class Meta:
        model = Banners
        fields = ['priority', 'link_to', 'image_url']


class EditBannerForm(forms.ModelForm, FormMixin):
    pk = forms.IntegerField()

    class Meta:
        model = Banners
        fields = ['priority', 'link_to', 'image_url']


class PubCourseForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()
    teacher = forms.IntegerField()

    class Meta:
        model = Course
        exclude = ['category', 'teacher']
