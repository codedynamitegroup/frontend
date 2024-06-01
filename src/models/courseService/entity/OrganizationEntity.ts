export interface OrganizationEntity {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
  moodleUrl: string;
  isDeleted: boolean;
}
