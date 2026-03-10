import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { communityAPI } from '../api/client';

const emotionEmoji = {
  happy: '😊', sad: '😢', angry: '😠',
  fearful: '😨', disgusted: '🤢', surprised: '😲', neutral: '😐',
};

const emotionColors = {
  happy: 'bg-yellow-400 bg-opacity-20 text-yellow-300 border-yellow-400 border-opacity-30',
  sad: 'bg-blue-400 bg-opacity-20 text-blue-300 border-blue-400 border-opacity-30',
  angry: 'bg-red-400 bg-opacity-20 text-red-300 border-red-400 border-opacity-30',
  fearful: 'bg-green-400 bg-opacity-20 text-green-300 border-green-400 border-opacity-30',
  disgusted: 'bg-purple-400 bg-opacity-20 text-purple-300 border-purple-400 border-opacity-30',
  surprised: 'bg-orange-400 bg-opacity-20 text-orange-300 border-orange-400 border-opacity-30',
  neutral: 'bg-gray-400 bg-opacity-20 text-gray-300 border-gray-400 border-opacity-30',
};

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [emotionTag, setEmotionTag] = useState('neutral');
  const [posting, setPosting] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchPosts = async () => {
    try {
      const res = await communityAPI.getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await communityAPI.createPost({
        content: newPost,
        emotion_tag: emotionTag,
      });
      setNewPost('');
      setEmotionTag('neutral');
      fetchPosts();
    } catch (err) {
      console.error('Failed to post:', err);
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (postId) => {
    if (!replyText[postId]?.trim()) return;
    try {
      await communityAPI.replyToPost(postId, { content: replyText[postId] });
      setReplyText({ ...replyText, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Failed to reply:', err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await communityAPI.deletePost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const emotions = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Community</h2>
          <p className="text-blue-300 text-sm mt-1">A safe space to share and support each other.</p>
        </div>

        {/* New Post Box */}
        <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium text-white mb-3">Share how you're feeling</p>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write something supportive or share your experience..."
            rows={3}
            className="w-full bg-white bg-opacity-10 border border-white border-opacity-10 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          {/* Emotion Tag Selector */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {emotions.map((e) => (
              <button
                key={e}
                onClick={() => setEmotionTag(e)}
                className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition border ${
                  emotionTag === e
                    ? emotionColors[e]
                    : 'bg-white bg-opacity-5 text-blue-300 border-white border-opacity-10 hover:bg-opacity-10'
                }`}
              >
                {emotionEmoji[e]} {e}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={posting || !newPost.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl text-sm hover:bg-blue-400 transition disabled:opacity-50"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <p className="text-blue-300 text-center animate-pulse">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-12 text-center text-blue-300">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-20 transition"
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center text-white font-semibold text-sm">
                      {post.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{post.username}</p>
                      <p className="text-xs text-blue-300">
                        {new Date(post.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.emotion_tag && (
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${emotionColors[post.emotion_tag] || emotionColors.neutral}`}>
                        {emotionEmoji[post.emotion_tag]} {post.emotion_tag}
                      </span>
                    )}
                    {post.username === currentUser?.username && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 text-xs hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-blue-100 text-sm leading-relaxed mb-4">{post.content}</p>

                {/* Reply Toggle */}
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="text-xs text-blue-300 hover:text-blue-200 transition"
                >
                  💬 {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'} · {expandedPost === post.id ? 'Hide' : 'Show'}
                </button>

                {/* Replies Section */}
                {expandedPost === post.id && (
                  <div className="mt-4">
                    {post.replies.length > 0 && (
                      <div className="flex flex-col gap-3 mb-4">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-white border-opacity-10">
                            <div className="w-7 h-7 rounded-full bg-purple-500 bg-opacity-30 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                              {reply.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">{reply.username}</p>
                              <p className="text-xs text-blue-200 mt-0.5">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Write a supportive reply..."
                        value={replyText[post.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                        className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-10 rounded-xl px-3 py-2 text-xs text-white placeholder-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => handleReply(post.id)}
                        disabled={!replyText[post.id]?.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs hover:bg-blue-400 transition disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
