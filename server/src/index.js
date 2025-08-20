require('dotenv').config();
const http = require('http');
const { connectToDatabase } = require('./config/db');
const createApp = require('./app');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  const app = createApp();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SynapHack backend listening on port ${PORT}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});


