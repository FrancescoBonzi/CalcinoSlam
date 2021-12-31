import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';

function NoticeboardView({details}) {
  const [location, setLocation] = useState({});
  const [players, setPlayers] = useState([]);
  const renderItem = ({item}) => {
    console.log(players);
    console.log(location);
    const t1p1 = players[item.team1[0].toString()].username;
    const t1p2 = players[item.team1[1].toString()].username;
    const t2p1 = players[item.team2[0].toString()].username;
    const t2p2 = players[item.team2[1].toString()].username;
    console.log(t1p1);
    return (
      <View>
        <Text>
          {t1p1} - {t1p2} VS {t2p1} - {t2p2}
        </Text>
      </View>
    );
  };
  const getLocation = async () => {
    try {
      const response = await fetch('http://localhost:3003/get_locations', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_locations: [details.location],
        }),
      });
      const json = await response.json();
      setLocation(json[0]);
    } catch (error) {
      console.error(error);
    }
  };
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
      setPlayers(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlayers();
    getLocation();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{details.name}</Text>
      <Text>{details.type}</Text>
      <Text>{location.name}</Text>
      <FlatList
        data={details.matches}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default function Noticeboard({id_championship}) {
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);

  const getDetails = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championship_details?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      json.matches.map((el, i) => {
        if (json.teams[el.team1] === undefined) {
          el.team1 = [1, 2];
          el.team2 = [2, 3];
        } else {
          el.team1 = json.teams[el.team1];
          el.team2 = json.teams[el.team2];
        }
      });
      console.log(json);
      setDetails(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <NoticeboardView details={details} />
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
