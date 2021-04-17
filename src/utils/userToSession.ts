import { User } from "models";

export const userToSession = (user: User): UserInSession => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
});

interface UserInSession {
  firstName: string;
  lastName: string;
  email: string;
}
