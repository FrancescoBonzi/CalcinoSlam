import React, {useState, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import ChartItem from './ChartItem';

export default function Onboarding({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getChart = async () => {
    try {
      const response = await fetch('http://localhost:3003/get_chart', {
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
      json.map((_, i) => {
        json[i].score = json[i].score.toFixed(1);
      });
      setData(json);
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
      ) : (
        <>
          <View style={{}}>
            <FlatList
              data={data}
              renderItem={({item}) => <ChartItem item={item} />}
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
