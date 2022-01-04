import React, {useState} from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Text,
  Button,
  TextInput,
  View,
  StyleSheet,
  Platform,
  FlatList,
  Keyboard,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import PlayerCard from './PlayerCard';
import LocationCard from './LocationCard';

export default function ChampionshipCreation({locations, players}) {
  console.log(locations);
  const [location, setLocation] = useState(null);
  const [partecipants, setPartecipants] = useState(null);
  const createChampionship = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/create_championship',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_player: partecipants,
            type: 'GIRONE',
            location: location,
            name: '',
            comment: '',
          }),
        },
      );
      const json = await response.json();
      if (json.championship_approved) {
        Alert.alert('Il torneo è stato creato\nBuon divertimento!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.inner}>
              <Text style={styles.header}>Crea un Torneo</Text>
              <TextInput placeholder="Titolo" style={styles.textInput} />
              <TextInput
                placeholder="Tipo di Campionato"
                style={styles.textInput}
              />
              <Text style={styles.header}>Scegli lo stadio:</Text>
              <View style={styles.locations}>
                <FlatList
                  data={locations}
                  renderItem={({item}) => (
                    <LocationCard item={item} setLocation={setLocation} />
                  )}
                  pagingEnabled
                />
              </View>
              <Text style={styles.header}>Scegli i giocatori:</Text>
              <View style={styles.players}>
                <FlatList
                  data={players}
                  renderItem={({item}) => (
                    <PlayerCard item={item} setPlayers={setPartecipants} />
                  )}
                  contentContainerStyle={{alignSelf: 'flex-start'}}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <TextInput
                placeholder="Scrivi qualche gag per incidere questa serata sulla pietra"
                style={styles.commentText}
              />
              <View style={styles.btnContainer}>
                <Button title="Crea" onPress={() => createChampionship()} />
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  inner: {
    padding: 24,
  },
  header: {
    fontSize: 36,
    marginBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  locations: {
    height: 200,
    width: '100%',
  },
  players: {
    width: '100%',
  },
});
