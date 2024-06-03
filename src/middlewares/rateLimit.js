import rateLimit from 'express-rate-limit';
import Users from '../models/schemas/User.js';

/**
 * @function createRateLimiter
 * @description Create and return the rate limiter middleware.
 * @returns {Function} Express middleware for rate limiting.
 *
 * @example
 * // Basic usage
 * const limiter = createRateLimiter();
 * app.use('/api/route', limiter);
 *
 * @example
 * // Customized options
 * const customOptions = {
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 100, // limit each IP to 100 requests per windowMs
 *   message: 'Too many requests from this IP, please try again after a few minutes.',
 * };
 * const customLimiter = createRateLimiter(customOptions);
 * app.use('/api/customRoute', customLimiter);
 */
const createRateLimiter = () => {
  /**
   * Default rate limiting options.
   * @typedef {Object} RateLimitOptions
   * @property {number} [windowMs=60000] - The time window for which the requests are checked/metered (in milliseconds).
   * @property {number} [max=20] - The maximum number of allowed requests within the windowMs time frame.
   * @property {Object} message - The message sent in the response when the limit is exceeded.
   * @property {number} [message.status=429] - The HTTP status code to be set in the response.
   * @property {string} [message.message='You've exhausted your ratelimit, please try again later.'] - The message to be sent in the response.
   */
  const defaultOptions = {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Default rate limit
    message: {
      status: 429,
      message: "You've exhausted your ratelimit, please try again later.",
    },
  };

  // Create rate limiter middleware with default options
  const limiter = rateLimit(defaultOptions);

  /**
   * Express middleware function for rate limiting.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next function.
   */
  return async (req, res, next) => {
    try {
      // Extract token from request headers
      const token = req.headers.authorization;

      // Find user data from the database based on token
      const user = await Users.findOne({ token });

      // Override default rate limit if user's rate limit is defined
      if (user && user.rateLimit) {
        limiter.options.max = user.rateLimit;
      }

      // Apply rate limiting
      limiter(req, res, next);
    } catch (error) {
      // Handle errors when fetching user data
      console.error('Error fetching user data:', error.message);

      // Apply rate limiting as a fallback
      limiter(req, res, next);
    }
  };
};

export default createRateLimiter;
