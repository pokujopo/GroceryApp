from django.urls import path
from . import views

app_name = "videos"

urlpatterns = [
    path('', views.index, name='index'),
    path('watch/<int:slug>/', views.watch, name='watch'), # Inasoma ID kupitia slug/int
    path('trigger-scraper/', views.trigger_scraper, name='trigger_scraper'),
]
