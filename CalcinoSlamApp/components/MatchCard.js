import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

export default function MatchCard({
  item,
  players,
  details,
  getNewMatches,
  getChampionshipChart,
}) {
  const [editableText, setEditableText] = useState(true);
  const [scoreLeft, setScoreLeft] = useState(
    item.score[0] == null ? '-' : item.score[0].toString(),
  );
  const [scoreRight, setScoreRight] = useState(
    item.score[1] == null ? '-' : item.score[1].toString(),
  );
  console.log(item);
  console.log(details.teams);
  console.log(details.teams[item.team1]);
  console.log(players.find(o => o.id == details.teams[item.team1][0]));
  const t1p1 = players.find(o => o.id == details.teams[item.team1][0]);
  const t1p2 = players.find(o => o.id == details.teams[item.team1][1]);
  const t2p1 = players.find(o => o.id == details.teams[item.team2][0]);
  const t2p2 = players.find(o => o.id == details.teams[item.team2][1]);
  let pattern = /^([0-9]|10)$/;
  let color = 'white';
  if (pattern.test(scoreLeft) && pattern.test(scoreRight)) {
    color = 'lightgreen';
    //setEditableText(false);
  }
  const [backColor, setBackColor] = useState(color);
  const updateChampionshipStatus = async () => {
    try {
      const res = await fetch(
        'http://localhost:3003/update_championship_status?id_match=' +
          item.id_match +
          '&id_championship=' +
          details.id +
          '&team1_score=' +
          scoreLeft +
          '&team2_score=' +
          scoreRight,
      );
      const json = await res.json();
      console.log('yeppa ' + json.new_matches, json.championship_end);
      if (json.new_matches === true && json.championship_end === false) {
        getNewMatches();
      } else if (json.new_matches === false && json.championship_end === true) {
        getChampionshipChart();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const checkAndSend = async () => {
    if (pattern.test(scoreLeft) && pattern.test(scoreRight)) {
      setEditableText(false);
      await updateChampionshipStatus();
      setBackColor('lightgreen');
    } else {
      Alert.alert('Hai scritto male il punteggio!\n*Versi calabresi*');
    }
  };

  return (
    <View>
      <View style={[styles.card, {backgroundColor: backColor}]}>
        <View style={styles.card_left}>
          <View style={styles.team_box_left}>
            <View style={styles.player_box_left}>
              <Image
                style={styles.player_image}
                source={{
                  uri: t1p1.image,
                }}
              />
              <Text style={styles.player_username}>{t1p1.username}</Text>
            </View>
          </View>
          <View style={styles.team_box_right}>
            <View style={styles.player_box_right}>
              <Image
                style={styles.player_image}
                source={{
                  uri: t1p2.image,
                }}
              />
              <Text style={styles.player_username}>{t1p2.username}</Text>
            </View>
          </View>
          <View style={styles.score_left}>
            <TextInput
              style={styles.score_text}
              keyboardType={'numeric'}
              onChangeText={text => setScoreLeft(text)}
              defaultValue={scoreLeft}
              editable={editableText}
            />
          </View>
        </View>
        <View style={styles.vs_image_box}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={press => checkAndSend()}>
            <Image
              style={styles.vs_image}
              source={{
                uri: 'http://localhost:3003/battle.png',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.card_right}>
          <View style={styles.team_box_left}>
            <View style={styles.player_box_left}>
              <Image
                style={styles.player_image}
                source={{
                  uri: t2p1.image,
                }}
              />
              <Text style={styles.player_username}>{t2p1.username}</Text>
            </View>
          </View>
          <View style={styles.team_box_right}>
            <View style={styles.player_box_right}>
              <Image
                style={styles.player_image}
                source={{
                  uri: t2p2.image,
                }}
              />
              <Text style={styles.player_username}>{t2p2.username}</Text>
            </View>
          </View>
          <View style={styles.score_right}>
            <TextInput
              style={styles.score_text}
              keyboardType={'numeric'}
              onChangeText={text => setScoreRight(text)}
              defaultValue={scoreRight}
              editable={editableText}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f76c6c',
    marginHorizontal: 4,
    borderRadius: 5,
    paddingBottom: 150,
    position: 'relative',
  },
  card_left: {
    position: 'absolute',
    width: '30%',
    left: '17%',
  },
  card_right: {
    position: 'absolute',
    width: '30%',
    right: '17%',
  },
  player_box_left: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  player_box_right: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  player_image: {
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  vs_image: {
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  vs_image_box: {
    position: 'absolute',
    top: 35,
    alignItems: 'center',
  },
  score_left: {
    position: 'absolute',
    right: '100%',
    top: '40%',
  },
  score_right: {
    position: 'absolute',
    left: '100%',
    top: '40%',
  },
  score_text: {
    fontSize: 40,
    fontWeight: '800',
  },
});
