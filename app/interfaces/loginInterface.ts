import { User } from "./userInterface";

export interface LoginProps {
  users: User[];
  setCurrentUser: (user: User) => void;
}
