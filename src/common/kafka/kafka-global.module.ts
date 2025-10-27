import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaClients } from './kafka.providers';

@Global()
@Module({
  imports: [ClientsModule.register(createKafkaClients())],
  exports: [ClientsModule],
})
export class KafkaGlobalModule {}