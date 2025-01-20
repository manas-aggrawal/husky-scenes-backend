export type JwtPayload = {
  role: string;
  firstName: string;
  lastName: string;
  sub: string;
  createdAt: Date;
  updatedAt: Date;
};
