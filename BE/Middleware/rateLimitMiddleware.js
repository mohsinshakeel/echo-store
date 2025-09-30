import { checkRateLimit } from "../service/redisService.js";

export const rateLimitMiddleware = (limit = 10, window = 60) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip || req.connection.remoteAddress || 'unknown';
      
      const rateLimitResult = await checkRateLimit(identifier, limit, window);
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': rateLimitResult.remaining,
        'X-RateLimit-Reset': new Date(Date.now() + rateLimitResult.resetTime * 1000).toISOString()
      });
      
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${rateLimitResult.resetTime} seconds.`,
          retryAfter: rateLimitResult.resetTime
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next();
    }
  };
};

export const authRateLimit = rateLimitMiddleware(5, 60); 
export const productRateLimit = rateLimitMiddleware(20, 60); 
export const generalRateLimit = rateLimitMiddleware(100, 60); 

export const strictRateLimit = rateLimitMiddleware(3, 300);
