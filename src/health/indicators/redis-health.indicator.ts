import { Injectable, Logger } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { CacheService } from '../../common/cache/cache.service';

/**
 * Redis Health Indicator
 * Verifica la conectividad con Redis
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor(private readonly cacheService: CacheService) {
    super();
  }

  /**
   * Verifica si Redis está disponible
   * Intenta realizar una operación de set/get
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const testKey = 'health:check:redis';
    const testValue = Date.now().toString();

    try {
      // Intentar escribir en Redis
      await this.cacheService.set(testKey, testValue, 5000); // TTL 5 segundos

      // Intentar leer de Redis
      const result = await this.cacheService.get<string>(testKey);

      if (result === testValue) {
        this.logger.debug('Redis health check passed');
        return this.getStatus(key, true, { message: 'Redis is healthy' });
      }

      throw new Error('Redis read/write test failed');
    } catch (error: any) {
      this.logger.error(`Redis health check failed: ${error?.message || 'Unknown error'}`);
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, {
          message: error?.message || 'Unknown error',
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }
}
