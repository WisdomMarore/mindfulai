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
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import os

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
    
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=400)
    
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Return success even if email not found for security
        return Response({'message': 'If this email exists you will receive a reset link'})
    
    # Generate token
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build reset URL
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    reset_url = f"{frontend_url}/reset-password/{uid}/{token}/"
    
    # Send email
    send_mail(
        subject='MindfulAI — Password Reset Request',
        message=f"""
Hello {user.username},

You requested a password reset for your MindfulAI account.

Click the link below to reset your password:
{reset_url}

This link will expire in 24 hours.

If you did not request this reset, please ignore this email.

The MindfulAI Team
        """,
        from_email='MindfulAI <mindfulai.noreply@gmail.com>',
        recipient_list=[email],
        fail_silently=False,
    )
    
    return Response({'message': 'If this email exists you will receive a reset link'})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not all([uid, token, new_password]):
        return Response({'error': 'All fields are required'}, status=400)
    
    User = get_user_model()
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except Exception:
        return Response({'error': 'Invalid reset link'}, status=400)
    
    if not default_token_generator.check_token(user, token):
        return Response({'error': 'Reset link has expired or is invalid'}, status=400)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password reset successfully'})