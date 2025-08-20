const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Timeline = require('../models/Timeline');

const validateScore = [body('score').isFloat({ min: 0, max: 100 })];
const validateAnnouncement = [body('title').isString(), body('message').isString()];
const validateScheduleItem = [
  body('label').isString(),
  body('start').isISO8601(),
  body('end').isISO8601(),
];

async function listTeams(req, res) {
  const teams = await Team.find().populate('members', 'name email').populate('owner', 'name email');
  res.json({ teams });
}

async function reviewSubmissions(req, res) {
  const submissions = await Submission.find().populate('team', 'name');
  res.json({ submissions });
}

async function scoreSubmission(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const { score } = req.body;
  const sub = await Submission.findByIdAndUpdate(id, { score }, { new: true });
  if (!sub) return res.status(404).json({ error: 'Submission not found' });
  res.json({ submission: sub });
}

async function postAnnouncement(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, message } = req.body;
  const eventKey = process.env.EVENT_KEY || 'synaphack-3';
  const timeline = await Timeline.findOneAndUpdate(
    { eventKey },
    { $push: { announcements: { title, message, publishedAt: new Date() } } },
    { new: true, upsert: true }
  );
  res.status(201).json({ timeline });
}

async function addScheduleItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { label, start, end } = req.body;
  const eventKey = process.env.EVENT_KEY || 'synaphack-3';
  const timeline = await Timeline.findOneAndUpdate(
    { eventKey },
    { $push: { schedule: { label, start: new Date(start), end: new Date(end) } } },
    { new: true, upsert: true }
  );
  res.status(201).json({ timeline });
}

module.exports = {
  validateScore,
  validateAnnouncement,
  validateScheduleItem,
  listTeams,
  reviewSubmissions,
  scoreSubmission,
  postAnnouncement,
  addScheduleItem,
};


