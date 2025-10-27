import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, ModuleRef, Reflector } from "@nestjs/core";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_TOPICS } from "../decorators/kafka-topic.decorator";
import { KAFKA_MICROSERVICES } from "./kafka.constants";

type AnyFunction = (...args: unknown[]) => unknown;

@Injectable()
class KafkaSubscriberService implements OnModuleInit {
  private readonly logger = new Logger(KafkaSubscriberService.name);
  private readonly clients: Map<string, ClientKafka> = new Map();

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    for (const service of KAFKA_MICROSERVICES) {
      const token = `${service.toUpperCase().replace(/-/g, '_')}_SERVICE`;
      try {
        const client = this.moduleRef.get<ClientKafka>(token, {
          strict: false,
        });
        if (client) {
          this.clients.set(service, client);
        }
      } catch (e) {
        this.logger.error(`Failed to inject Kafka client for ${service}: ${e}`);
      }
    }

    const topicsByService: Record<string, Set<string>> = {};
    for (const service of KAFKA_MICROSERVICES) {
      topicsByService[service] = new Set<string>();
    }

    const controllers = this.discovery.getControllers();
    for (const { instance, metatype } of controllers) {
      if (!instance || !metatype) continue;
      const prototype = Object.getPrototypeOf(instance) as Record<
        string,
        AnyFunction
      >;
      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === 'constructor') continue;
        const method = prototype[methodName];

        // Validar que el método existe
        if (!method) continue;

        // Obtener metadata con validación de tipo
        const topicsMeta = this.reflector.get<string[]>(
          KAFKA_TOPICS,
          method,
        );

        // Validar que topicsMeta sea un array
        if (topicsMeta && Array.isArray(topicsMeta)) {
          for (const t of topicsMeta) {
            const targetService = KAFKA_MICROSERVICES.find(
              (ms) =>
                t.startsWith(`${ms.replace(/-/g, '_')}_`) ||
                t.startsWith(`${ms}_`),
            );
            if (targetService && topicsByService[targetService]) {
              topicsByService[targetService].add(t);
            } else if (!targetService) {
              this.logger.warn(
                `The topic ${t} could not be assigned to any microservice.`,
              );
            }
          }
        }
      }
    }

    for (const [service, client] of this.clients.entries()) {
      const topics = topicsByService[service];
      if (topics) {
        for (const topic of topics) {
          client.subscribeToResponseOf(topic);
        }
      }
      await client.connect();
      this.logger.log(`✔  Kafka client connected: ${service}`);
    }
  }
}

export default KafkaSubscriberService;