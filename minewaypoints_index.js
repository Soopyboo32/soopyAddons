import mineWayPointsServer from "./minewaypoints_socket";

let locations = {}

let areas = {
    "MinesofDivan": "Mines of Divan",
    "LostPrecursorCity": "Lost Precursor City",
    "JungleTemple": "Jungle Temple",
    "FairyGrotto": "Fairy Grotto",
    "GoblinQueensDen": "Goblin Queen's Den",
    "Khazaddm": "Khazad-dûm",
    "KingYolkar": "§6King Yolkar",
    "BossCorleone": "§cBoss Corleone"
}

mineWayPointsServer.setLocationHandler = function (area, loc) {
    if(!area) return
    if(area == "undefined") return
    locations[area] = loc;
    // console.log(JSON.stringify(loc, undefined, 2))
}

let lastSend = 0

register("worldLoad", () => {
    locations = {}
})

register("tick", () => {
    try {
        if (Scoreboard.getLines().length < 2) return;
        let server = ChatLib.removeFormatting(Scoreboard.getLineByIndex(Scoreboard.getLines().length - 1)).split(" ")

        if (server.length === 2) {
            server = server[1].replace(/[^0-9A-z]/g, "")
        } else {
            return;
        }

        mineWayPointsServer.setServer(server, World.getWorld().func_82737_E())

        if (Date.now() - lastSend > 1000) {
            Scoreboard.getLines().forEach(line => {
                line = ChatLib.removeFormatting(line.getName()).replace(/[^0-9A-z]/g, "")
                if (Object.keys(areas).includes(line)) {
                    mineWayPointsServer.setLocation(line, { x: Math.floor(Player.getX()), y: Math.floor(Player.getY()), z: Math.floor(Player.getZ()) })
                }
            })
            lastSend = Date.now()
        }
    } catch (e) {
        console.log(JSON.stringify(e, undefined, 2))
    }
})

register("step", () => {
    World.getAllEntities().forEach(e => {
        if (Math.max(Math.abs(Player.getX() - e.getX()), Math.abs(Player.getY() - e.getY()), Math.abs(Player.getZ() - e.getZ())) > 20) return;

        if (!locations["KingYolkar"]) {
            if (ChatLib.removeFormatting(e.getName()) === "King Yolkar") {
                mineWayPointsServer.setLocation("KingYolkar", { x: e.getX(), y: e.getY() + 3.5, z: e.getZ() })
            }
        }
        if (ChatLib.removeFormatting(e.getName()).includes("Boss Corleone")) {
            mineWayPointsServer.setLocation("BossCorleone", { x: e.getX(), y: e.getY() + 3.5, z: e.getZ() })
        }
    })
    // console.log(JSON.stringify(locations, undefined, 2))
}).setDelay(5)

register("renderWorld", () => {
    if(!global.soopyAddonsGlobalThing_toggled) return;

    Object.values(locations).forEach(item => {
        if(!item) return;
        item.forEach(loc=>{
            // console.log(JSON.stringify(loc, undefined, 2))
            if (loc.loc.x) {
                Tessellator.drawString(areas[loc.area], loc.loc.x, loc.loc.y, loc.loc.z, 0xFFFFFF, true, 0.5, true)
            } else {
                Tessellator.drawString(areas[loc.area], loc.loc.minX / 2 + loc.loc.maxX / 2, loc.loc.minY / 2 + loc.loc.maxY / 2, loc.loc.minZ / 2 + loc.loc.maxZ / 2, 0xFFFFFF, true, 0.5, true)
            }
        })
    })
})

global.soopyAddonsGlobalThing_toggled = false