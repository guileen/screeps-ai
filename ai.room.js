module.exports = {
    update: update
};

function update(room) {
    // 如果房间不是安全模式
    if (!room.controller.safeMode) {
        // 自动开启安全模式
        room.controller.activateSafeMode()
    }
}