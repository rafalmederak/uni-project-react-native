import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  FlatList,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import { DataContext } from "../DataContext";
import { Post } from "../interfaces/postInterface";
import { User } from "../interfaces/userInterface";
import Comments from "../components/comments";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialPostState: Post = {
  userId: 0,
  id: 0,
  title: "",
  body: "",
};

const Posts = () => {
  const context = useContext(DataContext);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  if (!context) {
    return <Text>Error: Data context not found</Text>;
  }

  const { posts, setPosts, users } = context;
  const currentUser = useCurrentUser();

  const [newPost, setNewPost] = useState<Post>(initialPostState);
  const [showComments, setShowComments] = useState<number | null>(null);

  useEffect(() => {
    const maxId = Math.max(...posts.map((post) => post.id));
    setNewPost((prevNewPost) => ({
      ...prevNewPost,
      id: maxId,
    }));
  }, [posts]);

  const handleInputChange = (name: string, value: string) => {
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleAddPost = () => {
    const maxId = Math.max(...posts.map((post) => post.id));
    const newPostWithId: Post = {
      ...newPost,
      id: maxId + 1,
      userId: currentUser?.id || 0,
    };
    if (newPost.title.trim() === "" || newPost.body.trim() === "") {
      alert("Title and body are required!");
      return;
    }
    setPosts([newPostWithId, ...posts]);
    setNewPost(initialPostState);
  };

  const handleDeletePost = (postId: number) => {
    const updatedPosts = posts.filter((post: Post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const getUserName = (userId: number) => {
    const user = users.find((user: User) => user.id === userId);
    return user?.name || "Unknown User";
  };

  const handleShowComments = (postId: number) => {
    setShowComments((prevId) => (prevId === postId ? null : postId));
  };

  return (
    <SafeAreaView
      style={[styles.postsContainer, isDarkMode && styles.containerDark]}
    >
      <View style={[styles.addPost, isDarkMode && styles.addPostDark]}>
        <TextInput
          style={[styles.addPostInput, isDarkMode && styles.addPostInputDark]}
          placeholder="Enter post title"
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
          value={newPost.title}
          onChangeText={(text) => handleInputChange("title", text)}
        />
        <TextInput
          style={[styles.addPostInput, isDarkMode && styles.addPostInputDark]}
          placeholder="Enter post text"
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
          value={newPost.body}
          onChangeText={(text) => handleInputChange("body", text)}
        />
        <Button title="Add Post" onPress={handleAddPost} />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={[styles.post, isDarkMode && styles.postDark]}>
            <View style={styles.userInfo}>
              <Image
                source={require("@/assets/images/usericon.png")}
                style={styles.userImage}
              />
              <Text style={[styles.userName, isDarkMode && styles.textDark]}>
                {getUserName(item.userId)}
              </Text>
            </View>
            <Text style={[styles.postTitle, isDarkMode && styles.textDark]}>
              {item.title}
            </Text>
            <Text style={[styles.postText, isDarkMode && styles.textDark]}>
              {item.body}
            </Text>
            {item.userId === currentUser?.id && (
              <Button
                title="Delete Post"
                onPress={() => handleDeletePost(item.id)}
              />
            )}
            <Button
              title={
                showComments === item.id ? "Hide Comments" : "Show Comments"
              }
              onPress={() => handleShowComments(item.id)}
            />
            {showComments === item.id && <Comments postId={item.id} />}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  postsContainer: {
    alignItems: "center",
    padding: 15,
  },
  containerDark: {
    backgroundColor: "#151718",
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
    backgroundColor: "#333333",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 3,
    borderColor: "#61bbc7",
  },
  userName: {
    color: "#000000",
  },
  postTitle: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  postText: {
    marginBottom: 10,
    color: "#000000",
  },
  textDark: {
    color: "#ECEDEE",
  },
  addPost: {
    width: "100%",
    backgroundColor: "#e4e4e4",
    padding: 10,
    borderWidth: 1,
    borderColor: "#090909",
    borderRadius: 5,
    marginBottom: 20,
  },
  addPostDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
  },
  addPostInput: {
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    color: "#000000",
  },
  addPostInputDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#ffffff",
  },
});

export default Posts;
