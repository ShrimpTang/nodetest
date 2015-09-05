/**
 * Created by ShrimpTang on 2015/9/5.
 */
var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tang',
    database: 'my_db'
});

var server = http.createServer(function (request, response) {

    switch (request.method) {
        case "POST":
            switch (request.url) {
                case '/':
                    work.add(db, request, response)
                    break
                case '/archive':
                    work.archive(db, request, response);
                    break;
                case '/delete':
                    work.delete(db, request, response);
                    break;
            }
            break;
        case "GET":
            switch (request.url) {
                case '/':
                    work.show(db, response);
                    break;
                case '/archived':
                    work.show(db, response,true);
                    break;
            }
            break;
    }
});
db.query('create table if not exists work( ' +
    'id int(10) not null auto_increment,' +
    'hours decimal(5,2) default 0,' +
    'date DATE,' +
    'archived int(1) default 0,' +
    'description longtext,' +
    'primary key(id))', function (err) {
    if (err) throw  err;
    console.log('server start');
    server.listen(3000);
})