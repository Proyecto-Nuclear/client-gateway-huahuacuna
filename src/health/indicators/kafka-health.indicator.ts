import { Injectable, Logger } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { EnvsConfig } from '../../config/env.config';

/**
 * Kafka Health Indicator
 * Verifica la conectividad con Apache Kafka
 */
@Injectable()
export class KafkaHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(KafkaHealthIndicator.name);

  /**
   * Verifica si Kafka está disponible
   * Intenta conectarse al broker de Kafka
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const { Kafka } = await import('kafkajs');

      const kafka = new Kafka({
        clientId: 'health-check',
        brokers: [EnvsConfig.KAFKA_BROKER],
        connectionTimeout: 3000,
        requestTimeout: 5000,
      });

      const admin = kafka.admin();

      // Intentar conectar y listar tópicos
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();

      this.logger.debug('Kafka health check passed');
      return this.getStatus(key, true, {
        message: 'Kafka is healthy',
        broker: EnvsConfig.KAFKA_BROKER,
      });
    } catch (error: any) {
      this.logger.error(`Kafka health check failed: ${error?.message || 'Unknown error'}`);
      throw new HealthCheckError(
        'Kafka check failed',
        this.getStatus(key, false, {
          message: error?.message || 'Unknown error',
          broker: EnvsConfig.KAFKA_BROKER,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }
}
