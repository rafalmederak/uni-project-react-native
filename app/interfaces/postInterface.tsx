import { User } from "../interfaces/userInterface";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostsProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  users: User[];
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  currentUser: {
    email: string;
    name:string;
    id: number;
  } 
  | null;
}