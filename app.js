var http = require('http')

var router = require('./router')

http.createServer((req, res) => {

  // 引入路由
  router.route(req,res)

}).listen(8080, () => {
  console.log('running in 8080...')
})