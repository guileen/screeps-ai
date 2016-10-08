var util = require('util')
var roomAI = require('ai.room')

module.exports = {
    update: update
};

function update(spawn) {
    roomAI.update(spawn.room);
    spawn.spawning ||
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE], 'harv', 3) || 
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE], 'upgrader', 1) || 
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE], 'builder', 1) || 
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE], 'harv', 6) || 
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE], 'upgrader', 3) || 
    spawnRoleNeed(spawn, [WORK, WORK, WORK, CARRY, MOVE, MOVE
    ], 'builder', 3
    )
}

function findRole(role) {
    return util.filter(Game.creeps, c=>(c.memory.role == role))
}

// 孵化至少某个角色一定数量，需要孵化则返回true
function spawnRoleNeed(spawn, body, role, need) {
    // 如果当前数量小于需要的数量
    var len = findRole(role).length
    console.log("role:", role, len)
    if (len < need) {
        console.log("机器人", role, "不足，当前：", len, "需要:", need)
        // 召唤新的机器人
        var err = spawn.createCreep(body, undefined, {role: role})
        if (err == ERR_NOT_ENOUGH_ENERGY) {
            spawn.memory.state = 'low energy';
            console.log('Spawn Not Enough Energy')
        } else if (err != 0) {
            console.log("Spawn Error:", err)
        }
        return true
    }
}