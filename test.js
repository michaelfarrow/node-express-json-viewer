var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

var sanitize = function (data) {
  var cache = []
  return JSON.parse(JSON.stringify(data, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  }))
}

app.get('/api', function (req, res) {
  var pug = require('pug')
  var path = require('path')
  var _ = require('lodash')
  var compiled = pug.compileFile(path.resolve(__dirname, 'templates/views/json.pug'))
  var truthy = ['true', '1']
  var json = truthy.indexOf(_.get(req, 'query.json')) !== -1 ||
    _.get(req, 'headers.accept') === 'application/json'

  console.log(req.headers)

  var data = sanitize(req)

  if (json) return res.send(data)
  // res.send(compiled({
  //   _: require('lodash'),
  //   isUrl: require('is-url'),
  //   data: {
  //     test: 'Hello World',
  //     url: 'http://google.com',
  //     object: {
  //       test: 2,
  //       test2: 3
  //     },
  //     array: [0, 1, 2, 3],
  //     array: [0, 'one', 2, 'three']
  //   }
  // }))
  res.send(compiled({
    _: _,
    isUrl: require('is-url'),
    data: data
  }))
})

app.listen(3000)
