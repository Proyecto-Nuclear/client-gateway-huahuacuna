import { SetMetadata } from '@nestjs/common';

export const KAFKA_TOPICS = 'KAFKA_TOPICS';
export function KafkaTopics(...topics: string[]) {
  return SetMetadata(KAFKA_TOPICS, topics);
}
