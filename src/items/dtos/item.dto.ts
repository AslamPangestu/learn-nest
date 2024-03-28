import { Expose, Transform } from 'class-transformer';

export class ItemDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  location: string;

  @Expose()
  category: string;

  @Expose()
  year: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
