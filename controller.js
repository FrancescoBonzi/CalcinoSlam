const utils = require('./utils.js');
const model = require('./model.js');

function error404(req, res, next) {
    res.status(404);
    res.render('404');
}

function error500(err, req, res, next) {
    console.error(err)
    res.status(500);
    res.render('500');
}

async function create_championship(req, res, next) {
    let location = req.body.location
    let type = req.body.type
    let id_player = req.body.id_player
    let organizer = req.body.organizer
    let name = req.body.name
    let comment = req.body.comment
    let response = await model.create_championship(location, type, id_player, organizer, name, comment)
    res.type("application/json")
    res.send(JSON.stringify(response))
    return 0
}

async function get_players(req, res, next) {
    let id_players = req.body.id_players
    let players = await model.get_players(id_players)
    res.type("application/json")
    res.send(JSON.stringify(players))
}

async function get_locations(req, res, next) {
    let id_locations = req.body.id_locations
    let locations = await model.get_locations(id_locations)
    res.type("application/json")
    res.send(JSON.stringify(locations))
}

async function login(req, res, next) {
    let id_player = req.body.id_player
    let password = req.body.password
    let player = await model.login(id_player, password)
    if(player.length == 0) {
        player = {
            "ok": false
        }
    }
    res.type("application/json")
    res.send(JSON.stringify(player))
}

async function get_championships_in_progress(req, res, next) {
    let id_player = req.id_player
    let championships = await model.get_championships_in_progress(id_player)
    res.type("application/json")
    res.send(JSON.stringify(championships))
}

async function get_championship_info(req, res, next) {
    let id_championship = req.query.id_championship
    console.log("id_championship: " + id_championship)
    let championship_info = await model.get_championship_info(id_championship)
    res.type("application/json")
    res.send(JSON.stringify(championship_info))
}

async function get_championship_matches(req, res, next) {
    let id_championship = req.query.id_championship
    let matches = await model.get_championship_matches(id_championship)
    res.type("application/json")
    res.send(JSON.stringify(matches))
}

async function get_championship_details(req, res, next) {
    let id_championship = req.query.id_championship
    let details = await model.get_championship_details(id_championship)
    res.type("application/json")
    res.send(JSON.stringify(details))
}

async function update_championship_status(req, res, next) {
    let id_match = req.query.id_match
    let id_championship = req.query.id_championship
    let team1_score = parseInt(req.query.team1_score)
    let team2_score = parseInt(req.query.team2_score)
    let update_success = await model.update_match_result(id_match, team1_score, team2_score)
    let result
    if (update_success){
        result = await utils.championship_manager(id_championship)
    }else{
        result = {
            "error": "error in the update of the match score"
        }
    }
    res.type("application/json")
    res.send(JSON.stringify(result))
}

async function get_chart(req, res, next) {
    id_players = req.body.id_players
    let chart = await model.get_chart(id_players)
    res.type("application/json")
    res.send(JSON.stringify(chart))
}

async function get_championship_chart(req, res, next){
    let id_championship = req.query.id_championship
    let chart = await utils.chart_manager(id_championship)
    res.type("application/json")
    res.send(JSON.stringify(chart))
}

async function delete_championship(req, res, next){
    let id_championship = req.query.id_championship
    let result = await model.delete_championship(id_championship)
    res.type("application/json")
    res.send(JSON.stringify(result))
}

async function get_prizes(req, res, next){
    let id_player = req.query.id_player
    let prizes = await model.get_prizes(id_player)
    res.type("application/json")
    res.send(JSON.stringify(prizes))
}

exports.dispatcher = function (app) {
    app.post('/create_championship', create_championship)
    app.post('/get_players', get_players)
    app.post('/get_locations', get_locations)
    app.post('/get_chart', get_chart)
    app.post('/login', login)
    app.get('/get_championships_in_progress', get_championships_in_progress)
    app.get('/get_championship_info', get_championship_info)
    app.get('/get_championship_matches', get_championship_matches)
    app.get('/get_championship_details', get_championship_details)
    app.get('/update_championship_status', update_championship_status)
    app.get('/get_championship_chart', get_championship_chart)
    app.get('/delete_championship', delete_championship)
    app.get('/get_prizes', get_prizes);
    app.use(error404) // 404 catch-all handler (middleware)
    app.use(error500) // 500 error handler (middleware)
}