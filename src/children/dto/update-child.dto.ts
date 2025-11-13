import { PartialType } from '@nestjs/swagger';
import { CreateChildDto } from './create-child.dto';

/**
 * DTO para actualizar un niño
 * Todos los campos son opcionales
 */
export class UpdateChildDto extends PartialType(CreateChildDto) {}
