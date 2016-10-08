var util = require('util')

// 机器人的AI
module.exports = {
    // 执行 AI
    update: update,
    // 让机器人去采集
    // tools.harvest(creep)
    harvest: harvest,
    // 送回资源
    transfer: transfer,
    // 升级控制器 tools.upgradeController(creep)
    upgradeController: upgradeController
};

// 机器人AI的主程序
function update(creep) {
    // 更新工作状态
    creep.memory.state = updateState(creep)
    // 执行工作状态
    // 如果工作状态为 采集
    if (creep.memory.state  == 'harvest') {
        harvest(creep)
    // 如果工作状态为 建造
    } else if(creep.memory.state == 'building') {
        build(creep)
    // 如果工作状态为 升级控制器
    } else if(creep.memory.state == 'upgradeController') {
        upgradeController(creep)
    // 如果工作状态为 填充
    } else if(creep.memory.state == 'transfer') {
        // 填满缺少能量的建筑
        var lowEnergyTargets = util.findLowEnergy(creep.room)
        if (!lowEnergyTargets.length) {
            upgradeController(creep)
        } else {
            transfer(creep, lowEnergyTargets[0])
        }
    // 默认采集
    } else {
        harvest(creep)
    }
}

function updateState(creep) {
    // 如果没能量
    if (creep.carry.energy == 0 && creep.memory.state != 'harvest') {
        // 寻找资源
        var sources = creep.room.find(FIND_SOURCES)
        creep.memory.source = util.findNextSourceId(creep.room)
        creep.say('采集')
        return 'harvest'
    }
    if (creep.carry.energy == creep.carryCapacity) {
        if (creep.memory.role == 'upgrader') {
            if (creep.memory.state != 'upgradeController') {
                creep.say('升级控制器')
            }
            return 'upgradeController'
        }
        
        // 填满缺少能量的建筑
        var lowEnergyTargets = util.findLowEnergy(creep.room)
        if (creep.memory.role == 'harv' && lowEnergyTargets.length) {
            return 'transfer'
        }
        
        creep.say('clear source')
        creep.memory.source = undefined
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
        if (targets.length) {
            creep.memory.target = targets[0].id
            creep.say('建造')
            return 'building'
        }
        
        console.log('low energy', targets)
        if (lowEnergyTargets.length) {
            if (creep.memory.state != 'transfer') {
                creep.say('充能!')
                return 'transfer'
            }
        } else if (creep.memory.state != 'upgradeController') {
            creep.say('升级控制器')
            return 'upgradeController'
        }
    }
    return creep.memory.state
}

function harvest(creep, source) {
        // 如果装满了能量
    if (creep.carry.energy == creep.carryCapacity) {
        transfer(creep)
    } else {
        if (!creep.memory.sourceId) {
            creep.memory.sourceId = util.findNextSourceId(creep.room)
        }
        if (!source && creep.memory.sourceId) {
            source = Game.getObjectById(creep.memory.sourceId)
        }
        if (!source) {
            source = util.findNextSource(creep.room)
        }
        // 采集资源
        var err = creep.harvest(source)
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }
}

function build(creep, target) {
    if (!creep.memory.target) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
        if (targets.length) {
            creep.memory.target = targets[0].id
        }
    }
    if (!target && creep.memory.target) {
        target = Game.getObjectById(creep.memory.target)
    }
    var err = creep.build(target)
    if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    } else if (err == ERR_INVALID_TARGET) {
        console.log("Build Error", err)
        creep.memory.target = undefined;
    } else if (err) {
        console.log("Build Error", err)
    }
}

function transfer(creep, target) {
    var err = creep.transfer(target, RESOURCE_ENERGY) 
    // 送回来
    if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    } else if (err) {
        console.log("Transfer Error", err)
    }
}

function upgradeController(creep) {
    var controller = creep.room.controller
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller)
    }
}