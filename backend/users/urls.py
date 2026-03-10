from django.urls import path
from . import views
from . import admin_views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('admin/stats/', admin_views.admin_stats, name='admin_stats'),
    path('admin/emotions/', admin_views.admin_emotion_trends, name='admin_emotions'),
    path('admin/escalations/', admin_views.admin_escalations, name='admin_escalations'),
    path('admin/escalations/<int:alert_id>/acknowledge/', admin_views.acknowledge_escalation, name='acknowledge_escalation'),
]
