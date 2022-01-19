import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
} from 'react-native';
import ChampionshipChartItem from './ChampionshipChartItem';
import config from '../config';

export default function Noticeboard({route, navigation}) {
  const {id_championship, players, locations, details} = route.params;
  const [chart, setChart] = useState(null);
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
    }
  };

  useEffect(() => {
    getChampionshipChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <View style={styles.container}>
      {chart == null ? (
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
          </View>
          <View style={{flex: 1}}>
            <ScrollView>
              {chart.map((item, _index) => (
                <ChampionshipChartItem
                  item={item}
                  players={players}
                  key={item.id_player}
                />
              ))}
              <View style={styles.btnContainer}>
                <Button
                  title="Torna alla home"
                  onPress={() => navigation.navigate('Home')}
                />
              </View>
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
});
