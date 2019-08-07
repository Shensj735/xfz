from django.shortcuts import render
from django.views.generic import View
from apps.course.models import Course, CourseCategory, Teacher
from .forms import PubCourseForm
from utils import restful
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required


@method_decorator(permission_required(perm='course.change_course', login_url='index'), name='dispatch')
class PubCourseView(View):
    def get(self, request):
        context = {
            'categories': CourseCategory.objects.all(),
            'teachers': Teacher.objects.all()
        }
        return render(request, 'cms/pub_course.html', context=context)

    def post(self, request):
        form = PubCourseForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            category_id = form.cleaned_data.get('category')
            teacher_id = form.cleaned_data.get('teacher')
            video_url = form.cleaned_data.get('video_url')
            cover_url = form.cleaned_data.get('cover_url')
            price = form.cleaned_data.get('price')
            profile = form.cleaned_data.get('profile')
            duration = form.cleaned_data.get('duration')

            category = CourseCategory.objects.get(pk=category_id)
            teacher = Teacher.objects.get(pk=teacher_id)

            Course.objects.create(title=title, category=category, teacher=teacher, video_url=video_url,
                                  cover_url=cover_url, price=price, profile=profile, duration=duration)
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())

