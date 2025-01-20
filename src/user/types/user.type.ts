import { Role } from 'src/common/enums';

export type RequestUser = {
  id: string;
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
