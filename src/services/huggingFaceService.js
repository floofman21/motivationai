import axios from 'axios';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2';

const huggingFaceService = axios.create({
  baseURL: HUGGING_FACE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_HUGGING_FACE_API_KEY}`
  }
});

const fallbackMessages = {
  "Optimistic Ollie": [
    "Every challenge is an opportunity. Embrace it!",
    "Your potential is limitless. Believe in yourself!",
    "Today is full of possibilities. Seize it!"
  ],
  "Resilient Rita": [
    "Tough times don't last. You do. Stay strong!",
    "Every setback is a setup for a comeback.",
    "Your resilience is your superpower."
  ],
  "Mindful Max": [
    "This moment is all that matters. Breathe.",
    "Find peace in the present.",
    "Observe without judgment. Be present."
  ],
  "Energetic Ellie": [
    "Turn that energy into action! Go!",
    "Enthusiasm is contagious. Spread it!",
    "Your energy can move mountains."
  ]
};

export const generateMotivationalMessage = async (personality, theme) => {
  try {
    if (!import.meta.env.VITE_HUGGING_FACE_API_KEY) {
      throw new Error('Hugging Face API key is missing. Please check your .env.local file.');
    }

    const prompt = `${personality}: Short, powerful ${theme} motivation:`;
    
    const response = await huggingFaceService.post('', {
      inputs: prompt,
      parameters: {
        max_new_tokens: 30,
        num_return_sequences: 1,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.9,
        do_sample: true,
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('Unexpected response from Hugging Face API');
    }

    let generatedText = response.data[0].generated_text.trim();
    generatedText = generatedText.split('\n')[0]; // Take only the first line
    generatedText = generatedText.replace(prompt, '').trim(); // Remove the prompt from the response

    // If the generated text is too short, use a fallback message
    if (generatedText.length < 20) {
      return getFallbackMessage(personality);
    }

    return generatedText;
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    
    return getFallbackMessage(personality);
  }
};

const getFallbackMessage = (personality) => {
  const fallbackMessagesForPersonality = fallbackMessages[personality] || fallbackMessages["Optimistic Ollie"];
  const randomIndex = Math.floor(Math.random() * fallbackMessagesForPersonality.length);
  return fallbackMessagesForPersonality[randomIndex];
};