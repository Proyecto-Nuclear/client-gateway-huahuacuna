import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    if (value) {
      this.logger.debug(`Cache hit for key: ${key}`);
    } else {
      this.logger.debug(`Cache miss for key: ${key}`);
    }
    return value;
  }

  async set<T>(key: string, value: T, ttl = 0): Promise<void> {
    this.logger.debug(`Setting cache for key: ${key}`);
    await this.cacheManager.set(key, value, ttl);
  }
}
