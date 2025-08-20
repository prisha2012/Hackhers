const express = require('express');
const router = express.Router();

// GET /timeline - Get timeline events
router.get('/', async (req, res) => {
  try {
    // Placeholder timeline data
    const timelineEvents = [
      {
        id: 1,
        title: 'Registration Opens',
        description: 'Hackathon registration is now open',
        date: new Date('2024-01-15'),
        type: 'registration'
      },
      {
        id: 2,
        title: 'Team Formation',
        description: 'Form your teams and start brainstorming',
        date: new Date('2024-02-01'),
        type: 'team'
      },
      {
        id: 3,
        title: 'Hackathon Begins',
        description: 'Let the coding begin!',
        date: new Date('2024-02-15'),
        type: 'event'
      }
    ];

    res.json({
      success: true,
      data: timelineEvents
    });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline events'
    });
  }
});

// POST /timeline - Create timeline event (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, date, type } = req.body;
    
    // TODO: Add authentication middleware and validation
    // TODO: Save to database
    
    res.json({
      success: true,
      message: 'Timeline event created successfully',
      data: { title, description, date, type }
    });
  } catch (error) {
    console.error('Timeline creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create timeline event'
    });
  }
});

module.exports = router;