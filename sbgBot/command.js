/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
module.exports = {};

let commandQueue = { dm: [], other: [] }
let lastTime = 0
let dm = false

register("tick", () => {
    if (commandQueue.dm.length + commandQueue.other.length > 0) {
        if (new Date().getTime() - lastTime > 750 / 2) {
            lastTime = new Date().getTime()

            if (dm) {
                if (commandQueue.dm.length) {
                    ChatLib.say(commandQueue.dm.shift())
                }
            } else {
                if (commandQueue.other.length) {
                    ChatLib.say(commandQueue.other.shift())
                }
            }
            dm = !dm
        }
    }
})

export default commandQueue;