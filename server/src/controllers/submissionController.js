const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const Team = require('../models/Team');
const { uploadBufferToBlob } = require('../utils/storage');
const { isPlagiarized } = require('../utils/plagiarism');

const validateSubmit = [
  body('title').isString().isLength({ min: 3 }),
  body('description').isString().isLength({ min: 20 }),
];

async function listSubmissions(req, res) {
  const submissions = await Submission.find().populate({ path: 'team', select: 'name' });
  res.json({ submissions });
}

async function mySubmission(req, res) {
  const teamId = req.user.team;
  if (!teamId) return res.status(400).json({ error: 'Join a team first' });
  const sub = await Submission.findOne({ team: teamId });
  res.json({ submission: sub || null });
}

async function submitProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const teamId = req.user.team;
  if (!teamId) return res.status(400).json({ error: 'Join a team first' });

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const { title, description } = req.body;

  // Plagiarism check
  const existing = await Submission.find({}, 'description');
  const { isPlagiarized: plag, score } = isPlagiarized(description, existing.map((e) => e.description));
  if (plag) return res.status(400).json({ error: 'Submission too similar to existing ones', score });

  let fileUrl = null;
  if (req.file) {
    fileUrl = await uploadBufferToBlob(
      process.env.AZURE_BLOB_CONTAINER || 'submissions',
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );
  }

  const existingSub = await Submission.findOne({ team: teamId });
  if (existingSub) {
    existingSub.title = title;
    existingSub.description = description;
    if (fileUrl) existingSub.fileUrl = fileUrl;
    await existingSub.save();
    return res.json({ submission: existingSub });
  }

  const submission = await Submission.create({ team: teamId, title, description, fileUrl });
  res.status(201).json({ submission });
}

module.exports = { validateSubmit, listSubmissions, mySubmission, submitProject };


