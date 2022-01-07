import React, {useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Animated} from 'react-native';
import PlayersItem from './PlayersItem';
import Paginator from './Paginator';

export default function Onboarding({route, navigation}) {
  const {players} = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.container}>
      <View style={{}}>
        <FlatList
          data={players}
          renderItem={({item}) => <PlayersItem item={item} />}
          horizontal
          pagingEnabled
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
      <Paginator data={players} scrollX={scrollX} />
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
