import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import MatchCard from './MatchCard';
import config from '../config';

export default function Noticeboard({route, navigation}) {
  const {id_championship, players, locations, initialDetails} = route.params;
  const [details, setDetails] = useState(initialDetails);
  const deleteChampionship = async () => {
    try {
      const response = await fetch(
        config.host +
          ':' +
          config.port +
          '/delete_championship?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      if (json.championship_deleted) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Non è stato possibile cancellare il campionato...');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const alertDeleteChampionship = () => {
    Alert.alert('Stai cancellando il campionato', 'Sei sicuro?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Si', onPress: () => deleteChampionship()},
    ]);
  };
  const getDetails = async () => {
    try {
      const response = await fetch(
        config.host +
          ':' +
          config.port +
          '/get_championship_details?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      setDetails(json);
      if (json.in_progress == 0) {
        await openChampionshipChart();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const openChampionshipChart = async () => {
    navigation.navigate('ChampionshipChart', {
      id_championship: id_championship,
      players: players,
      locations: locations,
      details: details,
    });
  };

  useEffect(() => {
    if (initialDetails == null) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  let spinValue = new Animated.Value(0);

  // First set up animation
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear, // Easing is an additional import from react-native
    useNativeDriver: true, // To make use of native driver for performance
  }).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {details == null ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.info}>
              <Text style={styles.name}>{details.name}</Text>
              <Text style={styles.type}>{details.type}</Text>
              <Text style={styles.location}>
                {locations.find(o => o.id === details.location).name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bin_image_container}
              onPress={() => alertDeleteChampionship()}>
              <Image
                style={styles.bin_image}
                source={require('../assets/bin.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.refresh_image_container}
              onPress={() => getDetails()}>
              <Animated.View style={{transform: [{rotate: spin}]}}>
                <Image
                  style={styles.bin_image}
                  source={require('../assets/refresh.png')}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <ScrollView>
              {details.matches.map((item, index) => (
                <MatchCard
                  item={item}
                  players={players}
                  details={details}
                  getNewMatches={getDetails}
                  openChampionshipChart={openChampionshipChart}
                  key={item.id_match}
                />
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  info: {
    width: '100%',
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#4f3c75',
  },
  type: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    //color: '#4f3c75',
  },
  location: {
    fontSize: 16,
    fontWeight: '700',
    //textTransform: 'uppercase',
    color: '#4f3c75',
  },
  btnContainer: {
    backgroundColor: '#f2f0f1',
    marginTop: '5%',
    width: '90%',
    alignSelf: 'center',
    marginHorizontal: 4,
    borderRadius: 5,
    borderWidth: 0,
    marginBottom: 100,
  },
  bin_image: {
    height: 25,
    width: 25,
  },
  bin_image_container: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  refresh_image_container: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
