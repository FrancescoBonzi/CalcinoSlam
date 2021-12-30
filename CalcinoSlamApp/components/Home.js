import React from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';

export default function Card() {
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, {width}]}>
      <Text>YeppaYeppa!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
