import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { UserDetailProps } from "../interfaces/profileInterface";
import { DataContext } from "../DataContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const UserDetail = () => {
  const context = useContext(DataContext);
  const router = useRouter();

  if (!context) {
    return <Text>Error: User posts not found</Text>;
  }

  const { posts, setCurrentUser } = context;
  const currentUser = useCurrentUser();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const userPosts = posts.filter((post) => post?.userId === currentUser?.id);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView
        contentContainerStyle={[
          styles.userDetail,
          isDarkMode && styles.userDetailDark,
        ]}
      >
        <Button title="Logout" onPress={handleLogout} />
        <Image
          source={require("@/assets/images/usericon.png")}
          style={styles.userImage}
        />
        <Text style={[styles.userName, isDarkMode && styles.textDark]}>
          {currentUser?.name}
        </Text>
        <Text style={[styles.userEmail, isDarkMode && styles.textDark]}>
          Email: {currentUser?.email}
        </Text>
        <Text style={[styles.userCompany, isDarkMode && styles.textDark]}>
          Company: {currentUser?.company.name}
        </Text>
        <Text style={[styles.postsHeader, isDarkMode && styles.textDark]}>
          Posts
        </Text>
        {userPosts.map((post) => (
          <View
            style={[styles.userPost, isDarkMode && styles.userPostDark]}
            key={post.id}
          >
            <Text style={[styles.postTitle, isDarkMode && styles.textDark]}>
              {post.title}
            </Text>
            <Text style={[styles.postBody, isDarkMode && styles.textDark]}>
              {post.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeAreaDark: {
    flex: 1,
    backgroundColor: "#151718",
  },
  userDetail: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    color: "#000000",
  },
  userDetailDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#fff",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 3,
    borderColor: "#61bbc7",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
  },
  userCompany: {
    fontSize: 16,
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  userPost: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    shadowColor: "#A57C7C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%",
  },
  userPostDark: {
    backgroundColor: "#444",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postBody: {
    fontSize: 16,
    color: "#555",
  },
  textDark: {
    color: "#fff",
  },
});

export default UserDetail;
