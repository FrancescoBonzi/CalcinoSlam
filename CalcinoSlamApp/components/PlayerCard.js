import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function PlayerCard({item, setPartecipants}) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: item.image,
          }}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#a8d0e6',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 7,
    marginLeft: 7,
    height: 70,
    width: 70,
    padding: 5,
  },
  image: {
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  username: {
    fontWeight: '600',
    color: '#24305e',
  },
});
