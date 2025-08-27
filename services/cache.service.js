const redisClient = require('../config/redis');

class CashService {
  /* eslint-disable no-await-in-loop */
  async #deleteBatch(keys) {
    const BATCH_SIZE = 500;
    if (!keys || keys.length === 0) return;

    if (typeof redisClient.unlink === 'function') {
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        await redisClient.unlink(...keys.slice(i, i + BATCH_SIZE));
      }
    } else {
      for (let i = 0; i < keys.length; i += BATCH_SIZE) {
        await redisClient.del(...keys.slice(i, i + BATCH_SIZE));
      }
    }
  }

  async clearCourseCache() {
    const BATCH_SIZE = 500;
    let batch = [];

    // eslint-disable-next-line no-restricted-syntax, node/no-unsupported-features/es-syntax
    for await (const key of redisClient.scanIterator({
      MATCH: 'courses:*',
      COUNT: 1000,
    })) {
      batch.push(key);
      if (batch.length >= BATCH_SIZE) {
        await this.#deleteBatch(batch);
        batch = [];
      }
    }
    if (batch.length) await this.#deleteBatch(batch);
  }

  async getOrSetCache(key, cb) {
    const data = await redisClient.get(key);

    if (data != null) return JSON.parse(data);

    const freshData = await cb();
    await redisClient.setEx(key, 3600, JSON.stringify(freshData));
    return freshData;
  }
}

module.exports = new CashService();
