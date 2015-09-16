var express = require('express');
var User = require("../models/user");
var crypro = require("crypto");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: '主页'});
});

router.get('/reg', function (req, res) {
    res.render('reg', {title: '注册'});
});

router.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    if (password != password_re) {
        req.flash('error', '两次输入密码不一致');
        return res.redirect('/reg');
    }
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    User.get(newUser.name,function(err,user){
       if(err){
           req.flash('error',err);
           return res.redirect('/');
       }
        if(user){
            req.flash('error','用户已存在');
            return res.redirect('/reg');
        }
        newUser.save(function (err,user) {
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = user;
            req.flash('success','注册成功!');
            res.redirect('/');//注册成功后返回主页
        })

    });

});

router.get('/login', function (req, res) {
    res.render('login', {title: '登录'});
});

router.post('/login', function (req, res) {
});

router.get('/post', function (req, res) {
    res.render('post', {title: '发表'});
});

router.post('/post', function (req, res) {
});

router.get('/logout', function (req, res) {
});

module.exports = router;
