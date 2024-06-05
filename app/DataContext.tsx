import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "./interfaces/userInterface";

type DataContextType = {
  users: User[];
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
      });

    //another data
  }, []);

  return (
    <DataContext.Provider value={{ users }}>{children}</DataContext.Provider>
  );
};

export { DataProvider, DataContext };
