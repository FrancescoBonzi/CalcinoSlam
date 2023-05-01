import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import PlayersItem from './PlayersItem';
import Paginator from './Paginator';

export default function Players({route, navigation}) {
  const {players, initialIndex} = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollX = useRef(new Animated.Value(initialIndex)).current;
  const {width} = useWindowDimensions();
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
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
          keyExtractor={item => item.id}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={currentIndex}
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
  logo: {
    position: 'absolute',
    height: 300,
    width: 300,
    opacity: 0.05,
    left: '50%',
    bottom: '5%',
  },
});
