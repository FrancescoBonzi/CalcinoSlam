import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

export default function ChampionshipChartItem({item, players}) {
  const p1 = players.find(o => o.id == item.id_players[0]);
  const p2 = players.find(o => o.id == item.id_players[1]);
  return (
    <View style={styles.card}>
      <View style={styles.player_box_left}>
        <Image
          style={styles.player_image}
          source={{
            uri: p1.image,
          }}
        />
        <Text style={styles.player_username}>{p1.username}</Text>
      </View>
      <View style={styles.player_box_right}>
        <Image
          style={styles.player_image}
          source={{
            uri: p2.image,
          }}
        />
        <Text style={styles.player_username}>{p2.username}</Text>
      </View>
      <Text style={styles.final_position}>{item.final_position + 1}°</Text>
      <Text style={styles.final_score}>{item.final_score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  final_position: {
    fontWeight: '800',
    fontSize: 28,
    color: '#f76c6c',
    textAlign: 'center',
    position: 'absolute',
    marginTop: 10,
  },
  final_score: {
    fontWeight: '800',
    fontSize: 28,
    color: 'blue',
    textAlign: 'center',
    position: 'absolute',
    marginTop: 50,
  },
  card: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f76c6c',
    marginHorizontal: 4,
    borderRadius: 5,
    padding: 10,
    paddingBottom: 20,
    position: 'relative',
  },
  player_box_left: {
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: '25%',
    marginTop: 10,
  },
  player_box_right: {
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: '25%',
    marginTop: 10,
  },
  player_image: {
    alignItems: 'center',
    width: 35,
    height: 35,
  },
});
