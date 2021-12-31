import React from 'react';
import {View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';

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
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
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
  },
  info: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: '600',
    fontSize: 28,
    marginVertical: 15,
    color: '#24305e',
  },
  type: {
    fontWeight: '800',
    fontSize: 28,
    color: '#f76c6c',
    textAlign: 'center',
  },
});
