import rateLimit from 'express-rate-limit';

/**
 * @function createRateLimiter
 * @description Create and return the rate limiter middleware.
 * @returns {Function} Express middleware for rate limiting.
 */
const createRateLimiter = () => {
  const defaultOptions = {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Default rate limit
    message: {
      status: 429,
      message: "You've exhausted your ratelimit, please try again later.",
    },
  };

  return rateLimit(defaultOptions);
};

export default createRateLimiter;
