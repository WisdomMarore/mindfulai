from rest_framework import serializers
from .models import EscalationAlert

class EscalationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationAlert
        fields = ['id', 'tier', 'message', 'created_at', 'acknowledged']