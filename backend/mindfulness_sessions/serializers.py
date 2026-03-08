from rest_framework import serializers
from .models import MindfulnessSession

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MindfulnessSession
        fields = ['id', 'emotion_detected', 'confidence', 'activity_title', 'activity_category', 'started_at', 'completed']