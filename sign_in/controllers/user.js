var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');


exports.handleIndex = function(req, res, next) {
    if (!req.query.username || req.query.username == '') {
        if (req.session.user) {
            res.redirect('/?username=' + req.session.user.username); 
        } else {
            res.render('login', {'title': '用户登录'});    
        }
    } else {
        var username = req.query.username;
        mongoose.model('User').find({
            'username': username
        }, function(err, users) {
            if (err) {
                console.log(err);
                throw err;
            } else if (users.length <= 0) {
                res.redirect('/regist');
            } else {
                var user = users[0];
                var sessionUser, session_username = '';
                var renderData;

                if (!req.session.hasOwnProperty('user')) {
                    res.redirect('/login');
                    return;    
                } else {
                    sessionUser = req.session.user;
                    session_username = req.session.user.username;         
                }
                if (session_username != user.username) {
                    // 权限错误
                    renderData = {
                        'authError': true,
                        'title': sessionUser.username + '详情页',
                        'username': sessionUser.username,
                        'studentId': sessionUser.studentId,
                        'phoneNumber': sessionUser.phoneNumber,
                        'email': sessionUser.email
                    };
                    res.render('detail', renderData);
                } else {
                    renderData = {
                        'authError': false,
                        'title': user.username + '详情页',
                        'username': user.username,
                        'studentId': user.studentId,
                        'phoneNumber': user.phoneNumber,
                        'email': user.email
                    }
                    res.render('detail', renderData);
                }
            }
        })
    }
}
exports.showLogIn = function(req, res, next) {
    // 用户处于登录状态，现实用户详情页面，否则显示登录页面
    if (req.session.user) {
        res.redirect('/?username=' + req.session.user.username);
    } else {
        res.render('login', {'title': '用户登录'});     
    }
}
exports.showRegist = function(req, res, next) {
    if (req.session.user) {
        res.redirect('/?username=' + req.session.user.username);
    } else {
        res.render('regist', {'title': '用户注册'});        
    }
}

// 用户注册
exports.handleRegist = function(req, res, next) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var studentId = req.body.studentId || '';
    var phoneNumber = req.body.phoneNumber || '';
    var email = req.body.email || '';

    // 密码加密
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var passwordS = sha1.digest('hex');

    mongoose.model('User').find({
        'username': username
    }, function(err, users) {
        if (err) {
            console.log(err);
            throw err;
        } else if (users.length > 0) {
            res.status(200).send({
                'success': false,
                'message': '用户名已存在！请输入其他用户名' 
            });
        } else {
            mongoose.model('User').create({
                'username': username,
                'password': passwordS,
                'studentId': studentId,
                'phoneNumber': phoneNumber,
                'email': email
            }, function(err, user) {
                if (err) console.log(err);
                else {
                    req.session.user = user;
                    res.status(200).send({
                        'success': true,
                        'message': '注册成功！' 
                    });
                }
            });
        }
    });
}
// 用户登录
exports.handleLogIn = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var passwordS = sha1.digest('hex');

    mongoose.model('User').find({
        'username': username
    }, function(err, users) {
        if (err) {
            console.log(err);
            throw err;
        } else if (users.length <= 0) {
            res.status(200).send({
                'success': false,
                'message': '用户不存在！'
            });
        } else if (users.length === 1) {
            var theUser = users[0];
            if (theUser.password != passwordS) {
                res.status(200).send({
                   'success': false,
                    'message': '密码错误！请检查'
                });
            } else if (theUser.password === passwordS) {
                req.session.user = theUser;
                res.status(200).send({
                    'success': true,
                    'message': '登录成功！'
                });
            }
        }
    });
}

exports.handleSignOut = function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log('用户登出');
            res.status(200).send({
                'success': true,
                'message': '用户登出'
            });
        }
    })
}