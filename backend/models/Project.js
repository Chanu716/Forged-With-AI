const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk user ID
    topic: { type: String, required: true },
    character: { type: String, default: '' },
    language: { type: String, default: 'Telugu' },
    duration: { type: String, default: '30' },
    style: { type: String, default: 'Funny + Emotional' },
    status: {
      type: String,
      enum: ['draft', 'script_generated', 'voice_generated', 'video_ready', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
