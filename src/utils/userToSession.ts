import { User } from "models";

export const userToSession = (user: User): UserInSession => ({
  userId: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
});

interface UserInSession {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
