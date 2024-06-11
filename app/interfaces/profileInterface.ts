import { Post } from "./postInterface";
import { User } from "./userInterface";

export interface UserDetailProps {
  currentUser: User;
  posts: Post[];
}
