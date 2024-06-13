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
import { Comment } from "../interfaces/commentInterface";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const initialCommentState: Comment = {
  postId: 0,
  id: 0,
  name: "",
  email: "",
  body: "",
};

const Comments = ({ postId }: { postId: number }) => {
  const context = useContext(DataContext);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  if (!context) {
    return <Text>Error: Data context not found</Text>;
  }

  const { comments, setComments } = context;
  const currentUser = useCurrentUser();

  const [newComment, setNewComment] = useState<Comment>(initialCommentState);

  useEffect(() => {
    const maxId = Math.max(...comments.map((comment) => comment.id));
    setNewComment((prevNewComment) => ({
      ...prevNewComment,
      id: maxId,
    }));
  }, [comments]);

  const handleInputChange = (name: string, value: string) => {
    setNewComment({
      ...newComment,
      [name]: value,
    });
  };

  const handleAddComment = () => {
    const maxId = Math.max(...comments.map((comment) => comment.id));
    const newCommentWithPostId: Comment = {
      ...newComment,
      postId,
      id: maxId + 1,
      email: currentUser?.email || "Unknown User",
    };
    if (newComment.name.trim() === "" || newComment.body.trim() === "") {
      alert("Name and body are required!");
      return;
    }
    setComments([newCommentWithPostId, ...comments]);
    setNewComment(initialCommentState);
  };

  const handleDeleteComment = (commentId: number) => {
    const updatedComments = comments.filter(
      (comment: Comment) => comment.id !== commentId
    );
    setComments(updatedComments);
  };

  const filteredComments = comments.filter(
    (comment) => comment.postId === postId
  );

  return (
    <SafeAreaView
      style={[styles.commentsSection, isDarkMode && styles.commentsSectionDark]}
    >
      <View style={[styles.addComment, isDarkMode && styles.addCommentDark]}>
        <TextInput
          style={[
            styles.addCommentInput,
            isDarkMode && styles.addCommentInputDark,
          ]}
          placeholder="Enter comment title"
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
          value={newComment.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
        <TextInput
          style={[
            styles.addCommentInput,
            isDarkMode && styles.addCommentInputDark,
          ]}
          placeholder="Enter comment text"
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
          value={newComment.body}
          onChangeText={(text) => handleInputChange("body", text)}
        />
        <Button title="Add Comment" onPress={handleAddComment} />
      </View>
      <FlatList
        data={filteredComments}
        renderItem={({ item }) => (
          <View style={[styles.comment, isDarkMode && styles.commentDark]}>
            <View style={styles.commentUserInfo}>
              <Image
                source={require("@/assets/images/usericon.png")}
                style={styles.commentImage}
              />
              <Text
                style={[styles.commentEmail, isDarkMode && styles.textDark]}
              >
                {item.email}
              </Text>
            </View>
            <Text style={[styles.commentTitle, isDarkMode && styles.textDark]}>
              {item.name}
            </Text>
            <Text style={[styles.commentBody, isDarkMode && styles.textDark]}>
              {item.body}
            </Text>
            {item.email === currentUser?.email && (
              <Button
                title="Delete Comment"
                onPress={() => handleDeleteComment(item.id)}
              />
            )}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  commentsSection: {
    backgroundColor: "#ededed",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  commentsSectionDark: {
    backgroundColor: "#151718",
    borderColor: "#555",
  },
  comment: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#e4e4e4",
  },
  commentDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
  },
  addComment: {
    backgroundColor: "#e4e4e4",
    padding: 10,
    borderWidth: 1,
    borderColor: "#090909",
    borderRadius: 5,
    marginBottom: 20,
    marginTop: -20,
  },
  addCommentDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
  },
  addCommentInput: {
    marginBottom: 5,
    padding: 5,
    borderWidth: 1,
    color: "#000000",
  },
  addCommentInputDark: {
    backgroundColor: "#333333",
    borderColor: "#555",
    color: "#ffffff",
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  commentTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#000000",
  },
  commentBody: {
    marginTop: 10,
    borderRadius: 5,
    color: "#000000",
  },
  commentImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 3,
    borderColor: "#61bbc7",
  },
  commentEmail: {
    color: "#000000",
  },
  textDark: {
    color: "#ECEDEE",
  },
});

export default Comments;
