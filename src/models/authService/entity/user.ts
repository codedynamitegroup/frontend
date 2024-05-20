import { UUID } from "crypto";

export interface User {
  userId: UUID;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  address: string;
  dob: Date;
}
