import { Global, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { KafkaGlobalModule } from "./common/kafka/kafka-global.module";
import { CacheGlobalModule } from "./common/cache/cache-global.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvsConfig } from "./config/env.config";
import KafkaSubscriberService from "./common/kafka/kafka-subscriber.service";
import { AuthModule } from "./auth/auth.module";

@Global()
@Module({
  imports: [
    DiscoveryModule,
    KafkaGlobalModule,
    CacheGlobalModule,
    JwtModule.register({
      global: true,
      secret: EnvsConfig.JWT_SECRET,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [KafkaSubscriberService],
})
export class AppModule {}
