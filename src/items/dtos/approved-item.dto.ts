import { IsBoolean } from 'class-validator';
export class ApprovedItemDTO {
  @IsBoolean()
  approved: boolean;
}
