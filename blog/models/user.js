var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var setting = require('../setting')

var url = 'mongodb://localhost:27017/blog';

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

User.prototype.save = function (callback) {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email
    };
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.insert(user, {safe: true}, function (err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    })
};


User.get = function (name, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                MongoClient.close();
                return callback(err);
            }
            collection.findOne({name: name}, function (err, user) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
};