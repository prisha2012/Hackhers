const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  validateCreate,
  validateJoin,
  listTeams,
  myTeam,
  createTeam,
  joinTeam,
  leaveTeam,
} = require('../controllers/teamController');

router.get('/', authenticate, listTeams);
router.get('/me', authenticate, myTeam);
router.post('/', authenticate, validateCreate, createTeam);
router.post('/join', authenticate, validateJoin, joinTeam);
router.post('/leave', authenticate, leaveTeam);

module.exports = router;


