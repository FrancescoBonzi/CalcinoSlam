var sqlite3 = require('sqlite3').verbose();
let db_file = "data.db"
let current_season = 0

function get_key_by_value(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function get_current_timestamp() {
    var d = new Date();
    d = new Date(d.getTime() - 3000000);
    var date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
    //console.log(date_format_str);
    return date_format_str
}

async function db_all(query) {
    return new Promise(function (resolve, reject) {
        let db = new sqlite3.Database(db_file)
        db.all(query, function (err, rows) {
            if (err) { return reject(err) }
            resolve(rows)
        })
        db.close()
    });
}

async function db_run(query, params) {
    return new Promise(function (resolve, reject) {
        let db = new sqlite3.Database(db_file)
        db.run(query, params, function (err) {
            if (err) { return reject(err) }
            //console.log(this.lastID, this.changes)
            resolve([this.lastID, this.changes])
        })
        db.close()
    });
}

function create_teams(id_player) {
    let teams = []
    if (id_player.length % 2 == 0) {
        id_player = id_player.sort((a, b) => 0.5 - Math.random());
        for (let i = 0; i < id_player.length; i = i + 2) {
            teams.push([id_player[i], id_player[i + 1]])
        }
    } else {
        throw "Number of players must be even"
    }
    return teams
}

async function create_championship(location, type, id_player, organizer, name, comment) {
    //create teams
    let teams = create_teams(id_player)

    //create matches to play right now
    let matches = []
    if (type == "GIRONE") {
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                matches.push([i, j])
            }
        }
    } else if (type == "ELIMINAZIONE") {
        throw "Not supported yet"
    } else {
        throw "Championship type not supported"
    }

    //championship
    let insert_championship_query = "INSERT INTO championships (id, type, date, organizer, name, location, image, in_progress, season, comment) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
    var [id_championship, _] = await db_run(insert_championship_query, [null, type, get_current_timestamp(), organizer, name, location, 'images/championships/default.png', 1, 1, comment])
    let update_championship_query = "UPDATE championships SET image = 'images/championships/" + id_championship + ".png' WHERE id==" + id_championship
    await db_run(update_championship_query, [])

    //matches
    let insert_matches_query = "INSERT INTO matches (id, datetime, team1_player1, team1_player2, team2_player1, team2_player2, to_be_played, team1_score, team2_score) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    let id_matches = []
    for (let i = 0; i < matches.length; i++) {
        var team1_player1 = teams[matches[i][0]][0]
        var team1_player2 = teams[matches[i][0]][1]
        var team2_player1 = teams[matches[i][1]][0]
        var team2_player2 = teams[matches[i][1]][1]
        var [id_match, _] = await db_run(insert_matches_query, [null, null, team1_player1, team1_player2, team2_player1, team2_player2, 1, null, null])
        id_matches += [id_match]
    }

    //championships_matches
    let insert_championships_matches_query = "INSERT INTO championships_matches (id_championship, id_match, to_be_played, team1_points, team2_points, parent_match1, parent_match2) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?);"
    for (let i = 0; i < matches.length; i++) {
        await db_run(insert_championships_matches_query, [id_championship, id_matches[i], 1, null, null, null, null])
    }

    //championships_players
    let insert_championships_players_query = "INSERT INTO championships_players (id_championship, id_player, place, score) " +
        "VALUES (?, ?, ?, ?);"
    for (let i = 0; i < id_player.length; i++) {
        await db_run(insert_championships_players_query, [id_championship, id_player[i]])
    }

    return {
        "ok": true
    }
}

async function get_championship_info(id_championship) {
    let query = "SELECT * FROM championships WHERE id==" + id_championship
    let championship_info = await db_all(query)
    return championship_info[0]
}

