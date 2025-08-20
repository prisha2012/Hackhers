const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const Team = require('../models/Team');
const User = require('../models/User');

const validateCreate = [body('name').isString().isLength({ min: 2 })];
const validateJoin = [body('code').isString().isLength({ min: 6 })];

async function listTeams(req, res) {
  const teams = await Team.find().select('name code owner members').populate('owner', 'name email');
  res.json({ teams });
}

async function myTeam(req, res) {
  if (!req.user.team) return res.json({ team: null });
  const team = await Team.findById(req.user.team).populate('owner', 'name email').populate('members', 'name email');
  res.json({ team });
}

async function createTeam(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name } = req.body;

  const code = uuidv4().slice(0, 8);
  const team = await Team.create({ name, code, owner: req.user._id, members: [req.user._id] });
  await User.findByIdAndUpdate(req.user._id, { team: team._id });
  res.status(201).json({ team });
}

async function joinTeam(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { code } = req.body;
  const team = await Team.findOne({ code });
  if (!team) return res.status(404).json({ error: 'Team not found' });
  if (req.user.team && req.user.team.toString() === team._id.toString()) {
    return res.status(400).json({ error: 'Already in this team' });
  }
  if (req.user.team) return res.status(400).json({ error: 'Already in a team' });
  if (team.members.find((m) => m.toString() === req.user._id.toString())) {
    return res.status(400).json({ error: 'Already a member' });
  }

  team.members.push(req.user._id);
  await team.save();
  await User.findByIdAndUpdate(req.user._id, { team: team._id });
  res.json({ team });
}

async function leaveTeam(req, res) {
  if (!req.user.team) return res.status(400).json({ error: 'Not in a team' });
  const team = await Team.findById(req.user.team);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const isOwner = team.owner.toString() === req.user._id.toString();
  team.members = team.members.filter((m) => m.toString() !== req.user._id.toString());
  await User.findByIdAndUpdate(req.user._id, { team: null });

  if (team.members.length === 0) {
    await team.deleteOne();
    return res.json({ team: null });
  }

  if (isOwner) {
    team.owner = team.members[0];
  }
  await team.save();
  res.json({ team });
}

module.exports = { validateCreate, validateJoin, listTeams, myTeam, createTeam, joinTeam, leaveTeam };


