import { UUID } from "crypto";
import { OrganizationEntity } from "models/coreService/entity/OrganizationEntity";
import { RoleEntity } from "./role";

export interface User {
  userId: UUID;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  address: string;
  dob: Date;
  isLinkedWithGoogle: boolean;
  isLinkedWithMicrosoft: boolean;
  organization: OrganizationEntity;
  createdAt: Date;
  roles: RoleEntity[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisteredRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileUserRequest {
  firstName: string;
  lastName: string;
  dob?: Date;
  phone?: string;
}

export interface UpdatePasswordUserRequest {
  oldPassword: string;
  newPassword: string;
}

export interface VerifyOTPUserRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordUserRequest {
  email: string;
  password: string;
  otp: string;
}
