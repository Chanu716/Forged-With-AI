const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    instagramCaption: { type: String, default: '' },
    youtubeTitle: { type: String, default: '' },
    youtubeDescription: { type: String, default: '' },
    instagramHashtags: { type: [String], default: [] },
    youtubeHashtags: { type: [String], default: [] },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Caption', CaptionSchema);
