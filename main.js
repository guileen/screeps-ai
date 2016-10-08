const temp = require('temp')
const mem = require('mem')
const creepAI = require('ai.creep')
const spawnAI = require('ai.spawn')

module.exports.loop = function() {
    mem.gc()
    spawnAI.update(Game.spawns['Home'])
    // 获得creep
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepAI.update(creep)
    }
    
    if (temp.update) {
        temp.update()
    }
}