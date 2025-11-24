import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckResult, HealthCheckService, HttpHealthIndicator, } from "@nestjs/terminus";
import { RedisHealthIndicator } from "./indicators/redis-health.indicator";
import { KafkaHealthIndicator } from "./indicators/kafka-health.indicator";

/**
 * Health Check Controller
 * Expone el endpoint /api/health para monitoreo de disponibilidad
 *
 * RF: Disponibilidad - Health Checks
 * Métrica: Detección automática de fallos
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly kafka: KafkaHealthIndicator,
  ) {}

  /**
   * Endpoint principal de health check
   *
   * Verifica:
   * - Estado del servicio (ping)
   * - Conexión a Redis (caché)
   * - Conexión a Kafka (message broker)
   */
  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Ping básico del servicio
      () => this.http.pingCheck('gateway', 'http://localhost:3000'),

      // Verificar Redis (caché)
      () => this.redis.isHealthy('redis'),

      // Verificar Kafka (message broker)
      () => this.kafka.isHealthy('kafka'),
    ]);
  }

  /**
   * Endpoint simplificado para load balancers
   *
   * Responde rápidamente sin verificar dependencias
   */
  @Get('ping')
  ping(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
