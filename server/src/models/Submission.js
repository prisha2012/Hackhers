const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, default: null },
    score: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);


