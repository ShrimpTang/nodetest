/**
 * Created by ShrimpTang on 2015/9/5.
 */
var http = require("http");
var url = require("url");
var qs = require("querystring");
var formidable = require("formidable");
var items = [];
var server = http.createServer(function (req, res) {
    if ("/" == req.url) {
        switch (req.method) {
            case "POST":
                add(req, res);
                break;
            case "GET":
                show(res);

                break;
            case "DELETE":
                var path = url.parse(req.url).pathname;
                var i = parseInt(path.slice(1));
                if (isNaN(i)) {
                    res.statusCode = 400;
                    res.end("is not id");
                } else if (!items[i]) {
                    res.statusCode = 404;
                    res.end("not find");
                } else {
                    items.slice(i, 1);
                    res.end('OK');
                }
                break;
        }
    } else {
        res.end('404');
    }
});

server.listen(3000);

function show(res) {
    var html = '<html lang="en"><head><title></title></head><body>'
        + '<h1>TODO list</h1>'
        + '<ul>'
        + items.map(function (item) {
            return '<li>' + item + '</li>';
        }).join('')
        + '</ul>'
        + '<form action="/" method="post" enctype="multipart/form-data">'
        + '<input name="item">'
        + '<input name="file" type="file">'
        + '<input type="submit" value="tijiao">'
        + '</form>'
        + '</body></html>';

    res.setHeader("Content-type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html));
    //items.forEach(function (data, index) {
    //    res.write(index + "}" + data + "\n");
    //});
    res.end(html);
    return;
}

function add(req, res) {
    var body = "";
    var iform = new formidable.IncomingForm();
    iform.parse(req,function(err, fields, files){
        console.log(err);
        console.log(fields);
        console.log(files);
        res.end("OK!");
    });
    //req.on("data", function (chunk) {
    //    body += chunk;
    //});
    //req.on("end", function () {
    //    console.info(body);
    //    items.push(qs.parse(body).item);
    //    show(res);
    //    res.end()
    //});

}