const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Script = require('../models/Script');
const Caption = require('../models/Caption');
const { generateScript } = require('../services/geminiService');
const { generateAllSceneAudio } = require('../services/elevenLabsService');

// POST /api/projects — Create a new project
router.post('/', async (req, res) => {
  try {
    const { userId, topic, character, language, duration, style } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({ message: 'userId and topic are required.' });
    }

    const project = new Project({ userId, topic, character, language, duration, style });
    await project.save();

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/projects?userId=xxx — Get all projects for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query param is required.' });

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/projects/:id — Get a single project with its script and captions
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const script = await Script.findOne({ projectId: req.params.id });
    const caption = await Caption.findOne({ projectId: req.params.id });

    res.json({ success: true, project, script, caption });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/projects/:id/generate-script — Generate script via Gemini
router.post('/:id/generate-script', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    console.log(`🤖 Generating script for: ${project.topic}`);

    const { parsed, raw } = await generateScript({
      topic: project.topic,
      character: project.character,
      language: project.language,
      duration: project.duration,
      style: project.style,
    });

    // Upsert script document
    let script = await Script.findOne({ projectId: project._id });
    if (script) {
      Object.assign(script, parsed);
      script.rawResponse = raw;
    } else {
      script = new Script({ projectId: project._id, ...parsed, rawResponse: raw });
    }
    await script.save();

    // Update project status
    project.status = 'script_generated';
    await project.save();

    res.json({ success: true, script });
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ message: 'Script generation failed', error: error.message });
  }
});

// POST /api/projects/:id/generate-voice — Generate voiceovers via ElevenLabs
router.post('/:id/generate-voice', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const script = await Script.findOne({ projectId: project._id });
    if (!script) return res.status(400).json({ message: 'Generate script first before generating voice.' });

    console.log(`🎙️ Generating voiceovers for project: ${project._id}`);

    const audioUrls = await generateAllSceneAudio(script, project._id.toString());

    // Update script with audio URLs
    for (const [sceneKey, url] of Object.entries(audioUrls)) {
      if (script[sceneKey]) {
        script[sceneKey].audioUrl = url;
      }
    }
    await script.save();

    // Update project status
    project.status = 'voice_generated';
    await project.save();

    res.json({ success: true, audioUrls, script });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ message: 'Voice generation failed', error: error.message });
  }
});

module.exports = router;
