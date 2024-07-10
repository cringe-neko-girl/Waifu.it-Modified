import { Router } from 'express';
import { getStats } from '../../../controllers/v4/internal/stats.js';
import createRateLimiter from '../../../middlewares/rateLimit.js';

const router = Router();

router
  .route('/')
  /**
   * @api {post} v4/stats Get Statistics
   * @apiDescription Get statistics about the system usage.
   * @apiName getStats
   * @apiGroup Statistics
   * @apiPermission user
   *
   * @apiHeader {String} Authorization System access token.
   *
   * @apiSuccess {Object} stats System statistics or status.
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data.
   * @apiError (Forbidden 403) Forbidden Only authorized users can access the data.
   * @apiError (Too Many Requests 429) TooManyRequests The client has exceeded the allowed number of requests within the time window.
   * @apiError (Internal Server Error 500) InternalServerError An error occurred while processing the request.
   */
  .get(createRateLimiter(), getStats);

// Export the router
export default router;
