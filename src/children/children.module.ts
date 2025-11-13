import { Module } from '@nestjs/common';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';

/**
 * Módulo de Children para el Gateway
 * Comunica con el microservicio apadrinamiento via Kafka
 */
@Module({
  controllers: [ChildrenController],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
