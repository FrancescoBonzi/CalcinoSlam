import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function LocationCard({item, setLocation}) {
  console.log(item);
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: item.image,
          }}
        />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </TouchableOpacity>
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
  name: {
    fontWeight: '600',
    fontSize: 28,
    marginLeft: 80,
    marginVertical: 15,
    color: '#24305e',
    left: '20%',
  },
});
