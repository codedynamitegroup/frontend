import { User } from "./user";

export interface OrganizationEntity {
  organizationId: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  apiKey: string;
  moodleUrl: string;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isVerified: boolean;
}

export interface CreateOrganizationRequest {
  email: string;
  description?: string;
  name: string;
  phone: string;
  address: string;
}

export interface UpdateOrganizationBySystemAdminRequest {
  isVerified: boolean;
  isDeleted: boolean;
}
