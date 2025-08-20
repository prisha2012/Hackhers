const Timeline = require('../models/Timeline');

async function getTimeline(req, res) {
  const eventKey = process.env.EVENT_KEY || 'synaphack-3';
  const timeline = await Timeline.findOne({ eventKey });
  res.json({ timeline: timeline || { eventKey, announcements: [], schedule: [] } });
}

module.exports = { getTimeline };


