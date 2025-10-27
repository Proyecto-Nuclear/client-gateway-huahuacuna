import KeyvRedis, { Keyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { EnvsConfig } from "../../config/env.config";
import { CacheService } from "./cache.service";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        const redisUri = `redis://${EnvsConfig.REDIS_HOST}:${EnvsConfig.REDIS_PORT}`;

        return {
          ttl: 60_000,
          isGlobal: true,
          stores: [
            new Keyv(new KeyvRedis(redisUri), {
              namespace: 'huahuacuna',
            }),
          ],
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class CacheGlobalModule {}
