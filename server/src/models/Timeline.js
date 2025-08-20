const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const scheduleItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    eventKey: { type: String, required: true, unique: true },
    announcements: [announcementSchema],
    schedule: [scheduleItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timeline', timelineSchema);


