import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Players from './components/Players';
import Chart from './components/Chart';
import Championship from './components/Championship';

const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontWeight: '800', fontSize: 48, flex: 0.5}}>
        Calcino Slam
      </Text>
      <Button
        title="Vedi i Giocatori"
        onPress={() => navigation.navigate('Players')}
      />
      <Button
        title="Gioca un Campionato"
        onPress={() => navigation.navigate('Championship')}
      />
      <Button
        title="Vedi la Classifica"
        onPress={() => navigation.navigate('Chart')}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="Players"
          component={Players}
          options={{title: 'Giocatori'}}
        />
        <Stack.Screen
          name="Championship"
          component={Championship}
          options={{title: 'Torneo'}}
        />
        <Stack.Screen
          name="Chart"
          component={Chart}
          options={{title: 'Classifica'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