async function get_championship_matches(id_championship) {
    let query = "SELECT id_match, team1_player1, team1_player2, team2_player1, team2_player2, matches.to_be_played, team1_score, team2_score, parent_match1, parent_match2 FROM championships_matches INNER JOIN matches ON championships_matches.id_match=matches.id WHERE id_championship==" + id_championship
    let championship_matches = await db_all(query)
    let teams = new Set()
    for (let i = 0; i < championship_matches.length; i++) {
        teams.add([championship_matches[i]["team1_player1"], championship_matches[i]["team1_player2"]])
        teams.add([championship_matches[i]["team2_player1"], championship_matches[i]["team2_player2"]])
    }
    teams = Array.from(teams)
    var dict_teams_tostring = {}
    teams.forEach((el, index) => dict_teams_tostring[index] = el.toString());
    var dict_teams = {}
    teams.forEach((el, index) => dict_teams[index] = el);
    let matches = []
    for (let i = 0; i < championship_matches.length; i++) {
        var team1 = get_key_by_value(dict_teams_tostring, [championship_matches[i]["team1_player1"], championship_matches[i]["team1_player2"]].toString())
        var team2 = get_key_by_value(dict_teams_tostring, [championship_matches[i]["team2_player1"], championship_matches[i]["team2_player2"]].toString())
        matches.push({
            "id_match": championship_matches[i]["id_match"],
            "team1": team1,
            "team2": team2,
            "score": [championship_matches[i]["team1_score"], championship_matches[i]["team2_score"]],
            "parent_matches": [championship_matches[i]["parent_match1"], championship_matches[i]["parent_match2"]]
        })
    }
    return {
        "num_teams": teams.length,
        "teams": dict_teams,
        "matches": matches
    }
}

async function get_championship_details(id_championship) {
    let championship_info = await get_championship_info(id_championship)
    let championship_matches = await get_championship_matches(id_championship)
    return Object.assign(championship_info, championship_matches)
}

async function get_players(id_players) {
    let query = "SELECT * FROM players "
    if (id_players.length != 0) {
        query += "WHERE "
        for (let i = 0; i < id_players.length - 1; i++) {
            query += "id==" + id_players[i] + " or "
        }
        query += "id==" + id_players[id_players.length - 1]
    }
    let players = await db_all(query)
    return players
}

async function get_locations(id_locations) {
    let query = "SELECT * FROM locations "
    if (id_locations.length != 0) {
        query += "WHERE "
        for (let i = 0; i < id_locations.length - 1; i++) {
            query += "id==" + id_locations[i] + " or "
        }
        query += "id==" + id_locations[id_locations.length - 1]
    }
    let locations = await db_all(query)
    return locations
}

async function get_championships_in_progress(id_player) {
    let query = "SELECT * FROM championships WHERE in_progress==1"
    if(id_player != undefined) {
        query = "SELECT championships.* FROM championships INNER JOIN championships_players ON id = id_championship WHERE in_progress==1 AND id_player==" + id_player
    }
    let championships = await db_all(query)
    return championships
}

async function get_charts(id_players) {
    let query = "SELECT id_player, username, image, AVG(score) AS score FROM championships_players INNER JOIN players ON id_player = id"
    if(id_players.length != 0) {
        query += " WHERE "
        for(let i=0;i<id_players.length-1;i++) {
            query += "id_player==" + id_players[i] + " or "
        }
        query += "id_player==" + id_players[id_players.length - 1]
    }
    query += " GROUP BY id_player ORDER BY AVG(score) DESC;"
    let charts = await db_all(query)
    return charts
}

async function update_match_result(id_match, team1_score, team2_score) {
    let update_match_query = "UPDATE matches SET datetime = datetime('now'), to_be_played = 0, team1_score = " + team1_score + ", team2_score = " + team2_score + " WHERE id==" + id_match + ";"
    await db_run(update_match_query, [])
    let team1_points = team1_score > team2_score ? 1 : 0
    let update_championship_match = "UPDATE championships_matches SET to_be_played = 0, team1_points = " + team1_points + ", team2_points = " + (1-team1_points) + " WHERE id_match==" + id_match + ";"
    var [_, change] = await db_run(update_championship_match, [])
    return change
}

async function login(id_player, password) {
    let query = "SELECT * FROM players WHERE id==" + id_player + ";"
    let player = await db_all(query)
    if(player.length != 0) {
        player = player[0]
        if(player["password"] == password) {
            player["ok"] = true
        } else {
            player = {
                "ok": false
            }
        }
    } else {
        player = {
            "ok": false
        }
    }
    return player
}

module.exports.get_players = get_players;
module.exports.get_locations = get_locations;
module.exports.get_championships_in_progress = get_championships_in_progress;
module.exports.get_charts = get_charts;
module.exports.create_championship = create_championship;
module.exports.get_championship_info = get_championship_info;
module.exports.get_championship_matches = get_championship_matches;
module.exports.get_championship_details = get_championship_details;
module.exports.update_match_result = update_match_result;
module.exports.login = login;