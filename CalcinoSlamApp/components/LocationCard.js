import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function LocationCard({item, location, setLocation}) {
  return (
    <TouchableOpacity onPress={() => setLocation(item.id)}>
      <View
        style={[
          styles.container,
          {backgroundColor: location == item.id ? '#9cffb1' : '#c7e7ff'},
        ]}>
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
    width: '100%',
    marginBottom: '2%',
    position: 'relative',
    backgroundColor: '#d4d7ff',
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: '15%',
    left: '25%',
  },
  name: {
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 80,
    marginVertical: 15,
    color: '#24305e',
    right: '10%',
  },
});
