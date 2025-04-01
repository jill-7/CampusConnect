import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';




type User = {
  id: string;
  email: string;
  name?: string;
};

const ContactsScreen = ({ navigation } : { navigation: any }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try{
      const querySnapshot = await getDocs(collection(db, 'users'));
      const allUsers = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name || 'No name'
        }))
        .filter(user => user.id !== auth.currentUser?.uid);
      setUsers(allUsers);
    }catch (error) {
      console.error("Error fetching users: ",error);
    } finally {
      setLoading(false);
    }
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.noContacts}>No contacts found</Text>
      ) : (
      <FlatList
        data={users}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item } : { item: any }) => (
          <TouchableOpacity
            //style={styles.userItem}
            onPress={() => navigation.navigate('Chat', { otherUserId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  email: { fontSize: 14, color: '#666' },
  name: { fontSize: 16, fontWeight: 'bold' },
  noContacts: { textAlign: 'center', fontSize: 16, marginTop: 20 },
});

export default ContactsScreen;