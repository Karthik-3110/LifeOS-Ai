import NodeCache from "node-cache";
import { createClient } from "redis";
import { env } from "../config/env.js";

const fallbackCache = new NodeCache({ stdTTL: 300, useClones: false });
let redisClientPromise;

async function getRedisClient() {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisClientPromise) {
    redisClientPromise = (async () => {
      const client = createClient({ url: env.REDIS_URL });
      client.on("error", () => {});
      await client.connect();
      return client;
    })().catch(() => null);
  }

  return redisClientPromise;
}

export async function getCache(key) {
  const redis = await getRedisClient();
  if (redis) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  return fallbackCache.get(key) ?? null;
}

export async function setCache(key, value, ttlSeconds = 300) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
    return;
  }
  fallbackCache.set(key, value, ttlSeconds);
}

export async function deleteCache(keys) {
  const list = Array.isArray(keys) ? keys : [keys];
  const redis = await getRedisClient();
  if (redis) {
    await Promise.all(list.map((key) => redis.del(key)));
    return;
  }
  fallbackCache.del(list);
}

export async function rememberCache(key, resolver, ttlSeconds = 300) {
  const cached = await getCache(key);
  if (cached) {
    return cached;
  }

  const fresh = await resolver();
  await setCache(key, fresh, ttlSeconds);
  return fresh;
}
