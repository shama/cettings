var createGame = require('voxel-engine')

var game = createGame({
  chunkDistance: 3,
  generate: function(x, y, z) {
    return (Math.sqrt(x*x + y*y + z*z) > 20 || y*y > 10) ? 0 : (Math.random() * 3) + 1;
  },
  materialFlatColor: true,
  materials: ['#00ff00', '#ff0000', '#0000ff'],
  texturePath: 'textures/'
})
game.paused = false
var container = document.body
game.appendTo(container)

// create a player
var createPlayer = require('voxel-player')(game)
var player = createPlayer('textures/shama.png')
player.yaw.position.set(0, 20, 0)
player.possess()

var settings = require('./')(require('voxel-settings')(game))
container.appendChild(settings.html())
settings.on('set', function(key, val) {
  console.log(key, val)
})
