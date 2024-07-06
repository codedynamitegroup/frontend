export interface RubricUserEntity {
  id: string;
  name: string;
  description: string;
  content: string;
}

export interface CreateRubricUserCommand {
  rubricName: string;
  rubricDescription: string;
  rubricContent: string;
  userId: string;
}

export interface UpdateRubricUserCommand {
  rubricUserId: string;
  rubricName?: string;
  rubricDescription?: string;
  rubricContent?: string;
}
