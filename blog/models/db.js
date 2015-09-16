/**
 * Created by ShrimpTang on 2015/9/13.
 */
//var setting = require('../setting'),
//    Db = require('mongodb').Db,
//    Connection = require('mongodb').MongoClient
//var mongodb = require("mongodb");
//var mongodbServer = new mongodb.Server('localhost', 27017, {auto_reconnect: true, poolSize: 10});
//var db = new mongodb.Db('blog', mongodbServer);

var setting = require('../setting')
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/blog';

exports.mongodb = MongoClient;
exports.url = url;