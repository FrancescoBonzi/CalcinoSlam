import React, {useState} from 'react';
import {Text, Button, View, StyleSheet, Alert, ScrollView} from 'react-native';
import PlayerCard from './PlayerCard';
import LocationCard from './LocationCard';
import ChampionshipTypeItem from './ChampionshipTypeItem';
import config from '../config';

export default function CreateChampionship({route, navigation}) {
  const {players, locations} = route.params;
  const [location, setLocation] = useState(null);
  const [partecipants, setPartecipants] = useState([]);
  const [type, setType] = useState(0);
  const createChampionship = async () => {
    const type_name = type == 0 ? 'GIRONE' : 'ELIMINAZIONE';
    if (location == null) {
      Alert.alert('Scegli uno stadio!');
    } else if (partecipants.length % 2 == 1) {
      Alert.alert('Scegli un numero pari di giocatori!');
    } else {
      console.log('Creo campionato...');
      try {
        const response = await fetch(
          config.host + ':' + config.port + '/create_championship',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_player: partecipants,
              type: type_name,
              location: location,
              organizer: 1,
              name: '',
              comment: '',
            }),
          },
        );
        const json = await response.json();
        console.log('campionato', json);
        if (json.championship_approved) {
          console.log('campionato creato con successo!');
          navigation.navigate('Teams', {
            id_championship: json.id_championship,
            players: players,
            locations: locations,
          });
        } else {
          Alert.alert(
            'Hai scelto un numero sbagliato di giocatori!\nGirone da 6 a 12\nEliminazione da 8 a 16',
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.main_container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Tipo di campionato</Text>
        <View style={styles.type}>
          <ChampionshipTypeItem index={0} type={type} setType={setType} />
          <ChampionshipTypeItem index={1} type={type} setType={setType} />
        </View>
        <Text style={styles.header}>Scegli lo stadio</Text>
        <View style={styles.locations}>
          {locations.map((item, index) => (
            <LocationCard
              item={item}
              location={location}
              setLocation={setLocation}
            />
          ))}
        </View>
        <Text style={styles.header}>Scegli i giocatori</Text>
        <View style={styles.players}>
          {players.map((item, index) => (
            <PlayerCard
              item={item}
              partecipants={partecipants}
              setPartecipants={setPartecipants}
            />
          ))}
        </View>
        <View style={styles.btnContainer}>
          <Button title="Crea" onPress={() => createChampionship()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '100%',
    width: '94%',
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 20,
    textTransform: 'uppercase',
    //color: '#4f3c75',
  },
  type: {
    flexDirection: 'row',
  },
  locations: {
    width: '100%',
  },
  players: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btnContainer: {
    backgroundColor: '#f2f0f1',
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 4,
    borderRadius: 5,
    borderWidth: 0,
  },
});
