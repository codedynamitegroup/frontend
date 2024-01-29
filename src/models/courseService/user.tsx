export interface User {
  id: number;
  email: string;
  dob: Date;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatarUrl: string;
  lastLogin: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
