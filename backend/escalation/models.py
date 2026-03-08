from django.db import models
from django.conf import settings

class EscalationAlert(models.Model):
    TIER_CHOICES = [
        (1, 'Green - Normal'),
        (2, 'Yellow - Mild Concern'),
        (3, 'Orange - Moderate Concern'),
        (4, 'Red - Crisis'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='escalations')
    tier = models.IntegerField(choices=TIER_CHOICES, default=1)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    acknowledged = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Tier {self.tier} - {self.created_at.date()}"