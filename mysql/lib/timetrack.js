/**
 * Created by ShrimpTang on 2015/9/5.
 */
var qs = require("querystring");
exports.sendHtml = function (res, html) {
    res.setHeader("Content-Type", "text/html")
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
};

exports.parseReceivedData = function (req, callback) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        body += chunk;
    })
    req.on('end', function () {
        var data = qs.parse(body);
        callback(data);
    });
}

exports.actionForm = function (id, path, label) {
    var html = '<form method="POST" action="' + path + '">  <input type="hidden" name="id" value="' + id + '"> <input type="submit" value="' + label + '"> </form>';
    return html;
}


exports.add = function (db, req, res) {
    exports.parseReceivedData(req, function (work) {
        db.query('insert into work(hours,date,description) values(?,?,?)', [work.hours, work.date, work.description], function (err) {
            if (err) throw  err;
            exports.show(db, res);
        });
    });
}

exports.delete = function (db, req, res) {
    exports.parseReceivedData(req, function (work) {
        db.query('delete from work where id = ?', [work.id], function (err) {
            if (err) throw err;
            exports.show(db, res);

        })
    })
}

exports.archive = function (db, req, res) {
    exports.parseReceivedData(req, function (work) {
        db.query('update work set archived=1 where id = ?', [work.id], function (err) {
            if (err) throw  err;
            exports.show(db, res);
        })
    });
}

exports.show = function (db, res, showArchived) {
    var query = 'select * from work where archived = ? order by date desc';
    var archived = (showArchived) ? 1 : 0;
    db.query(query, [archived], function (err, rows) {
        if (err) throw err;
        var html = (showArchived) ? '' : '<a href="/archived">显示归档</a>';
        html += exports.workHitlistHrml(rows);
        html += exports.workFormHtml();
        exports.sendHtml(res, html);
    });
}


exports.workHitlistHrml = function (rows) {
    var html = '<table>';
    var asdf = 123 + 32;
    rows.forEach(function (item) {
        var mDate = item['date'].toLocaleDateString();
        html += '<tr>';
        html += '<td>' + mDate + '</td>';
        html += '<td>' + item.hours + '</td>';
        html += '<td>' + item.description + '</td>';
        if (!item.archived) {
            html += '<td>' + exports.workArchiveForm(item.id) + '</td>';
        } else {
            html += '<td></td>';
        }
        html += '<td>' + exports.workDeleteForm(item.id) + '</td>'
        html += '</tr>';
    });
    //for (var i = 0; i < rows.length; i++) {
    //    var mDate = rows[i]['date'].toLocaleDateString();
    //    html += '<tr>';
    //    html += '<td>' + mDate + '</td>';
    //    html += '<td>' + rows[i].hours + '</td>';
    //    html += '<td>' + rows[i].description + '</td>';
    //    if (!rows[i].archived) {
    //        html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
    //    } else {
    //        html += '<td></td>';
    //    }
    //    html += '<td>' + exports.workDeleteForm(rows[i].td) + '</td>'
    //    html += '</tr>';
    //}
    html += '</table>';
    return html;
}

exports.workFormHtml = function () {
    var html = '<form method="POST" action="/">' +
        '<p>Date (yyyy-mmm-dd)<br><input name="date" type="text"/></p>' +
        '<p>Hours worked<br><input name="hours" type="text"/></p>' +
        '<p>description<br><input name="description" type="text"/></p>' +
        '<input type="submit" value="add">' +
        '</form>';
    return html;
}

exports.workArchiveForm = function (id) {
    return exports.actionForm(id, '/archive', '归档');
}

exports.workDeleteForm = function (id) {
    return exports.actionForm(id, '/delete', '删除');
}