import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "@/app/DataContext";

export const useCurrentUser = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useCurrentUser must be used within a DataProvider");
  }

  const { currentUser, setCurrentUser } = context;

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("currentUser");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to fetch the data from storage", error);
      }
    };

    fetchUserFromStorage();
  }, []);

  return currentUser;
};
