var express = require('express')
var app = express()

app.use(require('./index'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/api', function (req, res) {
  res.json(req)
})

app.listen(3000)
