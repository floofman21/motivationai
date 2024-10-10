const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json());

const OPENAI_API_KEY = 'your-api-key-here';

app.post('/api/getMotivation', async (req, res) => {
  const { personality, theme } = req.body;
  
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Generate a motivational message in the style of ${personality}, focusing on ${theme}:`,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const motivationalMessage = response.data.choices[0].text.trim();
    res.json({ message: motivationalMessage });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to generate motivation' });
  }
});

app.listen(port, () => {
  console.log(`AI backend listening at http://localhost:${port}`);
});