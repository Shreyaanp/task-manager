const { RateLimiterMemory } = require('rate-limiter-flexible');

const opts = {
  points: 50, // 50 requests
  duration: 600, // per 10 minutes by IP
};

const rateLimiter = new RateLimiterMemory(opts);

const rateLimit = (req, res) => {
  return new Promise((resolve, reject) => {
    rateLimiter.consume(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        res.status(429).json({ error: "Too Many Requests" });
        reject(false);
      });
  });
};

module.exports = rateLimit;
