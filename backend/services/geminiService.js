const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a 4-scene reel script using Google Gemini API.
 * @param {Object} projectData - { topic, character, language, duration, style }
 * @returns {Object} - { scene1, scene2, scene3, scene4 } each with { visualPrompt, dialogue, timing }
 */
const generateScript = async ({ topic, character, language, duration, style }) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a viral short-form video scriptwriter specializing in ${language} content for Instagram Reels and YouTube Shorts.

Generate a 4-scene reel script with the following details:
- Topic: ${topic}
- Character: ${character || 'A friendly narrator'}
- Language: ${language}
- Duration: ${duration} seconds total (split evenly across 4 scenes)
- Tone/Style: ${style}

Rules:
1. Each scene should be 6-10 seconds.
2. Dialogue must be in ${language} (use native script if applicable).
3. Visual prompts should be vivid, cinematic, and suitable for AI image generation.
4. Keep the content engaging, emotionally resonant, and shareable.
5. Timing should be specific (e.g., "0:00 - 0:08").

Return ONLY a valid JSON object in this exact format, no markdown, no explanation:
{
  "scene1": {
    "visualPrompt": "...",
    "dialogue": "...",
    "timing": "0:00 - 0:08"
  },
  "scene2": {
    "visualPrompt": "...",
    "dialogue": "...",
    "timing": "0:08 - 0:16"
  },
  "scene3": {
    "visualPrompt": "...",
    "dialogue": "...",
    "timing": "0:16 - 0:24"
  },
  "scene4": {
    "visualPrompt": "...",
    "dialogue": "...",
    "timing": "0:24 - 0:32"
  }
}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Clean up response in case Gemini wraps in markdown
  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  return { parsed, raw: responseText };
};

module.exports = { generateScript };
