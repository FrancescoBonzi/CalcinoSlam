import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Players from './components/Players';
import Chart from './components/Chart';
import Teams from './components/Teams';
import Noticeboard from './components/Noticeboard';
import CreateChampionship from './components/CreateChampionship';
import config from './config';

const Stack = createNativeStackNavigator();

function HomeScreen({route, navigation}) {
  const [championshipInProgress, setChampionshipInProgress] = useState(null);
  const [locations, setLocations] = useState(null);
  const [players, setPlayers] = useState(null);
  const getLocations = async () => {
    try {
      const response = await fetch(config.host + '/get_locations', {
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
      const response = await fetch(config.host + '/get_players', {
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
        config.host + '/get_championships_in_progress?id_player=1',
      );
      const json = await response.json();
      console.log(json);
      setChampionshipInProgress(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlayers();
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    navigation.addListener('focus', () => {
      getChampionshipsInProgress();
    });
  }, [navigation]);
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {players == null ||
      locations == null ||
      championshipInProgress == null ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.header}>Calcino{'\n'}Slam</Text>
          <Image style={styles.logo} source={require('./assets/logo.png')} />
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                if (championshipInProgress.length > 0) {
                  navigation.navigate('Noticeboard', {
                    id_championship: championshipInProgress[0].id,
                    players: players,
                    locations: locations,
                    details_: null,
                  });
                } else {
                  navigation.navigate('CreateChampionship', {
                    players: players,
                    locations: locations,
                  });
                }
              }}>
              <View style={styles.championship}>
                <Text style={styles.text}>Campionato</Text>
                <Image
                  style={styles.championship_image}
                  source={require('./assets/championship.png')}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.bottom_cards}>
              <View style={styles.bottom_container_left}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Players', {
                      players: players,
                    })
                  }>
                  <View style={styles.players}>
                    <Text style={styles.text}>Giocatori</Text>
                    <Image
                      style={styles.players_image}
                      source={require('./assets/players.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.bottom_container_right}>
                <TouchableOpacity onPress={() => navigation.navigate('Chart')}>
                  <View style={styles.chart}>
                    <Text style={styles.text}>Classifica</Text>
                    <Image
                      style={styles.chart_image}
                      source={require('./assets/chart.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default function App() {
  const calcinoSlamTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };
  return (
    <NavigationContainer theme={calcinoSlamTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="Players"
          component={Players}
          options={{title: 'Giocatori'}}
        />
        <Stack.Screen
          name="CreateChampionship"
          component={CreateChampionship}
          options={{title: 'Crea un torneo'}}
        />
        <Stack.Screen
          name="Chart"
          component={Chart}
          options={{title: 'Classifica'}}
        />
        <Stack.Screen
          name="Teams"
          component={Teams}
          options={{title: 'Squadre', headerBackVisible: false}}
        />
        <Stack.Screen
          name="Noticeboard"
          component={Noticeboard}
          options={({navigation}) => ({
            title: 'Tabellone',
            headerLeft: () => (
              <Button
                title={'Go Home'}
                onPress={() => navigation.navigate('Home')}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    height: 200,
    width: 200,
    right: 30,
    top: 35,
    opacity: 0.1,
  },
  header: {
    fontWeight: '800',
    fontSize: 60,
    flex: 0.3,
    left: '5%',
  },
  container: {
    flex: 0.5,
    width: '90%',
    left: '5%',
  },
  championship: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: 200,
    marginBottom: '5%',
    position: 'relative',
    backgroundColor: '#9cffb1', //'#baffc9', //'#ffccb5',
    borderRadius: 20,
  },
  championship_image: {
    width: 150,
    height: 150,
    position: 'absolute',
    right: '5%',
    bottom: '10%',
  },
  bottom_cards: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
  },
  players: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#c7e7ff', //'#bae1ff', //'#d4d7ff',
    borderRadius: 20,
  },
  players_image: {
    width: 80,
    height: 80,
    position: 'absolute',
    right: '10%',
    bottom: '10%',
  },
  chart: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#ffc7cc', //'#ffeed6',
    borderRadius: 20,
  },
  bottom_container_left: {
    width: '48%',
    marginBottom: '4%',
    marginRight: '4%',
    position: 'relative',
  },
  bottom_container_right: {
    width: '48%',
    marginBottom: '4%',
    position: 'relative',
  },
  chart_image: {
    width: 80,
    height: 80,
    position: 'absolute',
    right: '10%',
    bottom: '10%',
  },
  image: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: '15%',
    left: '25%',
  },
  text: {
    color: '#513e76',
    fontWeight: '600',
    fontSize: 26,
    paddingLeft: 20,
    paddingTop: 15,
  },
});
