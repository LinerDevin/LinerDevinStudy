var url = require('url')
var fs = require('fs')
var querystring = require('querystring')

var User = require(__dirname + '/models/user')

function Route(req, res) {
    var userInfo;

    var pathname = url.parse(req.url).pathname

    // 路由 渲染页面 
    if (req.method === "GET") {
        if (pathname === '/') {
            Render('/index', res)
        } else if (pathname === '/index') {
            Render(pathname, res)
        } else if (pathname === '/login') {
            Render(pathname, res)
        } else if (pathname === '/register') {
            Render(pathname, res)
        } else if (pathname.indexOf('/public/') === 0) { // 开放css、js、img资源
            // 设置响应头
            SetHead(pathname, res)
        } else {
            Render('/404', res)
        }
    }


    // Api POST 发送请求
    if (req.method === "POST") {
        if (pathname === '/login') {
            Send(req, data => {
                var body = querystring.parse(data) // 发送的post对象
                User.find(body, res)
            })
        } else if (pathname === '/register') {
            Send(req, (data) => {
                var body = querystring.parse(data) // 发送的post对象
                User.save(body, res)
                console.log("登录res:", res.userName)

            })
        } else if (pathname === '/indexInfo') {
            // 获取登录用户
            userInfo = User.ReturnUser()
            // console.log("result:",userInfo)
            if (userInfo) {
                res.write(JSON.stringify(userInfo))
                res.end()
            }
        } else if(pathname === '/toLogout'){
            
        }
    }
}


/* ------------------------------- 方法 --------------------------------------- */

// 渲染页面
function Render(a, res) {
    fs.readFile(__dirname + '/views' + a + '.html', (err, data) => {
        if (err) {
            res.end('404 Not Found.')
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(data)
        }
    })
}

// 发送请求
function Send(req, callback) {
    var data = ""
    req.on("err", function (err) {
        console.error(err)
    }).on("data", function (chunk) {
        data += chunk
    }).on("end", function () {
        // console.log("post:", querystring.parse(data), data)
        callback(data)
    })
}

// 设置响应头
function SetHead(pathname, res) {
    if (pathname.indexOf('.css') > 0) {
        res.writeHead(200, {
            'Content-Type': 'text/css'
        })
    } else if (pathname.indexOf('.js') > 0) {
        res.writeHead(200, {
            'Content-Type': 'application/x-javascript'
        })
    } else if (pathname.indexOf('.jpg') > 0) {
        res.writeHead(200, {
            'Content-Type': 'application/x-jpg'
        })
    } else if (pathname.indexOf('.png') > 0) {
        res.writeHead(200, {
            'Content-Type': 'image/png'
        })
    }

    fs.readFile('.' + pathname, (err, data) => {
        if (err) {
            return res.end('404 Not Found.')
        }
        res.end(data)
    })
}

module.exports.route = Route