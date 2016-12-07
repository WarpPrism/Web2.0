// node server
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var mimeType = getMimeType(pathname);
    var method = req.method;
    req.query = url.parse(req.url, true).query;

    if (!!mimeType) {
        // handle static resource
        handleResource(req, res, pathname);
    } else if (req.query['username'] != undefined) {
        // 存在query参数username
        handleQueryUsername(req, res);
    } else if (method.toLowerCase() == 'post') {
        // 处理表单POST提交
        handleFormSubmit(req, res);
    }
});

server.listen(8000, function() {
    console.log('Server started at host 8000...');
});

function getMimeType(pathname) {
    var validExtensions = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png"
    };
    var ext = path.extname(pathname);
    var type = validExtensions[ext];
    return type;
}

// 判断json文件中是否存在用户
function exists(username) {
    if (username == "") {
        return true;
    }
    var usersFilePath = __dirname + '/users.json';
    if (fs.existsSync(usersFilePath)) {
        var filedata = fs.readFileSync('users.json', 'utf8');
        if (filedata == '') {
            filedata = '[]';
        }
        var usersArr = JSON.parse(filedata);
        for (var i = 0, len = usersArr.length; i < len; i++) {
            if (usersArr[i].username == username) {
                return true;
            }
        }
        return false;
    } else {
        // 新建文件
        fs.writeFile('users.json', '[]', 'utf8', function(err) {
            if (err) { throw err; }
        });
        return false;
    }
}

// Handle Static Resource
function handleResource(req, res, pathname) {
    var filepath = __dirname + pathname;
    var mimeType = getMimeType(pathname);
    if (fs.existsSync(filepath)) {
        fs.readFile(filepath, function(err, data) {
            if (err) {
                res.writeHead(500);
                res.end();
            } else {
                res.setHeader('Content-Length', data.length);
                res.setHeader('Content-Type', mimeType);
                res.statusCode = 200;
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
}

function handleQueryUsername(req, res) {
    if (req.query['username'] != '') {
        var username = req.query.username;

        if (exists(username)) {
            // 用户已存在，显示用户详情页
            res.write('user already exists!');
            res.end();
        } else {
            // 用户不存在，显示注册页面
            var new_url = 'http://localhost:8000/sign_up.html';
            res.setHeader('Location', new_url);
            res.writeHead(302);
            res.end('Redirect to ' + new_url);
        }
    } else {
        res.writeHead(200);
        res.end();
    }
}

function handleFormSubmit(req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        if (data != '') {
            var newUser = JSON.parse(data);
            // 已存在该用户
            if (exists(newUser.username)) {
                res.writeHead(200);
                res.end('fail');
                return;
            }
            // 新用户
            var usersFilePath = __dirname + '/users.json';
            if (fs.existsSync(usersFilePath)) {
                var filedata = fs.readFileSync('users.json', 'utf8');
                if (filedata == '') {
                    filedata = '[]';
                }
                var usersArr = JSON.parse(filedata);
                if (Object.prototype.toString.call(usersArr) == '[object Array]') {
                    usersArr.push(newUser);
                } else {
                    throw new Error('users.json format error, should be json array.');
                }
                fs.writeFile('users.json', JSON.stringify(usersArr), 'utf8', function(err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('新用户注册成功！');
                        res.writeHead(200);
                        res.end('success');
                    }
                });
            }
        }
    });
}