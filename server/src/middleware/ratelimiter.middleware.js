// rateLimiter.js
import Redis from "ioredis";
const redis = new Redis();

// Config
const USER_LIMIT = 3; // per user requests per second
const GLOBAL_LIMIT = 30; // global requests per second
const INTERVAL = 1000; // refill period (1s)

// Middleware
export async function rateLimiter(req, res, next) {
  const userId = req.ip || "guest";
  const now = Date.now();

  const userKey = `rate:user:${userId}`;
  const globalKey = `rate:global`;

  // Get existing bucket data
  const [userData, globalData] = await redis.mget(userKey, globalKey);

  // Parse or init
  let [userTokens, userLast] = userData
    ? JSON.parse(userData)
    : [USER_LIMIT, now];
  let [globalTokens, globalLast] = globalData
    ? JSON.parse(globalData)
    : [GLOBAL_LIMIT, now];

  // Lazy refill for user bucket
  const userElapsed = now - userLast;
  if (userElapsed >= INTERVAL) {
    const refill = Math.floor(userElapsed / INTERVAL) * USER_LIMIT;
    userTokens = Math.min(USER_LIMIT, userTokens + refill);
    userLast = now;
  }

  // Lazy refill for global bucket
  const globalElapsed = now - globalLast;
  if (globalElapsed >= INTERVAL) {
    const refill = Math.floor(globalElapsed / INTERVAL) * GLOBAL_LIMIT;
    globalTokens = Math.min(GLOBAL_LIMIT, globalTokens + refill);
    globalLast = now;
  }

  // Check limits
  if (userTokens <= 0 || globalTokens <= 0) {
    return res
      .status(429)
      .json({ message: "Too many requests, please slow down." });
  }

  // Consume tokens
  userTokens--;
  globalTokens--;

  // Save updated values
  await redis.mset(
    userKey,
    JSON.stringify([userTokens, userLast]),
    globalKey,
    JSON.stringify([globalTokens, globalLast])
  );

  next();
}
