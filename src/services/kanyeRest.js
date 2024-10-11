import axios from 'axios';

const KANYE_REST = 'https://api.kanye.rest';

const kanyeService = axios.create({
  baseURL: KANYE_REST,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getKanyeQuote = async (personality, theme)=> {
    const prompt = `its a string`
    const response = await kanyeService.get(KANYE_REST, undefined)
    console.log('KANYES RESPONSE', response.data['quote'])
    if (!response.data || response.data.length === 0) {
      throw new Error('Unexpected response from Kanye');
    }
    return response.data['quote']
}
