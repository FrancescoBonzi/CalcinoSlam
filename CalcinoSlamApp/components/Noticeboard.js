import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MatchCard from './MatchCard';
import ChampionshipChartItem from './ChampionshipChartItem';
import config from '../config';

export default function Noticeboard({route, navigation}) {
  const {id_championship, players, locations, details_} = route.params;
  const [details, setDetails] = useState(details_);
  const [chart, setChart] = useState(null);
  const [finished, setFinished] = useState(false);
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
      console.log(json);
      setDetails(json);
    } catch (error) {
      console.error(error);
    }
  };
  const getChampionshipChart = async () => {
    try {
      const response = await fetch(
        config.host +
          ':' +
          config.port +
          '/get_championship_chart?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      console.log(json);
      setChart(json);
    } catch (error) {
      console.error(error);
    } finally {
      setFinished(true);
    }
  };

  useEffect(() => {
    if (details_ == null) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

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
          </View>
          <View>
            <ScrollView>
              {!finished ? (
                <View style={styles.matches}>
                  {details.matches.map((item, index) => (
                    <MatchCard
                      item={item}
                      players={players}
                      details={details}
                      getNewMatches={getDetails}
                      getChampionshipChart={getChampionshipChart}
                    />
                  ))}
                </View>
              ) : (
                <>
                  <View>
                    {chart.map((item, index) => (
                      <ChampionshipChartItem item={item} players={players} />
                    ))}
                  </View>
                  <View style={styles.btnContainer}>
                    <Button
                      title="Torna alla home"
                      onPress={() => navigation.navigate('Home')}
                    />
                  </View>
                </>
              )}
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
});
