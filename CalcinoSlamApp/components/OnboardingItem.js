import React from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';

export default function OnboardingItem({item}) {
  const {width} = useWindowDimensions();
  console.log(item);
  return (
    <View style={[styles.container, {width}]}>
      <Image
        style={styles.image}
        source={{
          uri: item.image,
        }}
      />
      <View style={{}}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.biography}>{item.biography}</Text>
      </View>
      <Button
        style={styles.button}
        title="Vedi i Premi"
        backgroundColor="#f194ff"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  username: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: '#493d8a',
    textAlign: 'center',
  },
  biography: {
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
  button: {
    marginTop: 100,
  },
});
