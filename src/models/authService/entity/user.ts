import { UUID } from "crypto";
import { OrganizationEntity } from "models/coreService/entity/OrganizationEntity";
import { RoleEntity } from "./role";

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  address: string;
  dob: Date;
  lastLogin: string;
  isLinkedWithGoogle: boolean;
  isLinkedWithMicrosoft: boolean;
  organization: OrganizationEntity;
  createdAt: Date;
  roles: RoleEntity[];
  isDeleted: boolean;
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
  phone: string;
}

export interface CreatedUserByAdminRequest {
  email: string;
  password: string;
  firstName: string;
  phone: string;
  lastName: string;
  roleName: string;
}

export interface UpdateProfileUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dob?: Date;
  phone: string;
}

export interface UpdateUserByAdminRequest {
  firstName: string;
  lastName: string;
  dob?: Date;
  phone: string;
  roleName: string;
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
