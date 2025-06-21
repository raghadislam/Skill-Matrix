const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { loadBadgesToCache } = require('./services/badgeEngine');

process.on('uncaughtException', (err) => {
  console.error('UNHANDLED EXCEPTION! 💥 Shutting down...');
  console.error(err.message, err.name);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(async () => {
  console.log('DB connection successful!');
  await loadBadgesToCache();
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error(err.message, err.name);
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
