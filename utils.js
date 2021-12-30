const model = require('./model.js')
const sqlite3 = require('sqlite3').verbose();
const db_file = "data.db"

/******************************************************************************************************
***                                                                                                 ***
*** legends of points for the championships "GIRONE" and "ELIMINAZIONE"                             ***
*** ordered by number of players.                                                                   ***
*** for "ELIMINAZIONE" in the current script it is used just the first of the 45's                  ***
***                                                                                                 ***
******************************************************************************************************/

let legend_girone = {
    "3": [80, 70, 45],
    "4": [85, 70, 60, 45],
    "5": [90, 75, 65, 55, 40],
    "6": [100, 85, 70, 60, 50, 40]
}

let legend_elimin = {
    "4": [85, 70, 60, 45],
    "5": [90, 80, 65, 45, 45],
    "6": [95, 85, 75, 45, 45, 45],
    "7": [100, 90, 75, 60, 45, 45, 45],
    "8": [110, 95, 80, 65, 45, 45, 45, 45]
}

/********************************************************************
***                                                               ***
*** utils functions to perform operation on db                    ***
***                                                               ***
********************************************************************/

function get_key_by_value(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function get_current_timestamp() {
    var d = new Date();
    d = new Date(d.getTime() - 3000000);
    var date_format_str = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
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

/********************************************************************
***                                                               ***
*** championship_manager: function that creates the new matches   ***
*** that have to be played                                        ***
***                                                               ***
********************************************************************/

async function championship_manager(id_championship) {

    let details = await model.get_championship_details(id_championship)
    let result = {
        "championship_approved": false,
        "new_matches": false,
        "championship_end": false,
        "partial_chart": null
    }
    let new_matches = []

    if (details.type == "GIRONE") {
        if (details.num_teams >= 3 && details.num_teams <= 6) {
            result.championship_approved = true

            if (details.matches.length == 0) {
                for (let i = 0; i < details.num_teams; i++) {
                    for (let j = i + 1; j < details.num_teams; j++) {
                        new_matches.push([i, j])
                    }
                }
                result.new_matches = true
            }

            let all_played = true
            for (let i = 0; i <= details.matches.length; i++) {
                if (details.matches[i].score[0] == null) {
                    all_played = false
                    break
                }
            }
            result.championship_end = all_played
        }

    } else if (details.type == "ELIMINAZIONE") {
        if (details.num_teams >= 4 && details.num_teams <= 8) {
            result.championship_approved = true
            if (details.matches.length == 0) {
                for (let i = 0; i < details.num_teams - 1; i = i + 2) {
                    new_matches.push([i, i + 1])
                }
                result.new_matches = true
            } else {
                let all_played = true
                for (let i = 0; i < details.matches.length; i++) {
                    if (details.matches[i].score[0] == null) {
                        all_played = false
                        break
                    }
                }
                if (all_played) {
                    details.matches.sort(function (a, b) { //order the matches by their noticebord index
                        return a.id_noticeboard > b.id_noticeboard
                    })
                    switch (details.num_teams) {
                        case 4:
                            new_matches = manager_case_4teams(details)
                            break
                        case 5:
                            new_matches = manager_case_5teams(details)
                            break
                        case 6:
                            new_matches = manager_case_6teams(details)
                            break
                        case 7:
                            new_matches = manager_case_7teams(details)
                            break
                        case 8:
                            new_matches = manager_case_8teams(details)
                            break
                    }
                }
                if (new_matches.length == 0) {
                    result.championship_end = true
                } else {
                    result.new_matches = true
                }

            }

        }
    }

    //matches
    let insert_matches_query = "INSERT INTO matches (id, datetime, team1_player1, team1_player2, team2_player1, team2_player2, to_be_played, team1_score, team2_score) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
    let id_matches = []
    for (let i = 0; i < new_matches.length; i++) {
        var team1_player1 = teams[new_matches[i][0]][0]
        var team1_player2 = teams[new_matches[i][0]][1]
        var team2_player1 = teams[new_matches[i][1]][0]
        var team2_player2 = teams[new_matches[i][1]][1]
        var [id_match, _] = await db_run(insert_matches_query, [null, null, team1_player1, team1_player2, team2_player1, team2_player2, 1, null, null])
        id_matches += [id_match]
    }

    //championships_matches
    let insert_championships_matches_query = "INSERT INTO championships_matches (id_championship, id_match, to_be_played, team1_points, team2_points, id_noticeboard) " +
        "VALUES (?, ?, ?, ?, ?, ?);"
    for (let i = 0; i < new_matches.length; i++) {
        await db_run(insert_championships_matches_query, [id_championship, id_matches[i], 1, null, null, details.matches.length + i])
    }

    return result
}

function match_chart(match) {
    return {
        "winner": match.score[0] > match.score[1] ? match.team1 : match.team2,
        "loser": match.score[0] > match.score[1] ? match.team2 : match.team1
    }
}

function manager_case_4teams(details) {
    let new_matches = []
    if (details.matches.length == 2) {
        let match0 = match_chart(details.matches[0])
        let match1 = match_chart(details.matches[1])
        new_matches.push([match0.winner, match1.winner])
        new_matches.push([match0.loser, match1.loser])
    }
    return new_matches
}

function manager_case_5teams(details) {
    let new_matches = []
    switch (details.matches.length) {
        case 2:
            let match1 = match_chart(details.matches[1])
            new_matches.push([match1.winner, 4])
            break
        case 3:
            let match0 = match_chart(details.matches[0])
            let match2 = match_chart(details.matches[2])
            new_matches.push([match0.winner, match2.winner])
            break
        case 4:
            let match2bis = match_chart(details.matches[2])
            let match3 = match_chart(details.matches[3])
            if (match2.winner == match3.winner) {
                new_matches.push([match3.loser, match2bis.loser])
            }
            break
    }
    return new_matches
}

function parent_match_standardtree(winner) {     //returns id_noticeboard of the match (within the first round) in which
    //the "winner" was NOT present
    /*
    if (Math.floor(winner/2) > 0){
        return 0
    }else{
        return 1
    }
    */

    return Math.floor(winner / 2) > 0 ? 0 : 1
}

function manager_case_6teams(details) {
    let new_matches = []
    switch (details.matches.length) {
        case 3:
            let match0 = match_chart(details.matches[0])
            let match1 = match_chart(details.matches[1])
            new_matches.push([match0.winner, match1.winner])
            break
        case 4:
            let match2 = match_chart(details.matches[2])
            let match3 = match_chart(details.matches[3])
            new_matches.push([match2.winner, match3.winner])
            break
        case 5:
            let match2bis = match_chart(details.matches[2])
            let match4 = match_chart(details.matches[4])
            if (match2bis.winner != match4.winner) {
                let parent_match = parent_match_standardtree(match4.winner)
                let match = match_chart(details.matches[parent_match])
                new_matches.push([match.winner, match2bis.winner])
            }
            break
    }
    return new_matches
}

function manager_case_7teams(details) {
    let new_matches = []
    switch (details.matches.length) {
        case 3:
            let match0 = match_chart(details.matches[0])
            let match1 = match_chart(details.matches[1])
            let match2 = match_chart(details.matches[2])
            new_matches.push([match0.winner, match1.winner])
            new_matches.push([match2.winner, 6])
            break
        case 5:
            let match3 = match_chart(details.matches[3])
            let match4 = match_chart(details.matches[4])
            new_matches.push([match3.winner, match4.winner])
            break
        case 6:
            let match4bis = match_chart(details.matches[4])
            if (match4bis.winner == 6) {
                let match5 = match_chart(details.matches[5])
                if (match5.winner == 6) {
                    let match2bis = match_chart(details.matches[2])
                    let parent_match = parent_match_standardtree(match5.loser)
                    let match = match_chart(details.matches[parent_match])
                    new_matches.push([match2bis.winner, match.winner])
                } else {
                    let parent_match = parent_match_standardtree(match5.winner)
                    let match = match_chart(details.matches[parent_match])
                    new_matches.push([match.winner, 6])
                }
            }
            break
    }
    return new_matches
}

function manager_case_8teams(details) {
    let new_matches = []
    switch (details.matches.length) {
        case 4:
            let match0 = match_chart(details.matches[0])
            let match1 = match_chart(details.matches[1])
            let match2 = match_chart(details.matches[2])
            let match3 = match_chart(details.matches[3])
            new_matches.push([match0.winner, match1.winner])
            new_matches.push([match2.winner, match3.winner])
            break
        case 6:
            let match4 = match_chart(details.matches[4])
            let match5 = match_chart(details.matches[5])
            new_matches.push([match4.winner, match5.winner])
            new_matches.push([match4.loser, match5.loser])
            break
    }
    return new_matches
}

/********************************************************************
***                                                               ***
*** chart_manager: function that returns the final                ***
*** chart of a championship when all the matches have been played ***
***                                                               ***
********************************************************************/

async function chart_manager(id_championship) {
    let result = {
        "chart": [{
            "id_players": [1, 2],
            "id_team": 1,
            "final_position": 1,
            "final_score": 45
        },
        {
            "id_players": [1, 2],
            "id_team": 1,
            "final_position": 1,
            "final_score": 45
        }]
    }
    let details = model.get_championship_details(id_championship)
    let final_chart = []
    if (details.type == "GIRONE") {
        won_matches = count_won_matches(id_championship, details)
        final_chart = final_chart_girone(won_matches, details)
    } else if (details.type == "ELIMINAZIONE") {
        switch (details.num_teams) {
            case 4:
                final_chart = final_chart_elim_4(details)
                break
            case 5:
                final_chart = final_chart_elim_5(details)
                break
            case 6:
                final_chart = final_chart_elim_6(details)
                break
            case 7:
                final_chart = final_chart_elim_7(details)
                break
            case 8:
                final_chart = final_chart_elim_8(details)
                break
        }
    }
    for (let i=0; i<details.num_teams; i++){
        let current_team = details.teams["" + (final_chart[i].id_team)]
        result.push({
            "id_players": [current_team[0], current_team[1]],
            "id_team": final_chart[i].id_team,
            "final_position": i, //same as final_chart[i].final_position
            "final_score": final_chart[i].points
        })
    }
    return result
    //to do: inserire nel database in championship_players place & score
}

function count_won_matches(id_championship, details) {
    let won_matches = [] //in place i there is the number of won matches of team i
    for (let i = 0; i < details.num_teams; i++) {
        var id_player = details.teams[i][0]
        var query = "SELECT SUM(1) AS final_score FROM championships_matches INNER JOIN matches ON championships_matches.id_match = matches.id WHERE (id_championship==" + id_championship + " AND ((team1_player1==" + id_player + " OR team1_player2==" + id_player + ") AND team1_points==1) OR ((team2_player1==" + id_player + " OR team2_player2==" + id_player + ") AND team2_points==1))"
        var won_matches_player = await db_all(query)
        won_matches.push({
            "id_team": i,
            "final_score": won_matches_player[0].final_score
        })
    }
    return won_matches
}

function final_chart_girone(won_matches, details) {
    won_matches.sort(function (a, b) {
        return a.final_score < b.final_score
    })
    let final_chart = []
    let row = 0
    while (row < details.num_teams) {
        final_chart.push({
            "id_team": won_matches[row].id_team,
            "final_position": row,
            "points": 0
        })
        var score_team = won_matches.find(o => o.id_team == row).final_score
        var row_comp = row + 1
        var draw = 0 //how many teams are in a draw with the choosen one
        while (row_comp < details.num_teams) {
            var score_comp = won_matches.find(o => o.id_team == won_matches[row_comp].id_team).final_score
            if (score_comp < score_team) {
                break
            } else {
                final_chart.push({
                    "id_team": won_matches[row_comp].id_team,
                    "final_position": row,
                    "points": 0
                })
                draw++
                row_comp++
            }
        }
        //now that we have all the teams in a draw we can assign the points
        if (draw == 0){ // no draw, take the points
            final_chart[row].points = legend_girone["" + (details.num_teams - 3)][row]
        }else if (draw == 1){ //the former team is the one that won the direct match
            let team1 = won_matches[row].id_team
            let team2 = won_matches[row + 1].id_team
            let direct_match = matches.find(o => (o.team1 == team1 && o.team2 == team2) || (o.team1 == team2 && o.team2 == team1))
            let direct_match_chart = match_chart(direct_match)
            let winner_finalchart_index = (team1 == direct_match_chart.winner) ? row : row + 1
            let loser_finalchart_index = (team1 == direct_match_chart.winner) ? row + 1 : row
            let legend_points = legend_girone[details.num_teams - 3]
            final_chart[winner_finalchart_index].final_position = row
            final_chart[winner_finalchart_index].points = legend_points[row]
            final_chart[loser_finalchart_index].final_position = row + 1
            final_chart[loser_finalchart_index].points = legend_points[row + 1]
        }else if (draw >= 2){//all the teams in the the draw get same position and points
            let draw_points = Math.floor(sum_interval(legend_points, row, row+draw, 1) / (draw + 1))
            for (let i=0; i<draw+1; i++){
                final_chart[row + i].points = draw_points
            }
        }
        row = final_chart.length
    }
    return final_chart
}

function sum_interval(array, begin, end, step){
    let summ = 0
    for (let i=begin; i<end; i=i+step){
        summ += array[i]
    }
    return summ
}

function final_chart_elim_4(details) {
    let final_chart = []
    let match2 = match_chart(details.matches[2])
    let match3 = match_chart(details.matches[3])
    final_chart.push({
        "id_team": match2.winner,
        "final_position": 0,
        "points": legend_elimin["" + (details.num_teams)][0]
    })
    final_chart.push({
        "id_team": match2.loser,
        "final_position": 1,
        "points": legend_elimin["" + (details.num_teams)][1]
    })
    final_chart.push({
        "id_team": match3.winner,
        "final_position": 2,
        "points": legend_elimin["" + (details.num_teams)][2]
    })
    final_chart.push({
        "id_team": match3.loser,
        "final_position": 3,
        "points": legend_elimin["" + (details.num_teams)][3]
    })
}

function final_chart_elim_5(details) {
    let final_chart = []
    let matches_details = []
    for (i = 0; i < details.matches.length; i++) {
        matches_details[i] = match_chart(details.matches[i])
    }
    final_chart.push({
        "id_team": matches_details[3].winner,
        "final_position": 0,
        "points": legend_elimin["" + (details.num_teams)][0]
    })
    if (matches_details[2].winner == 4) {
        if (matches_details[3].winner == 4) {
            final_chart.push({
                "id_team": matches_details[4].winner,
                "final_position": 1,
                "points": legend_elimin["" + (details.num_teams)][1]
            })
            final_chart.push({
                "id_team": matches_details[4].loser,
                "final_position": 2,
                "points": legend_elimin["" + (details.num_teams)][2]
            })
        } else {
            final_chart.push({
                "id_team": 4,
                "final_position": 1,
                "points": legend_elimin["" + (details.num_teams)][1]
            })
            final_chart.push({
                "id_team": matches_details[1].winner,
                "final_position": 2,
                "points": legend_elimin["" + (details.num_teams)][2]
            })
        }
        final_chart.push({
            "id_team": matches_details[0].loser,
            "final_position": 3,
            "points": legend_elimin["" + (details.num_teams)][3]
        })
        final_chart.push({
            "id_team": matches_details[1].loser,
            "final_position": 3,
            "points": legend_elimin["" + (details.num_teams)][3]
        })
    } else {
        final_chart.push({
            "id_team": matches_details[3].loser,
            "final_position": 1,
            "points": legend_elimin["" + (details.num_teams)][1]
        })
        let average_points = sum_interval(legend_elimin["" + (details.num_teams)], 2, 4, 1) / 3
        final_chart.push({
            "id_team": matches_details[0].loser,
            "final_position": 2,
            "points": average_points
        })
        final_chart.push({
            "id_team": matches_details[1].loser,
            "final_position": 2,
            "points": average_points
        })
        final_chart.push({
            "id_team": 4,
            "final_position": 2,
            "points": average_points
        })
    }
    return final_chart
}

function final_chart_elim_6(details) {
    let final_chart = []
    let matches_details = []
    for (i = 0; i < details.matches.length; i++) {
        matches_details[i] = match_chart(details.matches[i])
    }
    final_chart.push({
        "id_team": matches_details[4].winner,
        "final_position": 0,
        "points": legend_elimin["" + (details.num_teams)][0]
    })
    if (matches_details[4].winner != matches_details[2].winner) {
        final_chart.push({
            "id_team": matches_details[5].winner,
            "final_position": 1,
            "points": legend_elimin["" + (details.num_teams)][1]
        })
        final_chart.push({
            "id_team": matches_details[5].loser,
            "final_position": 2,
            "points": legend_elimin["" + (details.num_teams)][2]
        })
    } else {
        final_chart.push({
            "id_team": matches_details[3].winner,
            "final_position": 1,
            "points": legend_elimin["" + (details.num_teams)][1]
        })
        final_chart.push({
            "id_team": matches_details[3].loser,
            "final_position": 2,
            "points": legend_elimin["" + (details.num_teams)][2]
        })
    }
    final_chart.push({
        "id_team": matches_details[0].loser,
        "final_position": 3,
        "points": legend_elimin["" + (details.num_teams)][3]
    })
    final_chart.push({
        "id_team": matches_details[1].loser,
        "final_position": 3,
        "points": legend_elimin["" + (details.num_teams)][3]
    })
    final_chart.push({
        "id_team": matches_details[2].loser,
        "final_position": 3,
        "points": legend_elimin["" + (details.num_teams)][3]
    })
}

function final_chart_elim_7(details) {
    let final_chart = []
    let matches_details = []
    for (i = 0; i < details.matches.length; i++) {
        matches_details[i] = match_chart(details.matches[i])
    }
    final_chart.push({
        "id_team": matches_details[5].winner,
        "final_position": 0,
        "points": legend_elimin["" + (details.num_teams)][0]
    })
    if (matches_details[4].winner == 6) {
        if (matches_details[5].winner != 6) {
            final_chart.push({
                "id_team": matches_details[6].winner,
                "final_position": 1,
                "points": legend_elimin["" + (details.num_teams)][1]
            })
            final_chart.push({
                "id_team": matches_details[6].loser,
                "final_position": 2,
                "points": legend_elimin["" + (details.num_teams)][2]
            })
            final_chart.push({
                "id_team": matches_details[4].loser,
                "final_position": 3,
                "points": legend_elimin["" + (details.num_teams)][3]
            })
        } else {
            final_chart.push({
                "id_team": matches_details[5].loser,
                "final_position": 1,
                "points": legend_elimin["" + (details.num_teams)][1]
            })
            final_chart.push({
                "id_team": matches_details[6].winner,
                "final_position": 2,
                "points": legend_elimin["" + (details.num_teams)][2]
            })
            final_chart.push({
                "id_team": matches_details[6].loser,
                "final_position": 3,
                "points": legend_elimin["" + (details.num_teams)][3]
            })
        }
        final_chart.push({
            "id_team": matches_details[0].loser,
            "final_position": 4,
            "points": legend_elimin["" + (details.num_teams)][4]
        })
        final_chart.push({
            "id_team": matches_details[1].loser,
            "final_position": 4,
            "points": legend_elimin["" + (details.num_teams)][4]
        })
        final_chart.push({
            "id_team": matches_details[2].loser,
            "final_position": 4,
            "points": legend_elimin["" + (details.num_teams)][4]
        })
    }
    final_chart.push({
        "id_team": matches_details[5].loser,
        "final_position": 1,
        "points": legend_elimin["" + (details.num_teams)][1]
    })
    final_chart.push({
        "id_team": matches_details[3].loser,
        "final_position": 2,
        "points": legend_elimin["" + (details.num_teams)][2]
    })
    let average_points = sum_interval(legend_elimin["" + (details.num_teams)], 3, 6, 1) / 4
    final_chart.push({
        "id_team": matches_details[0].loser,
        "final_position": 3,
        "points": average_points
    })
    final_chart.push({
        "id_team": matches_details[1].loser,
        "final_position": 3,
        "points": average_points
    })
    final_chart.push({
        "id_team": matches_details[2].loser,
        "final_position": 3,
        "points": average_points
    })
    final_chart.push({
        "id_team": 6,
        "final_position": 3,
        "points": average_points
    })
    return final_chart
}

function final_chart_elim_8(details) {
    let final_chart = []
    let matches_details = []
    for (i = 0; i < details.matches.length; i++) {
        matches_details[i] = match_chart(details.matches[i])
    }
    final_chart.push({
        "id_team": matches_details[6].winner,
        "final_position": 0,
        "points": legend_elimin["" + (details.num_teams)][0]
    })
    final_chart.push({
        "id_team": matches_details[6].loser,
        "final_position": 1,
        "points": legend_elimin["" + (details.num_teams)][1]
    })
    final_chart.push({
        "id_team": matches_details[7].winner,
        "final_position": 2,
        "points": legend_elimin["" + (details.num_teams)][2]
    })
    final_chart.push({
        "id_team": matches_details[7].loser,
        "final_position": 3,
        "points": legend_elimin["" + (details.num_teams)][3]
    })
    final_chart.push({
        "id_team": matches_details[0].loser,
        "final_position": 4,
        "points": legend_elimin["" + (details.num_teams)][4]
    })
    final_chart.push({
        "id_team": matches_details[1].loser,
        "final_position": 4,
        "points": legend_elimin["" + (details.num_teams)][4]
    })
    final_chart.push({
        "id_team": matches_details[2].loser,
        "final_position": 4,
        "points": legend_elimin["" + (details.num_teams)][4]
    })
    final_chart.push({
        "id_team": matches_details[3].loser,
        "final_position": 4,
        "points": legend_elimin["" + (details.num_teams)][4]
    })
    return final_chart
}

module.exports.get_current_timestamp = get_current_timestamp;
module.exports.get_key_by_value = get_key_by_value;
module.exports.db_all = db_all;
module.exports.db_run = db_run;
module.exports.championship_manager = championship_manager;
module.exports.chart_manager = chart_manager;