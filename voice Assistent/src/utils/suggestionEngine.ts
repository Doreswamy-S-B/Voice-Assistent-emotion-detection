interface Suggestion {
  title: string;
  description: string;
  duration?: string;
}

interface SuggestionCategories {
  breathing: Suggestion[];
  music: Suggestion[];
  reading: Suggestion[];
  activity: Suggestion[];
  mindfulness: Suggestion[];
}

const suggestions: Record<string, SuggestionCategories> = {
  happy: {
    breathing: [
      { title: 'Celebratory Breathing', description: 'Deep breaths to savor this positive moment', duration: '2 minutes' },
      { title: 'Energy Breath', description: 'Energizing breath work to maintain your good mood', duration: '3 minutes' }
    ],
    music: [
      { title: 'Upbeat Playlist', description: 'Listen to energetic music that matches your mood' },
      { title: 'Feel-Good Classics', description: 'Classic songs that enhance positive emotions' }
    ],
    reading: [
      { title: 'Inspirational Quotes', description: 'Read motivational quotes that resonate with joy' },
      { title: 'Success Stories', description: 'Stories of achievement and positive outcomes' }
    ],
    activity: [
      { title: 'Share Your Joy', description: 'Call a friend or family member to share good news' },
      { title: 'Creative Expression', description: 'Draw, write, or create something inspired by your mood' }
    ],
    mindfulness: [
      { title: 'Gratitude Practice', description: 'Take a moment to appreciate what made you happy', duration: '5 minutes' },
      { title: 'Loving-Kindness Meditation', description: 'Send positive thoughts to yourself and others', duration: '10 minutes' }
    ]
  },
  sad: {
    breathing: [
      { title: 'Comforting Breath Work', description: 'Gentle breathing to soothe difficult emotions', duration: '5 minutes' },
      { title: '4-7-8 Breathing', description: 'Calming technique to ease sadness', duration: '4 minutes' }
    ],
    music: [
      { title: 'Healing Music', description: 'Soft, therapeutic music for emotional processing' },
      { title: 'Nature Sounds', description: 'Calming sounds of rain, ocean, or forest' }
    ],
    reading: [
      { title: 'Comfort Poetry', description: 'Gentle poems that validate your feelings' },
      { title: 'Self-Compassion Articles', description: 'Reading about being kind to yourself during tough times' }
    ],
    activity: [
      { title: 'Gentle Movement', description: 'Light stretching or yoga to release tension' },
      { title: 'Warm Bath', description: 'Take a relaxing bath with essential oils' }
    ],
    mindfulness: [
      { title: 'Emotion Acceptance', description: 'Practice accepting your feelings without judgment', duration: '8 minutes' },
      { title: 'Body Scan Meditation', description: 'Connect with your body and release tension', duration: '15 minutes' }
    ]
  },
  angry: {
    breathing: [
      { title: 'Cooling Breath', description: 'Breathing technique to reduce anger and heat', duration: '3 minutes' },
      { title: 'Box Breathing', description: 'Structured breathing to regain control', duration: '5 minutes' }
    ],
    music: [
      { title: 'Calming Instrumentals', description: 'Peaceful music to cool down intense emotions' },
      { title: 'Classical Relaxation', description: 'Soothing classical pieces for emotional regulation' }
    ],
    reading: [
      { title: 'Anger Management Tips', description: 'Quick strategies for handling anger constructively' },
      { title: 'Mindful Communication', description: 'Learning to express anger in healthy ways' }
    ],
    activity: [
      { title: 'Physical Release', description: 'Go for a brisk walk or do jumping jacks' },
      { title: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups systematically' }
    ],
    mindfulness: [
      { title: 'Anger Observation', description: 'Notice anger without being consumed by it', duration: '6 minutes' },
      { title: 'Compassion Practice', description: 'Find understanding for yourself and the situation', duration: '10 minutes' }
    ]
  },
  fearful: {
    breathing: [
      { title: 'Grounding Breath', description: 'Breathing technique to feel more anchored and safe', duration: '4 minutes' },
      { title: 'Confidence Breathing', description: 'Build courage through intentional breathing', duration: '3 minutes' }
    ],
    music: [
      { title: 'Empowering Songs', description: 'Music that builds confidence and reduces fear' },
      { title: 'Gentle Affirmation Music', description: 'Soft music with positive affirmations' }
    ],
    reading: [
      { title: 'Courage Quotes', description: 'Inspiring words about overcoming fear' },
      { title: 'Anxiety Relief Techniques', description: 'Practical methods for managing worry' }
    ],
    activity: [
      { title: 'Safe Space Visualization', description: 'Imagine yourself in a completely safe environment' },
      { title: 'Gentle Self-Care', description: 'Do something nurturing and comforting for yourself' }
    ],
    mindfulness: [
      { title: 'Fear Acknowledgment', description: 'Recognize fear without letting it control you', duration: '7 minutes' },
      { title: 'Safety Meditation', description: 'Connect with feelings of security and protection', duration: '12 minutes' }
    ]
  },
  neutral: {
    breathing: [
      { title: 'Energizing Breath', description: 'Breathing to add some vitality to your day', duration: '3 minutes' },
      { title: 'Mindful Breathing', description: 'Simple awareness of breath to stay present', duration: '5 minutes' }
    ],
    music: [
      { title: 'Mood-Lifting Playlist', description: 'Upbeat music to add some sparkle to your day' },
      { title: 'Focus Music', description: 'Background music for productivity and concentration' }
    ],
    reading: [
      { title: 'Daily Inspiration', description: 'Short motivational reading to brighten your day' },
      { title: 'Interesting Articles', description: 'Engaging content to stimulate your mind' }
    ],
    activity: [
      { title: 'Try Something New', description: 'Learn a new skill or hobby for 10 minutes' },
      { title: 'Connect with Nature', description: 'Spend time outdoors or tend to plants' }
    ],
    mindfulness: [
      { title: 'Present Moment Awareness', description: 'Simple meditation to enhance mindfulness', duration: '10 minutes' },
      { title: 'Intention Setting', description: 'Set a positive intention for your day', duration: '5 minutes' }
    ]
  }
};

// Default suggestions for emotions not specifically defined
const defaultSuggestions: SuggestionCategories = {
  breathing: [
    { title: 'Deep Breathing', description: 'Basic breathing exercise for emotional balance', duration: '3 minutes' },
    { title: 'Mindful Breath', description: 'Focus on your breath to center yourself', duration: '5 minutes' }
  ],
  music: [
    { title: 'Relaxing Music', description: 'Gentle music to support emotional well-being' },
    { title: 'Nature Sounds', description: 'Peaceful sounds from nature for relaxation' }
  ],
  reading: [
    { title: 'Mindfulness Tips', description: 'Quick tips for staying present and aware' },
    { title: 'Positive Affirmations', description: 'Uplifting statements to support your well-being' }
  ],
  activity: [
    { title: 'Gentle Movement', description: 'Light exercise or stretching for emotional release' },
    { title: 'Creative Expression', description: 'Engage in art, writing, or other creative activities' }
  ],
  mindfulness: [
    { title: 'Emotion Awareness', description: 'Practice observing your emotions with kindness', duration: '8 minutes' },
    { title: 'Self-Compassion', description: 'Treat yourself with understanding and care', duration: '10 minutes' }
  ]
};

export const getSuggestions = (emotion: string): SuggestionCategories => {
  return suggestions[emotion] || defaultSuggestions;
};