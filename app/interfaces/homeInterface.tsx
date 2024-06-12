import { Post } from "../interfaces/postInterface";
import { User } from "../interfaces/userInterface";

export interface HomeProps {
  posts: Post[];
  users: User[];
}
