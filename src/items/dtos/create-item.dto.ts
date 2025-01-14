import { IsString, IsNumber, Min } from 'class-validator';
export class CreateItemDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  location: string;

  @IsString()
  category: string;

  @IsNumber()
  year: number;
}
