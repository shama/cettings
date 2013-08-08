var vkey = require('vkey')
var inherits = require('inherits')
var EE = require('events').EventEmitter
var ns = require('./namespace')

function Settings(cfg, opts) {
  var self = this
  EE.call(self)
  opts = opts || {}
  this.config = cfg

  this.binding = false

  this.container = document.createElement('div')
  this.list = document.createElement('ul')
  this.container.appendChild(this.list)
  this.container.className = 'settings'
}
module.exports = function(cfg) {
  return new Settings(cfg)
}
module.exports.Settings = Settings
inherits(Settings, EE)

Settings.prototype.html = function() {
  var self = this
  Object.keys(this.config).forEach(function(label) {
    var cfg = self.config[label]
    var li = document.createElement('li')
    var b = document.createElement('h3')
    b.innerHTML = cfg.label || label
    li.appendChild(b)
    var ul = document.createElement('ul')
    li.appendChild(ul)
    self.item(ul, cfg, label)
    self.list.appendChild(li)
  })
  return this.container
}

Settings.prototype.item = function(ul, cfg, key) {
  var self = this
  Object.keys(cfg).forEach(function(k) {
    var li = document.createElement('li')
    var data = cfg[k]
    var input = document.createElement('input')
    input.value = data.value
    input.id = key + '.' + k
    if (data.type === 'bindkey') self.bindkey(input, data)
    else self.bindtext(input, data)
    var label = document.createElement('label')
    label.innerHTML = data.label || k
    label.setAttribute('for', key + '.' + k)
    li.appendChild(label)
    li.appendChild(input)
    ul.appendChild(li)
  })
}

Settings.prototype.set = function(target, meta) {
  var val = target.value
  if (typeof meta.on === 'function') {
    var res = meta.on(target.id, target.value)
    if (res !== null) val = res
  }
  ns.set(this.config, target.id + '.value', val)
  this.emit('set', target.id, val)
}

Settings.prototype.bindtext = function(input, meta) {
  var self = this
  input.onblur = function(e) {
    self.set(e.target, meta)
  }
  input.onchange = function(e) {
    self.set(e.target, meta)
  }
}

Settings.prototype.bindkey = function(input, meta) {
  var self = this
  var lastBind = null
  var lastTarget = null
  var onbindkey = function(e, keyCode) {
    var target = lastTarget
    target.value = keyCode
    self.set(target, meta)
    target.setAttribute('placeholder', '')
    lastBind = null
    self.binding = false
    target.blur()
    document.body.removeEventListener('keydown', onkeydown, false)
    document.body.removeEventListener('mousedown', onmousedown, false)
  }
  var onkeydown = function(e) {
    e.preventDefault()
    onbindkey(e, vkey[e.keyCode])
    return false
  }
  var onmousedown = function(e) {
    e.preventDefault()
    onbindkey(e, '<mouse ' + e.which + '>')
    return false
  }
  input.onfocus = function(e) {
    var target = e.target
    self.binding = true
    lastBind = target.value
    lastTarget = target
    target.value = ''
    target.setAttribute('placeholder', 'Press key to bind...')
    document.body.addEventListener('keydown', onkeydown, false)
    document.body.addEventListener('mousedown', onmousedown, false)
  }
  input.onblur = function(e) {
    if (lastBind !== null && e.target.value === '') {
      lastTarget.value = lastBind
      lastBind = null
      lastTarget = null
    }
  }
}
