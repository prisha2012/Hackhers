const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFoundHandler, errorHandler } = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const submissionRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const timelineRoutes = require('./routes/timeline');

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRoutes);
  app.use('/teams', teamRoutes);
  app.use('/submissions', submissionRoutes);
  app.use('/admin', adminRoutes);
  app.use('/timeline', timelineRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;


