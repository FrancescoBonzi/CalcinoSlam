import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import MatchCard from './MatchCard';
import ChampionshipChartItem from './ChampionshipChartItem';

export default function Noticeboard({id_championship, locations, players}) {
  const [details, setDetails] = useState(null);
  const [chart, setChart] = useState(null);
  const [finished, setFinished] = useState(false);
  const getDetails = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championship_details?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      setDetails(json);
    } catch (error) {
      console.error(error);
    }
  };
  const getChampionshipChart = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championship_chart?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      setChart(json);
    } catch (error) {
      console.error(error);
    } finally {
      setFinished(true);
    }
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {details == null ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.info}>
            <Text>{details.name}</Text>
            <Text>{details.type}</Text>
            <Text>{locations.find(o => o.id === details.location).name}</Text>
          </View>
          {!finished ? (
            <View style={styles.matches}>
              <FlatList
                data={details.matches}
                renderItem={({item}) => (
                  <MatchCard
                    item={item}
                    players={players}
                    details={details}
                    getNewMatches={getDetails}
                    getChampionshipChart={getChampionshipChart}
                  />
                )}
                pagingEnabled
              />
            </View>
          ) : (
            <FlatList
              data={chart}
              renderItem={({item}) => (
                <ChampionshipChartItem item={item} players={players} />
              )}
              pagingEnabled
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  info: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  matches: {
    flex: 3,
    marginBottom: 50,
  },
});
