import React, {useState, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import OnboardingItem from './PlayersItem';
import Paginator from './Paginator';

export default function Onboarding({navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getPlayers = async () => {
    try {
      const response = await fetch('http://localhost:3003/get_players', {
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
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlayers();
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
              renderItem={({item}) => <OnboardingItem item={item} />}
              horizontal
              pagingEnabled
              //bounces={false}
              keyExtractor={item => item.id}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {
                  useNativeDriver: false,
                },
              )}
              scrollEventThrottle={32}
              onViewableItemsChanged={viewableItemsChanged}
              ref={slidesRef}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <Paginator data={data} scrollX={scrollX} />
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
