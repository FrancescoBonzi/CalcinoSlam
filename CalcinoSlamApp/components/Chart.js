import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import ChartItem from './ChartItem';
import config from '../config';

export default function Chart({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getChart = async () => {
    try {
      const response = await fetch(config.host + '/get_chart', {
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
      json.sort((a, b) => {
        return a.score < b.score;
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
    <View style={{width: '100%', height: '100%', backgroundColor: '#ffc7cc'}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                style={styles.image}
                source={require('../assets/winner.png')}
              />
              {data.map((item, index) => (
                <ChartItem key={index} item={item} index={index} />
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  container: {
    width: '90%',
    left: '5%',
    paddingBottom: '10%',
  },
});
