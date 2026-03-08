NEGATIVE_EMOTIONS = ['sad', 'angry', 'fearful', 'disgusted']
SEVERE_EMOTIONS = ['angry', 'fearful']

def calculate_escalation_tier(sessions):
    if not sessions:
        return 1, "You are doing great! Keep up your mindfulness practice."

    last_5 = sessions[:5]
    emotions = [s.emotion_detected for s in last_5]
    negative_count = sum(1 for e in emotions if e in NEGATIVE_EMOTIONS)
    severe_count = sum(1 for e in emotions if e in SEVERE_EMOTIONS)
    total = len(last_5)

    negative_ratio = negative_count / total
    severe_ratio = severe_count / total

    if severe_ratio >= 0.6:
        return 4, (
            "We are concerned about your wellbeing. "
            "Your recent sessions show signs of significant distress. "
            "Please reach out to a mental health professional or contact a crisis helpline immediately. "
            "You are not alone and help is available."
        )
    elif negative_ratio >= 0.8:
        return 3, (
            "We have noticed a consistent pattern of difficult emotions over your recent sessions. "
            "We strongly encourage you to speak with a counsellor or trusted person in your life. "
            "Your wellbeing matters deeply."
        )
    elif negative_ratio >= 0.6:
        return 2, (
            "We have noticed you have been experiencing some difficult emotions lately. "
            "Consider trying our more intensive mindfulness activities and ensure you are getting "
            "enough rest and social connection."
        )
    else:
        return 1, "You are doing well! Keep up your mindfulness practice."