import { KafkaOptions, Transport } from "@nestjs/microservices";
import { EnvsConfig } from "../../config/env.config";
import { KAFKA_MICROSERVICES } from "./kafka.constants";

export function createKafkaClients(): (KafkaOptions & { name: string })[] {
	return KAFKA_MICROSERVICES.map((service) => ({
		name: `${service.toUpperCase().replace(/-/g, '_')}_SERVICE`,
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: [EnvsConfig.KAFKA_BROKER],
				clientId: `gateway-${service}`,
				connectionTimeout: 3000,
				requestTimeout: 5000,
			},
			consumer: {
				groupId: `gateway-${service}-consumer`,
				maxWaitTimeInMs: 100,
			},
		},
	})) as (KafkaOptions & { name: string })[];
}
