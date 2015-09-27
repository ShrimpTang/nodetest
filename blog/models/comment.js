/**
 * Created by ShrimpTang on 2015/9/27.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var setting = require('../setting')

var url = setting.url;

function Comment(name, day, title, comment) {
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
}

Comment.prototype.save = function (callback) {
    var name = this.name;
    var day = this.day;
    var title = this.title;
    var comment = this.comment;
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(db);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return err;
            }
            collection.update({
                'name': name,
                'time.day': day,
                'title': title
            }, {
                $push: {'comments': comment}
            }, function (err) {
                db.close();
                if (err) {
                    callback(err);
                }
                callback(null);
            })
        })
    })
}

module.exports = Comment;