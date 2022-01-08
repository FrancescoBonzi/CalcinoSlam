import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import getPlayerImages from '../playerImages';

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
          <Image style={styles.image} source={getPlayerImages(item.id)} />
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
    width: '60%',
    height: '60%',
    borderRadius: 100,
    position: 'absolute',
    top: '10%',
    left: '20%',
  },
  username: {
    fontWeight: '600',
    color: '#24305e',
    position: 'absolute',
    top: '75%',
  },
});
