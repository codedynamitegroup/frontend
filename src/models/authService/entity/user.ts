import { UUID } from "crypto";
import { RoleEntity } from "./role";
import { OrganizationEntity } from "./organization";

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
  organizationId?: string;
  email: string;
  password: string;
  firstName: string;
  phone: string;
  lastName: string;
  roleName: string;
}

export interface AssignUserToOrganizationRequest {
  organizationId: string;
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
  isDeleted?: boolean;
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

export enum EBelongToOrg {
  ALL = "ALL",
  BELONG_TO_ORGANIZATION = "BELONG_TO_ORGANIZATION",
  NOT_BELONG_TO_ORGANIZATION = "NOT_BELONG_TO_ORGANIZATION"
}
