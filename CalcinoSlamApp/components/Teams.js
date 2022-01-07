import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Button,
  Image,
  Text,
} from 'react-native';

export default function Teams({route, navigation}) {
  const {id_championship, players, locations} = route.params;
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [teams, setTeams] = useState(null);

  const getDetails = async () => {
    try {
      const response = await fetch(
        'http://localhost:3003/get_championship_details?id_championship=' +
          id_championship,
      );
      const json = await response.json();
      setDetails(json);
      let ts = [];
      for (let i = 0; i < json.num_teams; i++) {
        var pt = json.teams[i];
        ts.push([
          players.find(o => o.id == pt[0]),
          players.find(o => o.id == pt[1]),
        ]);
      }
      setTeams(ts);
      console.log(ts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{}}>
            <View style={styles.info}>
              <Image style={styles.championship_image} source={details.image} />
              <Text>{details.name}</Text>
              <Text style={styles.location}>
                {locations.find(o => o.id == details.location).name}
              </Text>
            </View>
            <View style={styles.teams}>
              {teams.map((item, index) => (
                <>
                  <View style={styles.team}>
                    <View style={styles.team_box_left}>
                      <View style={styles.player_box_left}>
                        <Image
                          style={styles.player_image}
                          source={{
                            uri: item[0].image,
                          }}
                        />
                        <Text style={styles.player_username}>
                          {item[0].username}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.team_box_right}>
                      <View style={styles.player_box_right}>
                        <Image
                          style={styles.player_image}
                          source={{
                            uri: item[1].image,
                          }}
                        />
                        <Text style={styles.player_username}>
                          {item[1].username}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ))}
            </View>
          </View>

          <View style={styles.btnContainer}>
            <Button
              title="Gioca"
              onPress={() =>
                navigation.navigate('Noticeboard', {
                  id_championship: id_championship,
                  players: players,
                  locations: locations,
                  details_: details,
                })
              }
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  location: {
    fontWeight: '600',
    fontSize: 20,
    margin: '7%',
  },
  team: {
    marginBottom: '2%',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingBottom: 70,
    position: 'relative',
    backgroundColor: '#c7e7ff',
  },
  team_box_left: {
    position: 'absolute',
    width: '30%',
    left: '17%',
  },
  team_box_right: {
    position: 'absolute',
    width: '30%',
    right: '17%',
  },
  player_box_left: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  player_box_right: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  player_image: {
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  player_username: {
    fontWeight: '600',
    fontSize: 18,
    //color: '#24305e',
    paddingHorizontal: '10%',
  },
  btnContainer: {
    backgroundColor: '#f2f0f1',
    marginTop: '5%',
    width: '90%',
    alignSelf: 'center',
    marginHorizontal: 4,
    borderRadius: 5,
    borderWidth: 0,
  },
});
