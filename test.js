var express = require('express')
var app = express()

app.use(require('./index')({
  append: function (data, req, res) {
    data.user = {
      name: 'Mike'
    }
  }
}))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/api', function (req, res) {
  res.json(req)
})

app.get('/models', function (req, res) {
  res.json({
    models: [
      {
        id: '58b072516b72030001df3221',
        name: 'Test 1'
      },
      {
        id: '58b0724c6b72030001df321c',
        name: 'Test 2'
      },
      {
        id: '58b072496b72030001df3219',
        name: 'Test 3',
        url: 'https://google.com'
      }
    ]
  }, {
    'models[].id': '/models/%s'
  })
})

app.listen(3000)
