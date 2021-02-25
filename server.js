var path = require('path')
var app = require('express')()
jwt = require('jsonwebtoken');
fs = require('fs');
require('dotenv/config')
app.set('port', process.env.PORT || 3000)
app.use(require('body-parser').json()) // Parses json, multi-part (file), url-encoded
help = require('./config/help')
getMaster = require('./config/master')
master = new getMaster.F1_Master()
res = new help.Helpfix()
tokenList = {}
knex = require('knex')({client: 'mysql', connection: { host:'103.149.46.78', user: 'erpfixc1', port: 3306, password: 'QPd]+44u96jFWq', database: 'erpfixc1_root'}})
require('knex-paginate').attachPaginate()

require('./f0/auth').app(app)
require('./f0/generator').app(app)
require('./f1/area').app(app)
require('./f1/bank').app(app)
require('./f1/Branch').app(app)
require('./f1/city').app(app)
require('./f1/Class').app(app)
require('./f1/Coa').app(app)
require('./f1/Color').app(app)
require('./f1/Contact').app(app)
require('./f1/Cost_center').app(app)
require('./f1/Country').app(app)
require('./f1/Currency').app(app)
require('./f1/Division').app(app)
require('./f1/Item').app(app)
require('./f1/Location').app(app)
require('./f1/Mailing').app(app)
require('./f1/Project').app(app)
require('./f1/Subdivision').app(app)

require('./f1/search').app(app)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('/f1/search/:id', async(req, result) => {
//   let respond = {}
//   try {
//       respond = 'await tryFunc(req, param)'
//   }
//   catch (err) {
//       respond = res.fail(err.stack.split('\n')[0], 409, err.stack.split('\n'), line, filename)
//   }
//   result.status(202).send('202');
// });

// app.get('/', function (req, result) {result.sendFile(path.join(path.join(__dirname, ''), 'abc.html'))})

require('reload')(app).then(function () {
  require('http').createServer(app).listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})
