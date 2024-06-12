import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "./interfaces/userInterface";
import { Photo } from "./interfaces/photoInterface";
import { Album } from "./interfaces/albumInterface";

type DataContextType = {
  users: User[];
  photos: Photo[];
  albums: Album[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

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
  }, []);

  return (
    <DataContext.Provider value={{ users, photos, albums }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataProvider, DataContext };