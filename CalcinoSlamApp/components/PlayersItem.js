import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import getPlayerImages from '../playerImages';
import config from '../config';

export default function PlayersItem({item}) {
  const {width} = useWindowDimensions();
  const [numChamp, setNumChamp] = useState('');
  const [prizes, setPrizes] = useState([]);
  const getPrizes = async () => {
    try {
      const response = await fetch(
        config.host + ':' + config.port + '/get_prizes?id_player=' + item.id,
      );
      const json = await response.json();
      setNumChamp(json.length);
      json.map(a => (a.date = a.date.substring(0, 11)));
      setPrizes(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPrizes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={[styles.container, {width}]}>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <View style={styles.header}>
        <Image style={styles.image} source={getPlayerImages(item.id)} />
        <View style={styles.right_header}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.championship_played}>
            {numChamp} campionati giocati
          </Text>
        </View>
      </View>
      <View style={{height: 200, flex: 1}}>
        <ScrollView style={{flex: 1, height: '100%'}}>
          <View style={styles.biography_section}>
            <Text style={styles.biography_header}>Biografia</Text>
            <Text style={styles.biography}>{item.biography}</Text>
          </View>
          <View style={styles.prizes_section}>
            <Text style={styles.biography_header}>Premi</Text>
            <View style={styles.prizes}>
              {prizes.map((item, index) => (
                <View style={styles.card}>
                  <Image
                    style={styles.prize_image}
                    source={require('../assets/laurel.png')}
                  />
                  <Text style={styles.place}>{item.place + 1}</Text>
                  <View style={styles.box_info_prize}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Text style={styles.type}>{item.type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: 'absolute',
    height: 300,
    width: 300,
    right: '70%',
    top: '50%',
    opacity: 0.05,
  },
  container: {
    marginTop: '20%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    marginTop: '5%',
  },
  right_header: {
    marginLeft: '20%',
    alignSelf: 'center',
  },
  username: {
    fontWeight: '700',
    fontSize: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  header: {
    marginHorizontal: '15%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: '10%',
  },
  championship_played: {
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  biography_section: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '15%',
    backgroundColor: '#c7e7ff',
    borderRadius: 25,
  },
  biography_header: {
    fontWeight: '500',
    fontSize: 26,
    marginBottom: '5%',
  },
  biography: {
    width: '100%',
    fontWeight: '400',
    color: '#62656b',
    textAlign: 'justify',
  },
  btnContainer: {
    backgroundColor: '#f2f0f1',
    marginTop: '5%',
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 4,
    borderRadius: 5,
  },
  prizes_section: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '15%',
    backgroundColor: '#9cffb1',
    borderRadius: 25,
    marginTop: '5%',
  },
  prizes: {
    width: '100%',
    position: 'relative',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '27%',
    height: 100,
    margin: '3%',
    position: 'relative',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  prize_image: {
    height: '60%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  box_info_prize: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  place: {
    fontWeight: '900',
    fontSize: 40,
    position: 'absolute',
    top: '-20%',
    left: '60%',
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  type: {
    fontWeight: '500',
    fontSize: 10,
  },
  date: {
    fontWeight: '500',
    fontSize: 10,
  },
});
