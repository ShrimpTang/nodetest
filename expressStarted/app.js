var express = require("express");

var app = express();
app.use(express.static('public'))
app.get('/', function (req, res) {
    console.info('get!');
    res.send('Hello world!');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var prot = server.address().port;
    console.info(host + "@@@" + prot);
});