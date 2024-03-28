import { Expose } from 'class-transformer';

export class LoginAuthDTO {
  @Expose()
  password: string;
  @Expose()
  email: string;
}
