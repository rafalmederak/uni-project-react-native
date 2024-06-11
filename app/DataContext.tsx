import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "./interfaces/userInterface";
import { Photo } from "./interfaces/photoInterface";
import { Album } from "./interfaces/albumInterface";
import { Comment } from "./interfaces/commentInterface";
import { Post } from "./interfaces/postInterface";

type DataContextType = {
  users: User[];
  posts: Post[];
  comments: Comment[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  currentUser?: User | null;
  photos: Photo[];
  albums: Album[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data));

    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((data: Photo[]) => setPhotos(data.slice(0, 100)));

    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((response) => response.json())
      .then((data: Album[]) => setAlbums(data))
      .catch((error) => console.error("Error fetching albums:", error));
      
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data));

    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((res) => res.json())
      .then((data: Comment[]) => setComments(data));
  }, []);

  return (
    <DataContext.Provider value={{ users, posts, comments, setPosts, setComments, currentUser, photos, albums }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider, DataContext };
