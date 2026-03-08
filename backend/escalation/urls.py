from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_escalation, name='get_escalation'),
    path('<int:alert_id>/acknowledge/', views.acknowledge_alert, name='acknowledge_alert'),
]