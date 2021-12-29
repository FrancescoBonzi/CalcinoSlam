import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Onboarding from './components/Onboarding';

export default App = () => {
    return (
        <View style={styles.container}>
          <Onboarding />
          <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});