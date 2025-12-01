import { IsString, IsNotEmpty, IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Nombre del donante' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  donorName: string;

  @ApiProperty({ description: 'URL de foto del donante', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  donorPhoto?: string;

  @ApiProperty({ description: 'Testimonio del donante' })
  @IsString()
  @IsNotEmpty()
  testimonial: string;

  @ApiProperty({ description: 'Monto donado en centavos', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  donationAmount?: number;
}
