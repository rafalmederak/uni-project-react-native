export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
 
}

export interface CommentsProps {
    postId: number;
    visible: boolean;
    comments:Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    currentUser: {
        email: string;
        name:string;
        id:number;
    } 
      | null;
    }