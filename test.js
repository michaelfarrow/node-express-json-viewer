var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/api', function (req, res) {
  var pug = require('pug')
  var path = require('path')
  var compiled = pug.compileFile(path.resolve(__dirname, 'templates/views/json.pug'))
  res.send(compiled({
    _: require('lodash'),
    isUrl: require('is-url'),
    data: {
      test: 'Hello World',
      url: 'http://google.com',
      object: {
        test: 2,
        test2: 3
      },
      array: [0, 1, 2, 3],
      array: [0, 'one', 2, 'three']
    }
  }))
})

app.listen(3000)
