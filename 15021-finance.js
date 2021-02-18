var path = require('path')
var app = require('express')()
jwt = require('jsonwebtoken');
fs = require('fs');
require('dotenv/config')
app.use(require('body-parser').json()) // Parses json, multi-part (file), url-encoded
help = require('./config/help')
getMaster = require('./config/master')
master = new getMaster.F1_Master()
res = new help.Helpfix()
tokenList = {}
// knex = require('knex')({client: 'mysql', connection: { host:'localhost', user: 'root', port: 3306, password: '', database: 'erpfix2'}})
knex = require('knex')({client: 'mysql', connection: { host:'103.149.46.78', user: 'erpfixc1', port: 3306, password: 'QPd]+44u96jFWq', database: 'erpfixc1_root'}})
require('knex-paginate').attachPaginate()

require('./f2/cr').app(app)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/', function (req, result) {result.sendFile(path.join(path.join(__dirname, ''), 'abc.html'))})

require('reload')(app).then(function () {
  require('http').createServer(app).listen(15021, function () {
    console.log('Web server listening on port ' + 15021)
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})