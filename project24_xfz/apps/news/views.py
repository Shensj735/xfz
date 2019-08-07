from django.shortcuts import render
from .models import News, NewsCategory, Comment
from django.conf import settings
from .serializers import NewsSerializers, CommentSerializers
from utils import restful
from django.http import Http404
from .forms import PublicCommentForm
from apps.xfzauth.decorators import xfz_login_required
from django.db.models import Q


def index(request):
    count = settings.LOAD_PAGE_NEWS_COUNT
    categories = NewsCategory.objects.all()
    newses = News.objects.select_related('category', 'author').all()[0:count]
    context = {
        'categories': categories,
        'newses': newses
    }
    return render(request, 'news/index.html', context=context)


def news_list(request):
    page = int(request.GET.get('p', 1))
    # 默认显示最新新闻，不对新闻进行分类
    category_id = int(request.GET.get('category_id', 0))
    count = settings.LOAD_PAGE_NEWS_COUNT
    start = ((page-1) * count)
    end = page * count
    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category__id=category_id)[start:end]
    serializers = NewsSerializers(newses, many=True)
    data = serializers.data
    return restful.result(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category', 'author').prefetch_related('comments__author').get(pk=news_id)
        """
        news2 = News.objects.filter(pk=news_id)
        print('news', news, type(news))
        news News object (1 )  ===>  <class 'apps.news.models.News'>
        ===================================================
        ===================================================
        print('news2', news2, type(news2))
        news2 <QuerySet [<News: News object (1)>]>)  ===>  <class 'django.db.models.query.QuerySet'>
        """
        context = {
            'news': news
        }
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        raise Http404


@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        content = form.cleaned_data.get('content')
        news_id = form.cleaned_data.get('news_id')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, author=request.user, news=news)
        serializer = CommentSerializers(comment)
        return restful.result(data=serializer.data)
    else:
        return restful.params_error(message=form.get_errors())


def search(request):
    q = request.GET.get('q')
    context = {}
    if q:
        newses = News.objects.filter(Q(title__icontains=q) | Q(desc__icontains=q))
        context['newses'] = newses
    return render(request, 'search/search.html', context=context)

