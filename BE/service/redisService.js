import redis from "../configuration/redis_connection.js";

const CACHE_TTL = {
  PRODUCT_LIST: 300,   
  PRODUCT_DETAIL: 600, 
  USER_SESSION: 3600,   
  RATE_LIMIT: 60,       
};

export const cacheProductList = async (page, limit, products, totalCount) => {
  try {
    const cacheKey = `products:list:${page}:${limit}`;
    const cacheData = {
      products,
      totalCount,
      timestamp: Date.now()
    };
    
    await redis.setex(cacheKey, CACHE_TTL.PRODUCT_LIST, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Error caching product list:', error);
    return false;
  }
};

export const getCachedProductList = async (page, limit) => {
  try {
    const cacheKey = `products:list:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Error getting cached product list:', error);
    return null;
  }
};

export const cacheProductDetail = async (productId, product) => {
  try {
    const cacheKey = `product:detail:${productId}`;
    const cacheData = {
      ...product,
      timestamp: Date.now()
    };
    
    await redis.setex(cacheKey, CACHE_TTL.PRODUCT_DETAIL, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('Error caching product detail:', error);
    return false;
  }
};

export const getCachedProductDetail = async (productId) => {
  try {
    const cacheKey = `product:detail:${productId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Error getting cached product detail:', error);
    return null;
  }
};

export const invalidateProductCache = async (productId = null) => {
  try {
    if (productId) {
      await redis.del(`product:detail:${productId}`);
    }

    const keys = await redis.keys('products:list:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    
    return true;
  } catch (error) {
    console.error('Error invalidating product cache:', error);
    return false;
  }
};

export const checkRateLimit = async (identifier, limit = 10, window = 60) => {
  try {
    const key = `rate_limit:${identifier}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetTime: await redis.ttl(key)
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: true, remaining: limit, resetTime: window };
  }
};

export const setUserSession = async (userId, sessionData) => {
  try {
    const key = `session:${userId}`;
    await redis.setex(key, CACHE_TTL.USER_SESSION, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('Error setting user session:', error);
    return false;
  }
};

export const getUserSession = async (userId) => {
  try {
    const key = `session:${userId}`;
    const session = await redis.get(key);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

export const deleteUserSession = async (userId) => {
  try {
    const key = `session:${userId}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting user session:', error);
    return false;
  }
};

export const setCache = async (key, data, ttl = 300) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error setting cache:', error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting cache:', error);
    return false;
  }
};
