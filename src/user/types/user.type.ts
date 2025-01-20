import { Role } from 'src/common/enums';

export type RequestUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

export type SafeUser = RequestUser & {
  nuid: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};
