import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Heeeeyy 🎉</Text>
      <Text style={styles.subtext}>Welcome to Campus Connect!</Text>
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
  text: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtext: {
    fontSize: 24,
    color: '#4a6fa5',
  },
});

export default WelcomeScreen;