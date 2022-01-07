import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function ChampionshipTypeItem({index, type, setType}) {
  const type_name = index == 0 ? 'GIRONE' : 'ELIMINAZIONE';
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setType(index)}>
        <View
          style={[
            styles.card,
            {backgroundColor: type == index ? '#9cffb1' : '#c7e7ff'},
          ]}>
          <Text style={styles.name}>{type_name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: '2%',
    marginRight: '2%',
  },
  card: {
    width: '100%',
    backgroundColor: '#a8d0e6',
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
  },
  name: {
    alignContent: 'center',
    paddingTop: 13,
    fontWeight: '600',
    fontSize: 18,
    color: '#24305e',
  },
});
