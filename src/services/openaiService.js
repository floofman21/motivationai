import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const openaiService = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  }
});

const fallbackMessages = {
  "Optimistic Ollie": [
    "Every challenge is an opportunity in disguise. Embrace it!",
    "Your potential is limitless. Believe in yourself!",
    "Today is full of possibilities. Make the most of it!"
  ],
  "Resilient Rita": [
    "Tough times don't last, but tough people do. Stay strong!",
    "Every setback is a setup for a comeback. Keep pushing!",
    "Your resilience is your superpower. Use it wisely!"
  ],
  "Mindful Max": [
    "Take a deep breath. This moment is all that matters.",
    "Find peace in the present. It's where life happens.",
    "Observe your thoughts without judgment. Be present."
  ],
  "Energetic Ellie": [
    "Let's turn that energy into action! What's your first step?",
    "Enthusiasm is contagious. Spread it around!",
    "Your energy can move mountains. Channel it wisely!"
  ]
};

export const generateMotivationalMessage = async (personality, theme) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing. Please check your .env.local file.');
    }

    const response = await openaiService.post('', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are ${personality}, an AI motivational coach focusing on ${theme}. Provide a short, encouraging message.`
        },
        {
          role: "user",
          content: "Give me some motivation."
        }
      ],
      max_tokens: 100,
      n: 1,
      temperature: 0.7,
    });

    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error('Unexpected response from OpenAI API');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    
    // Use fallback messages when API fails
    return getFallbackMessage(personality);
  }
};

export const getFallbackMessage = (personality) => {
  const fallbackMessagesForPersonality = fallbackMessages[personality] || fallbackMessages["Optimistic Ollie"];
  const randomIndex = Math.floor(Math.random() * fallbackMessagesForPersonality.length);
  return fallbackMessagesForPersonality[randomIndex];
};