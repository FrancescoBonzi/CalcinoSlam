const utils = require('./utils.js')
let current_season = 0

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

    let result

    //check parameters
    if ((type != "GIRONE" && type != "ELIMINAZIONE") ||
        (id_player.length % 2 == 1)) {
        result = {
            "championship_approved": false,
            "error": "type"
        }
    } else if ((type == 'GIRONE' && id_player.length >= 6 && id_player.length <= 12) ||
        (type == 'ELIMINAZIONE' && id_player.length >= 8 && id_player.length <= 16)) {

        //championship
        let insert_championship_query = "INSERT INTO championships (id, type, date, organizer, name, location, image, in_progress, season, comment) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
        var [id_championship, _] = await utils.db_run(insert_championship_query, [null, type, utils.get_current_timestamp(), organizer, name, location, '', 1, 1, comment])
        let update_championship_query = "UPDATE championships SET image = 'https://calcinoslam.duckdns.org/championships/" + id_championship + ".png' WHERE id==" + id_championship
        await utils.db_run(update_championship_query, [])

        //championships_players
        let insert_championships_players_query = "INSERT INTO championships_players (id_championship, id_player, place, score) " +
            "VALUES (?, ?, ?, ?);"
        for (let i = 0; i < id_player.length; i++) {
            await utils.db_run(insert_championships_players_query, [id_championship, id_player[i]])
        }

        //championships_teams
        let teams = create_teams(id_player)
        let insert_championships_teams_query = "INSERT INTO championships_teams (id_championship, num_team, player1, player2) " +
            "VALUES (?, ?, ?, ?);"
        for (let i = 0; i < teams.length; i++) {
            await utils.db_run(insert_championships_teams_query, [id_championship, i, teams[i][0], teams[i][1]])
        }

        result = await utils.championship_manager(id_championship)
        result.id_championship = id_championship
    } else {
        result = {
            "championship_approved": false,
            "error": "players_number"
        }
    }

    return result
}

async function get_championship_info(id_championship) {
    let query = "SELECT * FROM championships WHERE id==" + id_championship
    let championship_info = await utils.db_all(query)
    return championship_info[0]
}

async function get_championship_matches(id_championship) {
    // load matches from DB for a specific championship
    let query_matches = "SELECT id_match, team1, team2, matches.to_be_played, team1_score, team2_score, id_noticeboard FROM championships_matches INNER JOIN matches ON championships_matches.id_match=matches.id WHERE id_championship==" + id_championship
    let championship_matches = await utils.db_all(query_matches)

    let matches = []
    for (let i = 0; i < championship_matches.length; i++) {
        matches.push({
            "id_match": championship_matches[i]["id_match"],
            "team1": championship_matches[i]["team1"],
            "team2": championship_matches[i]["team2"],
            "score": [championship_matches[i]["team1_score"], championship_matches[i]["team2_score"]],
            "id_noticeboard": championship_matches[i]["id_noticeboard"]
        })
    }

    // load teams from DB for a specific championship
    let query_teams = "SELECT num_team, player1, player2 FROM championships_teams WHERE id_championship==" + id_championship
    let championship_teams_DB = await utils.db_all(query_teams)
    let championship_teams = {}
    let num_teams = championship_teams_DB.length

    for (let i = 0; i < num_teams; i++) {
        championship_teams[i.toString()] = [championship_teams_DB[i].player1, championship_teams_DB[i].player2]
    }

    return {
        "num_teams": num_teams,
        "teams": championship_teams,
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
    let players = await utils.db_all(query)
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
    let locations = await utils.db_all(query)
    return locations
}

async function get_championships_in_progress(id_player) {
    let query = "SELECT * FROM championships WHERE in_progress==1"
    if (id_player != undefined) {
        query = "SELECT championships.* FROM championships INNER JOIN championships_players ON id = id_championship WHERE in_progress==1 AND id_player==" + id_player
    }
    let championships = await utils.db_all(query)
    return championships
}

async function get_chart(id_players) {
    let query = "SELECT id_player, username, image,  CAST(AVG(score)*(1-1.0/COUNT(*)) AS INT) AS score FROM championships_players INNER JOIN players ON id_player = id GROUP BY id;"
    if (id_players.length != 0) {
        query += " WHERE "
        for (let i = 0; i < id_players.length - 1; i++) {
            query += "id_player==" + id_players[i] + " or "
        }
        query += "id_player==" + id_players[id_players.length - 1]
    }
    query += " GROUP BY id_player ORDER BY AVG(score) DESC;"
    let charts = await utils.db_all(query)
    return charts
}

async function update_match_result(id_match, team1_score, team2_score) {
    let update_match_query = "UPDATE matches SET datetime = datetime('now'), to_be_played = 0, team1_score = " + team1_score + ", team2_score = " + team2_score + " WHERE id==" + id_match + ";"
    await utils.db_run(update_match_query, [])
    let team1_points = (team1_score > team2_score) ? 1 : 0
    let update_championship_match = "UPDATE championships_matches SET to_be_played = 0, team1_points = " + team1_points + ", team2_points = " + (1 - team1_points) + " WHERE id_match==" + id_match + ";"
    var [_, change] = await utils.db_run(update_championship_match, [])
    return change
}

async function login(id_player, password) {
    let query = "SELECT * FROM players WHERE id==" + id_player + ";"
    let player = await utils.db_all(query)
    if (player.length != 0) {
        player = player[0]
        if (player["password"] == password) {
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

async function delete_championship(id_championship) {
    let query = "SELECT id_match FROM championships_matches WHERE id_championship==" + id_championship
    let id_matches = await utils.db_all(query)
    id_matches = id_matches.map((a) => a.id_match)
    console.log(id_matches)

    let delete_query = "DELETE FROM championships_matches WHERE id_championship==?;"
    let _, change = await utils.db_run(delete_query, [id_championship])
    console.log(change)

    if(id_matches.length > 0) {
        delete_query = "DELETE FROM matches WHERE"
        for(let i=0;i<id_matches.length-1;i++) {
            delete_query += " id==? OR"
        }
        delete_query += " id==?;"
        _, change = await utils.db_run(delete_query, id_matches)
        console.log("matches: ", change)
    }

    delete_query = "DELETE FROM championships_players WHERE id_championship==?;"
    _, change = await utils.db_run(delete_query, [id_championship])
    console.log(change)

    delete_query = "DELETE FROM championships_teams WHERE id_championship==?;"
    _, change = await utils.db_run(delete_query, [id_championship])
    console.log(change)

    delete_query = "DELETE FROM championships WHERE id==?;"
    _, change = await utils.db_run(delete_query, [id_championship])
    console.log(change)

    return {
        "championship_deleted": true
    }
}

async function get_prizes(id_player) {
    let query = "SELECT * FROM championships_players INNER JOIN championships ON id_championship = id WHERE id_player==" + id_player + ";"
    let prizes = await utils.db_all(query)
    return prizes
}

module.exports.get_players = get_players;
module.exports.get_locations = get_locations;
module.exports.get_championships_in_progress = get_championships_in_progress;
module.exports.get_chart = get_chart;
module.exports.create_championship = create_championship;
module.exports.get_championship_info = get_championship_info;
module.exports.get_championship_matches = get_championship_matches;
module.exports.get_championship_details = get_championship_details;
module.exports.update_match_result = update_match_result;
module.exports.login = login;
module.exports.delete_championship = delete_championship;
module.exports.get_prizes = get_prizes;