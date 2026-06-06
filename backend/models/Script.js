const mongoose = require('mongoose');

const SceneSchema = new mongoose.Schema({
  visualPrompt: { type: String, default: '' },
  dialogue: { type: String, default: '' },
  timing: { type: String, default: '' },
  audioUrl: { type: String, default: '' }, // ElevenLabs generated audio path
});

const ScriptSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    scene1: { type: SceneSchema, default: {} },
    scene2: { type: SceneSchema, default: {} },
    scene3: { type: SceneSchema, default: {} },
    scene4: { type: SceneSchema, default: {} },
    rawResponse: { type: String, default: '' }, // store raw LLM output for debugging
  },
  { timestamps: true }
);

module.exports = mongoose.model('Script', ScriptSchema);
