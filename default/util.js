module.exports = {
    length: function (obj) {
        var l = 0
        for (var name in obj) {
            l ++
        }
        return l
    },
    allSayRole: allSayRole,
    filter: filter,
    findLowEnergy: findLowEnergy,
    findNextSourceId: findNextSourceId,
    findNextSource: findNextSource
};

function filter(obj, fn) {
    var result = []
    for (var name in obj) {
        var v = obj[name]
        if (fn(v)) {
            result.push(v)
        }
    }
    return result
}

function findLowEnergy(room) {
    return room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.energyCapacity && structure.energy < structure.energyCapacity
        }
    })
}
function findNextSource(room) {
    var sourceId = findNextSourceId(room)
    if (sourceId) {
        return Game.getObjectById(sourceId)
    }
}

function findNextSourceId(room) {
    if (!room.memory.sourcesIds) {
        var sources = room.find(FIND_SOURCES)
        room.memory.sourcesIds = sources.map(src => src.id)
    }
    if (room.memory.sourceIndex === undefined) {
        room.memory.sourceIndex = 0
    }
    if (!room.memory.sourcesIds.length) {
        return
    }
    room.memory.sourceIndex ++
    if (room.memory.sourceIndex >= room.memory.sourcesIds.length) {
        room.memory.sourceIndex = 0
    }
    return room.memory.sourcesIds[room.memory.sourceIndex]
}

function allSayRole() {
    for (var name in Game.creeps) {
        sayRole(Game.creeps[name])
    }
}

function sayRole(creep) {
    creep.say("" + creep.memory.role + " - " + creep.memory.state)
}