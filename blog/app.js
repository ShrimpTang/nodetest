var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var setting = require("./setting")
var routes = require('./routes/index');
var users = require('./routes/users');
var flash = require("connect-flash");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var app = express();
app.use(session({
    secret:setting.cookieSecret,
    key:setting.db,
    cookie:{maxAge:1000*60*60*24*30},
    store:new mongoStore({
        db:setting.db,
        host:setting.host,
        port:setting.port
    })
}));
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/blog';
// Use connect method to connect to the Server
//MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    console.log("Connected correctly to server");
//    insertDoc(db, function () {
//        db.close();
//    })
//});

//var insertDoc = function (db, callback) {
//    var collection = db.collection('doc');
//    collection.insert([{a: 1}, {a: 2}, {a: 3}], function (err, reslut) {
//        console.info(reslut.result.n + '@@' + reslut.ops.length);
//        callback(reslut);
//    });
//
//}

module.exports = app;
