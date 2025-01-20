export type JwtPayload = {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sub: string;
  createdAt: Date;
  updatedAt: Date;
};
