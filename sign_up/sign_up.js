// node server
var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    req.query = url.parse(req.url, true).query;

    var exampleUser = {
        username: 'zjh',
        studentId: '13331371',
        phoneNumber: '18826227349'
    };
    // 存在query参数username
    if (req.query['username'] != undefined) {
        if (req.query['username'] != '') {
            var username = req.query.username;
            var usersFilePath = __dirname + '/users.json';
            if (fs.existsSync(usersFilePath)) {
                var file = fs.readFileSync('users.json', 'utf8');
                var users = file.split('\n');
                var exists = false;

                users.forEach(function(item, index) {
                    if (item != '') {
                        item = JSON.parse(item);
                        if (item.username == username) {
                            exists = true;
                            return;
                        }
                    }
                });

                if (exists) {
                    // 用户已存在，显示用户详情页
                    exists = true;
                    res.write('user already exists!');
                    res.end();
                } else {
                    // 用户不存在，显示注册页面
                    
                }
            }

            fs.appendFile('users.json', '\n' + JSON.stringify(exampleUser), 'utf8', function(err) {
                if (err) { throw err; }
                else {
                    console.log('成功导入用户数据。');
                } 
            })
            res.end();
        } else {
            res.writeHead(200);
            res.end();
        }
    }
});

server.listen(8000, function() {
    console.log('Server started at host 8000...');
});
