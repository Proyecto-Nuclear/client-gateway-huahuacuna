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
    ChildrenModule,
    SponsorshipsModule,
    ActivityLogsModule,
    ChatModule,
    ProjectsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [KafkaSubscriberService],
})
export class AppModule {}
