import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';
import { KafkaHealthIndicator } from './indicators/kafka-health.indicator';
import { CacheGlobalModule } from '../common/cache/cache-global.module';
import { CircuitBreakerHealthController } from './circuit-breaker-health.controller';

/**
 * Health Module
 * Configura health checks para monitoreo de disponibilidad
 *
 * Health Checks incluidos:
 * - HTTP ping
 * - Redis connectivity
 * - Kafka connectivity
 * - Circuit Breaker statistics
 */
@Module({
  imports: [
    TerminusModule,
    HttpModule,
    CacheGlobalModule, // Para acceder a CacheService
  ],
  controllers: [
    HealthController,
    CircuitBreakerHealthController,
  ],
  providers: [
    RedisHealthIndicator,
    KafkaHealthIndicator,
  ],
})
export class HealthModule {}
