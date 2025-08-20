const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const {
  validateScore,
  validateAnnouncement,
  validateScheduleItem,
  listTeams,
  reviewSubmissions,
  scoreSubmission,
  postAnnouncement,
  addScheduleItem,
} = require('../controllers/adminController');

router.use(authenticate, authorizeAdmin);

router.get('/teams', listTeams);
router.get('/submissions', reviewSubmissions);
router.post('/submissions/:id/score', validateScore, scoreSubmission);
router.post('/announcements', validateAnnouncement, postAnnouncement);
router.post('/schedule', validateScheduleItem, addScheduleItem);

module.exports = router;


