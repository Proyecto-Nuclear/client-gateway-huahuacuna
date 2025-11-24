import { Global, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { KafkaGlobalModule } from "./common/kafka/kafka-global.module";
import { CacheGlobalModule } from "./common/cache/cache-global.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvsConfig } from "./config/env.config";
import KafkaSubscriberService from "./common/kafka/kafka-subscriber.service";
import { AuthModule } from "./auth/auth.module";
import { ChildrenModule } from "./children/children.module";
import { SponsorshipsModule } from "./sponsorships/sponsorships.module";
import { ActivityLogsModule } from "./activity-logs/activity-logs.module";
import { ChatModule } from "./chat/chat.module";
import { ProjectsModule } from "./projects/projects.module";
import { EventsModule } from "./events/events.module";
import { DonationsModule } from "./donations/donations.module";
import { HealthModule } from "./health/health.module";
import { CircuitBreakerModule } from "./common/circuit-breaker/circuit-breaker.module";

@Global()
@Module({
  imports: [
    DiscoveryModule,
    KafkaGlobalModule,
    CacheGlobalModule,
    CircuitBreakerModule,
    JwtModule.register({
      global: true,
      secret: EnvsConfig.JWT_SECRET,
    }),
    HealthModule,
    AuthModule,
    ChildrenModule,
    SponsorshipsModule,
    ActivityLogsModule,
    ChatModule,
    ProjectsModule,
    EventsModule,
    DonationsModule,
  ],
  controllers: [],
  providers: [KafkaSubscriberService],
})
export class AppModule {}
