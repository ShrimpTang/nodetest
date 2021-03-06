var express = require('express'),
    User = require("../models/user"),
    Post = require("../models/post")
    crypro = require("crypto"),
    Comment = require("../models/comment");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    Post.getAll(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index',
            {
                posts: posts,
                title: '主页',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            }
        );
    });

});
router.get('/reg', checkNoLogin);
router.get('/reg', function (req, res) {
    res.render('reg',
        {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
});
router.post('/reg', checkNoLogin);
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
    User.get(newUser.name, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', '用户已存在');
            return res.redirect('/reg');
        }
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = user;
            req.flash('success', '注册成功!');
            res.redirect('/');//注册成功后返回主页
        })

    });

});

router.get('/login', checkNoLogin);
router.get('/login', function (req, res) {
    res.render('login', {
        title: '登录',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/login', checkNoLogin)
router.post('/login', function (req, res) {
    User.get(req.body.name, function (err, user) {
        if (err) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }

        if (user.password != req.body.password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', '登陆成功');
        res.redirect('/');
    });
});

router.get('/post', checkLogin);
router.get('/post', function (req, res) {
    res.render('post', {
        title: '发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/post', checkLogin)
router.post('/post', function (req, res) {
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.content);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            res.redirect('/');
        }
        req.flash('success', '发表成功');
        res.redirect('/');
    })
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
});

router.get('/upload', checkLogin);
router.get('/upload', function (req, res) {
    res.render('upload', {
        title: '文件上传',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});

router.post('/upload', checkLogin);
router.post('/upload', function (req, res) {
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
});

router.get('/u/:name', function (req, res) {
    User.get(req.params.name, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        Post.getAll(user.name, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
});

router.get('/u/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, true, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    })
});


router.post('/u/:name/:day/:title', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var comment = {
        name: req.body.name,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '留言成功!');
        res.redirect('back');
    });
});

router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.getOne(currentUser.name, req.params.day, req.params.title, false, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        res.render('edit', {
            title: '编辑',
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect(req.url);//出错！返回文章页
        }
        req.flash('success', '修改成功!');
        res.redirect(req.url);//成功！返回文章页
    })
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除成功');
        res.redirect('/');
    });
});

module.exports = router;
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录');
        res.redirect('/login');
    }
    next();
}

function checkNoLogin(req, res, next) {
    if (req.session.user) {
        req.flash('success', '已登陆');
        res.redirect('back');
    }
    next();
}