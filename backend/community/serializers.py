from rest_framework import serializers
from .models import Post, Reply

class ReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Reply
        fields = ['id', 'username', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    reply_count = serializers.IntegerField(source='replies.count', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'username', 'content', 'emotion_tag', 'created_at', 'replies', 'reply_count']