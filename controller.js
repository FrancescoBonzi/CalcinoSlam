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

async function update_match_result(req, res, next) {
    let id_match = req.query.id_match
    let team1_score = req.query.team1_score
    let team2_score = req.query.team2_score
    let success = await model.update_match_result(id_match, team1_score, team2_score)
    res.type("application/json")
    res.send(JSON.stringify(success))
}

async function get_charts(req, res, next) {
    id_players = req.body.id_players
    let charts = await model.get_charts(id_players)
    res.type("application/json")
    res.send(JSON.stringify(charts))
}

exports.dispatcher = function (app) {
    app.post('/create_championship', create_championship)
    app.post('/get_players', get_players)
    app.post('/get_locations', get_locations)
    app.post('/get_charts', get_charts)
    app.post('/login', login)
    app.get('/get_championships_in_progress', get_championships_in_progress)
    app.get('/get_championship_info', get_championship_info)
    app.get('/get_championship_matches', get_championship_matches)
    app.get('/get_championship_details', get_championship_details)
    app.get('/update_match_result', update_match_result)
    app.use(error404) // 404 catch-all handler (middleware)
    app.use(error500) // 500 error handler (middleware)
}