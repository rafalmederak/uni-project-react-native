import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DataContext } from "../DataContext";

const Home = () => {
  const context = useContext(DataContext);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  if (!context) {
    return <Text>Error: Data context not found</Text>;
  }

  const { posts, users } = context;

  const getUserName = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user?.name || "Unknown User";
  };

  if (!posts.length) {
    return (
      <SafeAreaView
        style={[styles.container, isDarkMode && styles.containerDark]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/react-logo.png")}
            style={styles.logo}
          />
          <Text style={[styles.title, isDarkMode && styles.textDark]}>
            React Native Project Uni
          </Text>
        </View>
        <View style={styles.noPostsContainer}>
          <Text style={[styles.noPostsText, isDarkMode && styles.textDark]}>
            No posts available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const latestPost = posts[posts.length - 1];

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.logo}
        />
        <Text style={[styles.title, isDarkMode && styles.textDark]}>
          React Native Project Uni
        </Text>
      </View>
      <View style={styles.postContainer}>
        <Text style={[styles.subtitle, isDarkMode && styles.textDark]}>
          Latest Post
        </Text>
        <View
          key={latestPost.id}
          style={[styles.post, isDarkMode && styles.postDark]}
        >
          <View style={styles.userInfo}>
            <Image
              source={require("@/assets/images/usericon.png")}
              style={styles.userImage}
            />
            <Text style={isDarkMode && styles.textDark}>
              {getUserName(latestPost.userId)}
            </Text>
          </View>
          <Text style={[styles.postTitle, isDarkMode && styles.textDark]}>
            {latestPost.title}
          </Text>
          <Text style={[styles.postText, isDarkMode && styles.textDark]}>
            {latestPost.body}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  containerDark: {
    backgroundColor: "#151718",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 20,
    color: "gray",
  },
  postContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#000",
  },
  post: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#090909",
    borderRadius: 5,
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#e4e4e4",
  },
  postDark: {
    backgroundColor: "#333",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 3,
    borderColor: "#61bbc7",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
    color: "#000",
  },
  textDark: {
    color: "#ECEDEE",
  },
});

export default Home;
