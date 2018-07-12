from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^ajax/choose_move/$', views.choose_move, name='choose_move'),
]