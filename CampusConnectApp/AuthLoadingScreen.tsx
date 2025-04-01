import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AuthLoadingScreen = ({ navigation }: any) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user exists and email is verified they head to Welcome Screen
      if (user?.emailVerified) {
        navigation.replace('Home');
      } 
      // Otherwise they go back to Login Screen
      else {
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a6fa5" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0a192f', 
  },
});

export default AuthLoadingScreen;