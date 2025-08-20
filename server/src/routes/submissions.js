const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { validateSubmit, listSubmissions, mySubmission, submitProject } = require('../controllers/submissionController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.get('/', authenticate, listSubmissions);
router.get('/me', authenticate, mySubmission);
router.post('/', authenticate, upload.single('file'), validateSubmit, submitProject);

module.exports = router;


