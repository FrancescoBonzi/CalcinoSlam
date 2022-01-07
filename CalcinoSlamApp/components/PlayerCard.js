import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function PlayerCard({item, partecipants, setPartecipants}) {
  function addOrRemoveItem(id) {
    if (partecipants.includes(id)) {
      partecipants.splice(partecipants.indexOf(id), 1);
      setPartecipants([...partecipants]);
    } else {
      partecipants.push(id);
      setPartecipants([...partecipants]);
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => addOrRemoveItem(item.id)}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: partecipants.includes(item.id)
                ? '#9cffb1'
                : '#c7e7ff',
            },
          ]}>
          <Image
            style={styles.image}
            source={{
              uri: item.image,
            }}
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '23%',
    marginBottom: '2%',
    marginRight: '2%',
    position: 'relative',
  },
  card: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#d4d7ff',
    alignItems: 'center',
    borderRadius: 5,
    position: 'relative',
  },
  image: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: '15%',
    left: '25%',
  },
  username: {
    fontWeight: '600',
    color: '#24305e',
    position: 'absolute',
    top: '70%',
  },
});
