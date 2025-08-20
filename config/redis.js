const { createClient } = require('redis');

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => console.log('Redis connected successfully'));

module.exports = client;
