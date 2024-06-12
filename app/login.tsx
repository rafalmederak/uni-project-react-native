import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { DataContext } from "./DataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const context = useContext(DataContext);

  if (!context) {
    return <Text>Error: User posts not found</Text>;
  }

  const { setCurrentUser } = context;
  const { users } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const correctPassword = "uni";
    const correctUser = users.find((user) => user.email === email);

    if (password === correctPassword && email === correctUser?.email) {
      setCurrentUser(correctUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(correctUser));
    } else {
      Alert.alert("Error", "Incorrect password or email");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Project Uni</Text>
      <View style={styles.formWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    height: 40,
    borderColor: "rgb(110, 110, 110)",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Login;
