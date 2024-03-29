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
import getPlayerImages from '../playerImages';
import config from '../config';

function getMatchTitle(type, num_teams, id_noticeboard) {
  if (type == 'GIRONE') {
    return 'Round girone';
  } else if (type == 'ELIMINAZIONE') {
    if (num_teams == 4) {
      switch (id_noticeboard) {
        case 0:
          return 'Primo round';
        case 1:
          return 'Primo round';
        case 2:
          return 'Finale';
        case 3:
          return 'Spareggio';
        default:
          return id_noticeboard;
      }
    } else if (num_teams == 5) {
      switch (id_noticeboard) {
        case 0:
          return 'Primo round';
        case 1:
          return 'Primo round';
        case 2:
          return 'Semifinale';
        case 3:
          return 'Finale';
        case 4:
          return 'Spareggio';
        default:
          return id_noticeboard;
      }
    } else if (num_teams == 6) {
      switch (id_noticeboard) {
        case 0:
          return 'Primo round';
        case 1:
          return 'Primo round';
        case 2:
          return 'Primo round';
        case 3:
          return 'Semifinale';
        case 4:
          return 'Finale';
        case 5:
          return 'Spareggio';
        default:
          return id_noticeboard;
      }
    } else if (num_teams == 7) {
      switch (id_noticeboard) {
        case 0:
          return 'Primo round';
        case 1:
          return 'Primo round';
        case 2:
          return 'Primo round';
        case 3:
          return 'Semifinale';
        case 4:
          return 'Semifinale';
        case 5:
          return 'Finale';
        case 6:
          return 'Spareggio';
        default:
          return id_noticeboard;
      }
    } else if (num_teams == 8) {
      switch (id_noticeboard) {
        case 0:
          return 'Primo round';
        case 1:
          return 'Primo round';
        case 2:
          return 'Primo round';
        case 3:
          return 'Primo round';
        case 4:
          return 'Semifinale';
        case 5:
          return 'Semifinale';
        case 6:
          return 'Finale';
        case 7:
          return 'Spareggio';
        default:
          return id_noticeboard;
      }
    }
  }
}

export default function MatchCard({
  item,
  players,
  details,
  getNewMatches,
  openChampionshipChart,
}) {
  const [editableText, setEditableText] = useState(true);
  const [scoreLeft, setScoreLeft] = useState(
    item.score.team1 == null ? '-' : item.score.team1.toString(),
  );
  const [scoreRight, setScoreRight] = useState(
    item.score.team2 == null ? '-' : item.score.team2.toString(),
  );
  const t1p1 = players.find(o => o.id == details.teams[item.team1][0]);
  const t1p2 = players.find(o => o.id == details.teams[item.team1][1]);
  const t2p1 = players.find(o => o.id == details.teams[item.team2][0]);
  const t2p2 = players.find(o => o.id == details.teams[item.team2][1]);
  let pattern = /^([0-9]|10)$/;
  let color = '#ffc7cc';
  if (pattern.test(scoreLeft) && pattern.test(scoreRight)) {
    color = '#9cffb1';
    //setEditableText(false);
  }
  const [backColor, setBackColor] = useState(color);
  const clearWrongCharactersRight = () => {
    if (!pattern.test(scoreRight)) {
      setScoreRight('');
    }
  };
  const putEndCharacterRight = () => {
    if (!pattern.test(scoreRight)) {
      setScoreRight('-');
    }
  };
  const clearWrongCharactersLeft = () => {
    if (!pattern.test(scoreLeft)) {
      setScoreLeft('');
    }
  };
  const putEndCharacterLeft = () => {
    if (!pattern.test(scoreLeft)) {
      setScoreLeft('-');
    }
  };
  const updateChampionshipStatus = async () => {
    try {
      const res = await fetch(
        config.host +
          ':' +
          config.port +
          '/update_championship_status?id_match=' +
          item.id_match +
          '&id_championship=' +
          details.id +
          '&team1_score=' +
          scoreLeft +
          '&team2_score=' +
          scoreRight,
      );
      const json = await res.json();
      if (json.new_matches === true && json.championship_end === false) {
        getNewMatches({id_championship: details.id});
      } else if (json.new_matches === false && json.championship_end === true) {
        openChampionshipChart();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const checkAndSend = async () => {
    if (pattern.test(scoreLeft) && pattern.test(scoreRight)) {
      if (scoreLeft == scoreRight) {
        Alert.alert('Una delle due squadre deve vincere!');
      } else if (scoreLeft != '10' && scoreRight != '10') {
        Alert.alert('Si arriva a 10!');
      } else {
        setEditableText(false);
        await updateChampionshipStatus();
        setBackColor('#9cffb1');
      }
    } else {
      Alert.alert('Hai scritto male il punteggio!');
    }
  };

  return (
    <View>
      <View style={[styles.card, {backgroundColor: backColor}]}>
        <Text style={styles.noticeboard}>
          {getMatchTitle(details.type, details.num_teams, item.id_noticeboard)}
        </Text>
        <View style={styles.card_left}>
          <View style={styles.team_box_left}>
            <View style={styles.player_box_left}>
              <Image
                style={styles.player_image}
                source={getPlayerImages(t1p1.id)}
              />
              <Text style={styles.player_username}>{t1p1.username}</Text>
            </View>
          </View>
          <View style={styles.team_box_right}>
            <View style={styles.player_box_right}>
              <Image
                style={styles.player_image}
                source={getPlayerImages(t1p2.id)}
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
              onPressIn={() => clearWrongCharactersLeft()}
              onEndEditing={() => putEndCharacterLeft()}
            />
          </View>
        </View>
        <View style={styles.vs_image_box}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={press => checkAndSend()}>
            <Image
              style={styles.vs_image}
              source={require('../assets/battle.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.card_right}>
          <View style={styles.team_box_left}>
            <View style={styles.player_box_left}>
              <Image
                style={styles.player_image}
                source={getPlayerImages(t2p1.id)}
              />
              <Text style={styles.player_username}>{t2p1.username}</Text>
            </View>
          </View>
          <View style={styles.team_box_right}>
            <View style={styles.player_box_right}>
              <Image
                style={styles.player_image}
                source={getPlayerImages(t2p2.id)}
              />
              <Text style={styles.player_username}>{t2p2.username}</Text>
            </View>
          </View>
          <View style={styles.score_right}>
            <TextInput
              name={'score_right'}
              style={styles.score_text}
              keyboardType={'numeric'}
              onChangeText={text => setScoreRight(text)}
              onPressIn={() => clearWrongCharactersRight()}
              onEndEditing={() => putEndCharacterRight()}
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
    marginBottom: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingBottom: 135,
    position: 'relative',
  },
  card_left: {
    position: 'absolute',
    top: '80%',
    width: '30%',
    left: '17%',
  },
  card_right: {
    position: 'absolute',
    top: '80%',
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
    borderRadius: 35 / 2,
  },
  vs_image: {
    alignItems: 'center',
    top: '50%',
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
    right: '90%',
    top: '40%',
  },
  score_right: {
    position: 'absolute',
    left: '90%',
    top: '40%',
  },
  score_text: {
    fontSize: 40,
    fontWeight: '800',
  },
  noticeboard: {
    margin: 15,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
