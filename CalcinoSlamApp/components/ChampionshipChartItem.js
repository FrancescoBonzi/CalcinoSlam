import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import getPlayerImages from '../playerImages';

export default function ChampionshipChartItem({item, players}) {
  const p1 = players.find(o => o.id == item.id_players[0]);
  const p2 = players.find(o => o.id == item.id_players[1]);
  return (
    <View style={styles.card}>
      <View style={styles.player_box_left}>
        <Image style={styles.player_image} source={getPlayerImages(p1.id)} />
        <Text style={styles.player_username}>{p1.username}</Text>
      </View>
      <View style={styles.player_box_right}>
        <Image style={styles.player_image} source={getPlayerImages(p2.id)} />
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
    position: 'absolute',
    top: '25%',
  },
  final_score: {
    fontWeight: '800',
    fontSize: 28,
    color: '#a92a35',
    position: 'absolute',
    top: '70%',
  },
  card: {
    marginBottom: '3%',
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingBottom: 20,
    position: 'relative',
    backgroundColor: '#c7e7ff',
  },
  player_box_left: {
    alignItems: 'center',
    paddingTop: 20,
    position: 'relative',
    marginHorizontal: '20%',
  },
  player_box_right: {
    alignItems: 'center',
    paddingTop: 20,
    position: 'relative',
    marginHorizontal: '20%',
  },
  player_image: {
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  player_username: {
    top: '10%',
    fontWeight: '700',
  },
});
