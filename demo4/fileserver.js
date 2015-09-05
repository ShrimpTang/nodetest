/**
 * Created by ShrimpTang on 2015/9/5.
 */
var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var items = [];
var server = http.createServer(function (req, res) {
    var p = path.join(__dirname, url.parse(req.url).pathname);
    var s = fs.createReadStream(p);
    s.pipe(res);
    s.on('error', function (err) {
        res.statusCode = 500;
        res.end('error');
    });
});

server.listen(3000);
