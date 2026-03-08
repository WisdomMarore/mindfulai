from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import EscalationAlert
from .serializers import EscalationSerializer
from .logic import calculate_escalation_tier
from mindfulness_sessions.models import MindfulnessSession

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_escalation(request):
    sessions = MindfulnessSession.objects.filter(
        user=request.user
    ).order_by('-started_at')

    tier, message = calculate_escalation_tier(list(sessions))

    # Save alert only if tier 2 or above
    if tier >= 2:
        EscalationAlert.objects.create(
            user=request.user,
            tier=tier,
            message=message
        )

    return Response({
        'tier': tier,
        'message': message,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def acknowledge_alert(request, alert_id):
    try:
        alert = EscalationAlert.objects.get(id=alert_id, user=request.user)
        alert.acknowledged = True
        alert.save()
        return Response({'status': 'acknowledged'})
    except EscalationAlert.DoesNotExist:
        return Response({'error': 'Alert not found'}, status=404)