import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { KafkaTopics } from "./kafka-topic.decorator";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "./roles.decorator";
import { Role } from "../auth/jwt-payload.interface";

export function EndpointConfig(options: {
  kafkaTopic?: string;
  isProtected?: boolean;
  roles?: Role[];
}) {
  const decorators: Array<MethodDecorator | ClassDecorator> = [];

  if (options.kafkaTopic) {
    decorators.push(KafkaTopics(options.kafkaTopic));
  }

  if (options.isProtected) {
    decorators.push(UseGuards(JwtAuthGuard, RolesGuard));
    decorators.push(ApiBearerAuth());
  }

  if (options.roles && options.roles.length > 0) {
    decorators.push(Roles(...options.roles));
  }

  return applyDecorators(...decorators);
}
