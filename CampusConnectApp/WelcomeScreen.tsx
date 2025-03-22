import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig';

const WelcomeScreen = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Campus Connect! 🎉</Text>
      <Button title="Logout" onPress={handleLogout} color="#1a73e8" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a192f',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default WelcomeScreen;