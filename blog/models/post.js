/**
 * Created by ShrimpTang on 2015/9/17.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert'),
    markdown = require('markdown');
var setting = require('../setting')

var url = setting.url;

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    var post = {
        name: this.name,
        post: this.post,
        title: this.title,
        time: time
    }

    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.insert(post, {safe: true}, function (err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Post.getAll = function (name, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                db.close();
                if (err) {
                    return callback(err);
                }

                docs.forEach(function (doc) {
                    doc.post = markdown.parse(doc.post);
                })
                callback(null, docs);
            });
        });
    });
};

Post.getOne = function (name, day, title, isMarkdown, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function (err, doc) {
                db.close();
                if (err) {
                    return callback(err);
                }
                if (isMarkdown) {
                    doc.post = markdown.parse(doc.post);
                }
                callback(null, doc);
            });
        })
    });
}

Post.update = function (name, day, title, post, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                return callback(err);
            }
            collection.update({
                "name": name,
                "time.day": day,
                "title": title
            }, {
                $set: {post: post}
            }, function (err) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}

Post.remove = function (name, day, title, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.remove({
                "name": name,
                "time.day": day,
                "title": title
            }, {w: 1}, function (err) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};