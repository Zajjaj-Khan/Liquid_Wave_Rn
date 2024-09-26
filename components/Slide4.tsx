// Slide1.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Slide1 = () => {
  return (
    <View style={[styles.container, { backgroundColor: "#F2A1AD" }]}>
      <Image source={require('../assets/1.png')} style={styles.image} />
      <Text style={styles.title}>Dessert Recipes</Text>
      <Text style={styles.description}>
        Hot or cold, our dessert recipes can turn an average meal into a memorable event.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default Slide1;
