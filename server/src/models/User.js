const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['participant', 'admin'], default: 'participant' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);


