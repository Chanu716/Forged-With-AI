const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
// Default voice: "Rachel" (multilingual voice, good for Indian languages)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

/**
 * Generates audio for a single text using ElevenLabs TTS.
 * @param {string} text - Dialogue text to convert to speech
 * @param {string} sceneKey - e.g., 'scene1' (used for filename)
 * @param {string} projectId - MongoDB project ID (used for folder naming)
 * @returns {string} - Relative URL path to the saved audio file
 */
const generateAudio = async (text, sceneKey, projectId) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === 'your_elevenlabs_api_key') {
    throw new Error('ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your .env file.');
  }

  const response = await axios.post(
    `${ELEVENLABS_API_URL}/${DEFAULT_VOICE_ID}`,
    {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    },
    {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      responseType: 'arraybuffer',
    }
  );

  // Save audio file to public/audio/{projectId}/
  const audioDir = path.join(__dirname, '..', 'public', 'audio', projectId.toString());
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filename = `${sceneKey}.mp3`;
  const filepath = path.join(audioDir, filename);
  fs.writeFileSync(filepath, response.data);

  return `/audio/${projectId}/${filename}`;
};

/**
 * Generates audio for all 4 scenes.
 * @param {Object} script - { scene1, scene2, scene3, scene4 } each with { dialogue }
 * @param {string} projectId - MongoDB project ID
 * @returns {Object} - { scene1: '/audio/...', scene2: '/audio/...', ... }
 */
const generateAllSceneAudio = async (script, projectId) => {
  const audioUrls = {};
  const scenes = ['scene1', 'scene2', 'scene3', 'scene4'];

  for (const sceneKey of scenes) {
    const dialogue = script[sceneKey]?.dialogue;
    if (dialogue) {
      console.log(`🎙️ Generating audio for ${sceneKey}...`);
      const audioUrl = await generateAudio(dialogue, sceneKey, projectId);
      audioUrls[sceneKey] = audioUrl;
    }
  }

  return audioUrls;
};

module.exports = { generateAudio, generateAllSceneAudio };
