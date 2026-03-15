from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from mindfulness_sessions.models import MindfulnessSession
from mindfulness_sessions.serializers import SessionSerializer
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_my_data(request):
    sessions = MindfulnessSession.objects.filter(user=request.user)
    serializer = SessionSerializer(sessions, many=True)
    data = {
        'username': request.user.username,
        'email': request.user.email,
        'date_joined': str(request.user.date_joined),
        'sessions': serializer.data,
        'privacy_note': 'No images or biometric data was ever stored. Only emotion labels and activity titles.',
    }
    return Response(data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_my_account(request):
    user = request.user
    user.delete()
    return Response({'status': 'Account and all associated data permanently deleted.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def make_admin(request):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(username=request.data.get('username'))
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return Response({'status': f'{user.username} is now admin'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)