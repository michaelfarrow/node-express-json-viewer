var pug = require('pug')
var util = require('util')
var path = require('path')
var _ = require('lodash')
var isUrl = require('is-url')

var template = pug.compileFile(path.resolve(__dirname, 'templates/views/json.pug'))
var truthy = ['true', '1']

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

var Viewer = function (req, res, options) {
  this.req = req
  this.res = res
  this.append = options.append || _.noop
}

Viewer.prototype.render = function (data, paths) {
  data = data || {}
  paths = paths || {}

  data = sanitize(data)
  this.append(data, this.req, this.res)

  var json = false
  var qJson = truthy.indexOf((_.get(this.req, 'query.json') || '').toLowerCase().trim()) !== -1
  var headerJson = _.get(this.req, 'headers.accept') === 'application/json'
  if (qJson || headerJson) json = true

  if (json) return this.res._json(data)

  this.res.send(template({
    paths: paths,
    util: util,
    _: _,
    isUrl: isUrl,
    data: data
  }))
}

module.exports = function (options) {
  return function (req, res, next) {
    var jsonViewer = new Viewer(req, res, options || {})
    res._json = res.json
    res.json = function () {
      jsonViewer.render.apply(jsonViewer, arguments)
    }
    next()
  }
}
