import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, FlatList} from 'react-native';
import ChampionshipItem from './ChampionshipItem';
import Noticeboard from './Noticeboard';

export default function Championship({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [existingChampionship, setExistingChampionship] = useState(false);
  const [data, setData] = useState([]);

  const getChart = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championships_in_progress?id_player=1',
      );
      console.log(response);
      const json = await response.json();
      console.log(json);
      setData(json);
      if (json.length !== 0) {
        setExistingChampionship(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChart();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : existingChampionship ? (
        <Noticeboard data={data[0].id_championship} />
      ) : (
        <>
          <View style={{}}>
            <FlatList
              data={data}
              renderItem={({item}) => <ChampionshipItem item={item} />}
              pagingEnabled
              //bounces={false}
              keyExtractor={item => item.id}
            />
          </View>
        </>
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
