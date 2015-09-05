/**
 * Created by ShrimpTang on 2015/9/4.
 */
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1337, "127.0.0.1");

console.log('Server running rrrrrrrrrrat http://127.0.0.1:1337/');