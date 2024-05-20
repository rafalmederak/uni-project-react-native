import React, { useState } from 'react';
import { View, TextInput, FlatList, Image, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {User} from '../interfaces/userInterface';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const usersData: User[] = [
  { id: 1, name: 'User 1', email: 'email1@example.com', company: { name: 'Company 1' } },
  { id: 2, name: 'User 2', email: 'email2@example.com', company: { name: 'Company 2' } },
  { id: 3, name: 'User 3', email: 'email3@example.com', company: { name: 'Company 3' } },
  { id: 4, name: 'User 4', email: 'email4@example.com', company: { name: 'Company 4' } },
  { id: 5, name: 'User 5', email: 'email5@example.com', company: { name: 'Company 5' } },
  { id: 6, name: 'User 6', email: 'email6@example.com', company: { name: 'Company 6' } },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (text: string) => setSearchTerm(text.toLowerCase());

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.company.name.toLowerCase().includes(searchTerm)
  );

  const renderItem = ({ item }: { item: User }) => (
    <ThemedView style={styles.userCard}>
      <Image source={require('@/assets/images/usericon.png')} style={styles.userImage} />
      <ThemedText style={styles.userName}>{item.name}</ThemedText>
      <ThemedText style={styles.userEmail}>{item.email}</ThemedText>
      <ThemedText style={styles.userCompany}>{item.company.name}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={handleSearch}
          placeholder="Search..."
        />
      </ThemedView>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.usersContainer}
        ListEmptyComponent={<Text style={styles.noUsers}>No users found.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
  },
  usersContainer: {
    justifyContent: 'space-around',
    marginBottom: -200
  },
  userCard: {
    marginBottom: 10,
    padding: 15,
    borderColor: '#090909',
    borderWidth: 3,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#61bbc7',
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    marginTop: 5,
    fontSize: 16,
  },
  userCompany: {
    marginTop: 5,
    fontSize: 16,
  },
  noUsers: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Users;
