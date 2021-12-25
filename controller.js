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

function home_page(req, res, next) {
    return 0
}

exports.dispatcher = function (app) {
    app.get('/', home_page);
    app.use(error404); // 404 catch-all handler (middleware)
    app.use(error500); // 500 error handler (middleware)
}