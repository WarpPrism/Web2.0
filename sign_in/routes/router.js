var express = require('express');
var router = express.Router();

var User = require('../controllers/user');

// Get 请求
router.get('/', User.handleIndex);
router.get('/regist', User.showRegist);
router.get('/login', User.showLogIn);

// POST 请求 
router.post('/user_regist', User.handleRegist);
router.post('/user_login', User.handleLogIn);
router.post('/sign_out', User.handleSignOut);


module.exports = router;