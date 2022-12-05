import { UserEntity } from 'src/modules/v1/users/entities/users.entity';

export interface LoginI {
  user: UserEntity;
  token: string;
}
