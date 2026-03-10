from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from mindfulness_sessions.models import MindfulnessSession
from escalation.models import EscalationAlert
from collections import Counter
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    total_users = User.objects.filter(is_active=True).count()
    total_sessions = MindfulnessSession.objects.count()
    completed_sessions = MindfulnessSession.objects.filter(completed=True).count()
    total_escalations = EscalationAlert.objects.count()
    critical_escalations = EscalationAlert.objects.filter(tier=4, acknowledged=False).count()
    high_escalations = EscalationAlert.objects.filter(tier=3, acknowledged=False).count()

    # Sessions in last 7 days
    week_ago = timezone.now() - timedelta(days=7)
    recent_sessions = MindfulnessSession.objects.filter(started_at__gte=week_ago).count()

    # New users in last 7 days
    recent_users = User.objects.filter(date_joined__gte=week_ago).count()

    return Response({
        'total_users': total_users,
        'total_sessions': total_sessions,
        'completed_sessions': completed_sessions,
        'total_escalations': total_escalations,
        'critical_escalations': critical_escalations,
        'high_escalations': high_escalations,
        'recent_sessions': recent_sessions,
        'recent_users': recent_users,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_emotion_trends(request):
    # Anonymised emotion counts across all users
    sessions = MindfulnessSession.objects.all()
    emotion_counts = Counter(s.emotion_detected for s in sessions)

    # Sessions per day for last 7 days
    daily_data = []
    for i in range(6, -1, -1):
        day = timezone.now() - timedelta(days=i)
        count = MindfulnessSession.objects.filter(
            started_at__date=day.date()
        ).count()
        daily_data.append({
            'date': day.strftime('%d %b'),
            'sessions': count,
        })

    return Response({
        'emotion_counts': dict(emotion_counts),
        'daily_sessions': daily_data,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_escalations(request):
    # Show unacknowledged escalations tier 2 and above
    # Anonymised — no usernames exposed
    alerts = EscalationAlert.objects.filter(
        acknowledged=False,
        tier__gte=2
    ).order_by('-tier', '-created_at')[:20]

    data = [{
        'id': a.id,
        'tier': a.tier,
        'message': a.message,
        'created_at': a.created_at,
        'acknowledged': a.acknowledged,
    } for a in alerts]

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def acknowledge_escalation(request, alert_id):
    try:
        alert = EscalationAlert.objects.get(id=alert_id)
        alert.acknowledged = True
        alert.save()
        return Response({'status': 'acknowledged'})
    except EscalationAlert.DoesNotExist:
        return Response({'error': 'Alert not found'}, status=404)