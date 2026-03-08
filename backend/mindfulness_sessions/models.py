from django.db import models
from django.conf import settings

class MindfulnessSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    emotion_detected = models.CharField(max_length=50)
    confidence = models.FloatField(default=0.0)
    activity_title = models.CharField(max_length=200)
    activity_category = models.CharField(max_length=100)
    started_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.emotion_detected} - {self.started_at.date()}"
