import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from collections import Counter

# All available activities
ACTIVITIES = [
    {'title': 'Box Breathing', 'category': 'breathing'},
    {'title': 'Body Scan Meditation', 'category': 'meditation'},
    {'title': 'Gratitude Reflection', 'category': 'meditation'},
    {'title': 'Progressive Muscle Relaxation', 'category': 'movement'},
    {'title': '5-4-3-2-1 Grounding', 'category': 'grounding'},
    {'title': 'Loving Kindness Meditation', 'category': 'meditation'},
    {'title': 'Mindful Breathing', 'category': 'breathing'},
]

# Default rule-based fallback
DEFAULT_RECOMMENDATIONS = {
    'happy': 'Loving Kindness Meditation',
    'sad': 'Gratitude Reflection',
    'angry': 'Progressive Muscle Relaxation',
    'fearful': 'Box Breathing',
    'disgusted': 'Body Scan Meditation',
    'surprised': '5-4-3-2-1 Grounding',
    'neutral': 'Mindful Breathing',
}

EMOTION_LIST = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral']
ACTIVITY_TITLES = [a['title'] for a in ACTIVITIES]


def get_activity_by_title(title):
    for a in ACTIVITIES:
        if a['title'] == title:
            return a
    return ACTIVITIES[0]


def rule_based_recommendation(emotion):
    title = DEFAULT_RECOMMENDATIONS.get(emotion, 'Mindful Breathing')
    return get_activity_by_title(title)


def ml_recommendation(sessions, current_emotion):
    """
    Train a RandomForest on the user's session history.
    Features: emotion detected
    Target: activity that was used (we treat completed sessions as positive signals)
    """
    try:
        # Only use completed sessions for training
        completed = [s for s in sessions if s.completed]

        if len(completed) < 5:
            return rule_based_recommendation(current_emotion)

        # Encode emotions and activities
        emotion_encoder = LabelEncoder()
        activity_encoder = LabelEncoder()

        emotion_encoder.fit(EMOTION_LIST)
        activity_encoder.fit(ACTIVITY_TITLES)

        # Build training data
        X = []
        y = []

        for session in completed:
            try:
                emotion_encoded = emotion_encoder.transform([session.emotion_detected])[0]
                activity_encoded = activity_encoder.transform([session.activity_title])[0]
                X.append([emotion_encoded, session.confidence])
                y.append(activity_encoded)
            except Exception:
                continue

        if len(X) < 5:
            return rule_based_recommendation(current_emotion)

        X = np.array(X)
        y = np.array(y)

        # Train RandomForest
        model = RandomForestClassifier(n_estimators=50, random_state=42)
        model.fit(X, y)

        # Predict for current emotion
        current_encoded = emotion_encoder.transform([current_emotion])[0]
        prediction = model.predict([[current_encoded, 0.8]])[0]
        predicted_title = activity_encoder.inverse_transform([prediction])[0]

        return get_activity_by_title(predicted_title)

    except Exception as e:
        print(f'ML recommendation failed, falling back to rules: {e}')
        return rule_based_recommendation(current_emotion)


def get_recommendation(sessions, current_emotion):
    """
    Main entry point — uses ML if enough data, otherwise rules.
    Also returns which method was used so frontend can display it.
    """
    completed_count = len([s for s in sessions if s.completed])

    if completed_count >= 5:
        activity = ml_recommendation(sessions, current_emotion)
        method = 'ml'
    else:
        activity = rule_based_recommendation(current_emotion)
        method = 'rules'
        sessions_needed = 5 - completed_count

    return {
        'activity': activity,
        'method': method,
        'sessions_until_ml': max(0, 5 - completed_count),
    }