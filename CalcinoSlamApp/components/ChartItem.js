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

export default function ChartItem({item}) {
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, {width}]}>
      <Image
        style={styles.image}
        source={{
          uri: item.image,
        }}
      />
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#a8d0e6',
    borderRadius: 5,
    marginTop: 7,
    marginRight: 7,
    marginLeft: 7,
  },
  image: {
    alignItems: 'center',
    width: 50,
    height: 50,
    marginTop: 7.5,
    position: 'absolute',
    left: '5%',
  },
  username: {
    fontWeight: '600',
    fontSize: 28,
    marginLeft: 80,
    marginVertical: 15,
    color: '#24305e',
    left: '20%',
  },
  score: {
    fontWeight: '800',
    fontSize: 28,
    color: '#f76c6c',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginVertical: 15,
    position: 'absolute',
    left: '70%',
  },
});
