from django.urls import path
from . import views

urlpatterns = [
    path('', views.posts, name='posts'),
    path('<int:post_id>/reply/', views.reply_to_post, name='reply_to_post'),
    path('<int:post_id>/delete/', views.delete_post, name='delete_post'),
]