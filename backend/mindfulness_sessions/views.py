from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MindfulnessSession
from .serializers import SessionSerializer
from .ml_engine import get_recommendation

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_session(request):
    serializer = SessionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_history(request):
    sessions = MindfulnessSession.objects.filter(
        user=request.user
    ).order_by('-started_at')
    serializer = SessionSerializer(sessions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommend(request):
    emotion = request.GET.get('emotion', 'neutral')
    sessions = list(MindfulnessSession.objects.filter(
        user=request.user
    ).order_by('-started_at'))

    result = get_recommendation(sessions, emotion)

    return Response({
        'activity_title': result['activity']['title'],
        'activity_category': result['activity']['category'],
        'method': result['method'],
        'sessions_until_ml': result['sessions_until_ml'],
    })