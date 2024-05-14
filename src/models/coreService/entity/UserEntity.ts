export interface UserEntity {
  userId: string;
  email?: string;
  firstName: string;
  lastName: string;
  dob?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export class UserResponse {
  // Get rid of all null values in the object
  static removeNullValues(user: UserEntity): UserEntity {
    const keys = Object.keys(user);
    keys.forEach((key) => {
      // @ts-ignore
      if (user[key] === null) {
        // @ts-ignore
        delete user[key];
      }
    });
    return user;
  }
}
