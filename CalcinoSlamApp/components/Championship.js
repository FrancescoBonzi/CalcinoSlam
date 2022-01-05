import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import ChampionshipCreation from './ChampionshipCreation';
import Noticeboard from './Noticeboard';

export default function Championship({navigation}) {
  const [existingChampionship, setExistingChampionship] = useState(false);
  const [championshipsInProgress, setChampionshipsInProgress] = useState(null);
  const [locations, setLocations] = useState(null);
  const [players, setPlayers] = useState(null);

  const getLocations = async () => {
    try {
      const response = await fetch('http://localhost:3003/get_locations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_locations: [],
        }),
      });
      const json = await response.json();
      setLocations(json);
    } catch (error) {
      console.error(error);
    }
  };
  const getPlayers = async () => {
    try {
      const response = await fetch('http://localhost:3003/get_players', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_players: [],
        }),
      });
      const json = await response.json();
      setPlayers(json);
    } catch (error) {
      console.error(error);
    }
  };
  const getChampionshipsInProgress = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championships_in_progress?id_player=1',
      );
      const json = await response.json();
      setChampionshipsInProgress(json);
      if (json.length !== 0) {
        setExistingChampionship(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChampionshipsInProgress();
    getPlayers();
    getLocations();
  }, []);

  return (
    <View style={styles.container}>
      {locations === null ||
      players === null ||
      championshipsInProgress === null ? (
        <ActivityIndicator />
      ) : existingChampionship ? (
        <Noticeboard
          id_championship={championshipsInProgress[0].id}
          locations={locations}
          players={players}
        />
      ) : (
        <ChampionshipCreation locations={locations} players={players} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
