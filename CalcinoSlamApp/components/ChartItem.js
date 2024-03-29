import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import getPlayerImages from '../playerImages';

export default function ChartItem({item, index, onPress}) {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.position}>{index + 1}°</Text>
          <Image
            style={styles.image}
            source={getPlayerImages(item.id_player)}
          />
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.score}>{item.score}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'white', //'#ffb3ba', //'#d4d7ff',
    borderRadius: 10,
    marginTop: '3%',
  },
  image: {
    alignItems: 'center',
    width: 50,
    height: 50,
    marginTop: 7.5,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    position: 'relative',
    left: '20%',
  },
  position: {
    fontWeight: '800',
    fontSize: 28,
    paddingLeft: '5%',
    alignSelf: 'center',
    color: '#a92a35',
  },
  username: {
    fontWeight: '700',
    fontSize: 24,
    left: '40%',
    alignSelf: 'center',
  },
  score: {
    fontWeight: '800',
    fontSize: 28,
    alignSelf: 'center',
    color: '#a92a35',
    position: 'absolute',
    right: '5%',
  },
});
