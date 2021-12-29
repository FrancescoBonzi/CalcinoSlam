const model = require('./model.js')

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
        if (details.num_teams >= 3 && details.num_teams <= 8) {
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
        case 3:
            let match0 = match_chart(details.matches[0])
            let match2 = match_chart(details.matches[2])
            new_matches.push([match0.winner, match2.winner])
        case 4:
            let match2 = match_chart(details.matches[2])
            let match3 = match_chart(details.matches[3])
            if (match2.winner == match3.winner) {
                new_matches.push([match3.loser, match2.loser])
            }
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
        case 4:
            let match2 = match_chart(details.matches[2])
            let match3 = match_chart(details.matches[3])
            new_matches.push([match2.winner, match3.winner])
        case 5:
            let match2 = match_chart(details.matches[2])
            let match4 = match_chart(details.matches[4])
            if (match2.winner != match4.winner) {
                let parent_match = parent_match_standardtree(match4.winner)
                let match = match_chart(details.matches[parent_match])
                new_matches.push([match.winner, match2.winner])
            }
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
        case 5:
            let match3 = match_chart(details.matches[3])
            let match4 = match_chart(details.matches[4])
            new_matches.push([match3.winner, match4.winner])
        case 6:
            let match4 = match_chart(details.matches[4])
            if (match4.winner == 6) {
                let match5 = match_chart(details.matches[5])
                if (match5.winner == 6) {
                    let match2 = match_chart(details.matches[2])
                    let parent_match = parent_match_standardtree(match5.loser)
                    let match = match_chart(details.matches[parent_match])
                    new_matches.push([match2.winner, match.winner])
                } else {
                    let parent_match = parent_match_standardtree(match5.winner)
                    let match = match_chart(details.matches[parent_match])
                    new_matches.push([match.winner, 6])
                }
            }
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
        case 6:
            let match4 = match_chart(details.matches[4])
            let match5 = match_chart(details.matches[5])
            new_matches.push([match4.winner, match5.winner])
            new_matches.push([match4.loser, match5.loser])
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
            "final score": 45
        },
        {
            "id_players": [1, 2],
            "id_team": 1,
            "final_position": 1,
            "final score": 45
        }]
    }
    let details = model.get_championship_details(id_championship)
    if (details.type == "GIRONE") {
        let 

    }
    
    //to do: inserire nel database in championship_players place & score

    return result
}






module.exports.championship_manager = championship_manager;
module.exports.chart_manager = chart_manager;