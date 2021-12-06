
class GrindDataPoint {
    constructor() {
        let slayer = {
            rev: 0,
            tara: 0,
            sven: 0
        }

        let skillExp = {
            "combat": 0,
            "mining": 0,
            "alchemy": 0,
            "farming": 0,
            "taming": 0,
            "enchanting": 0,
            "fishing": 0,
            "foraging": 0,
            "runecrafting": 0,
            "carpentry": 0
        }

        let timestamp = 0
    }

    setData(slayer, skill) {
        this.slayer = slayer
        this.skill = skill
        this.timestamp = new Date().getTime()
    }

    progressSince(pastDataPoint) {
        let ret = {
            slayerbottom: {
                rev: this.slayer.rev - pastDataPoint.slayer.rev,
                tara: this.slayer.rev - pastDataPoint.slayer.tara,
                sven: this.slayer.rev - pastDataPoint.slayer.sven
            },
            skillExp: {
                "combat": this.skillExp.rev - pastDataPoint.skillExp.combat,
                "mining": this.skillExp.rev - pastDataPoint.skillExp.mining,
                "alchemy": this.skillExp.rev - pastDataPoint.skillExp.alchemy,
                "farming": this.skillExp.rev - pastDataPoint.skillExp.farming,
                "taming": this.skillExp.rev - pastDataPoint.skillExp.taming,
                "enchanting": this.skillExp.rev - pastDataPoint.skillExp.enchanting,
                "fishing": this.skillExp.rev - pastDataPoint.skillExp.fishing,
                "foraging": this.skillExp.rev - pastDataPoint.skillExp.foraging,
                "runecrafting": this.skillExp.rev - pastDataPoint.skillExp.runecrafting,
                "carpentry": this.skillExp.rev - pastDataPoint.skillExp.carpentry
            },
            time: this.timestamp - pastDataPoint.timestamp
        }

        return ret;
    }

    addData(slayer, skill) {

    }
}

class GrindData {
    constructor() {
        let dataPoints = []
    }

    newDataPoint() {
        this.dataPoints.shift()
        this.dataPoints.push(this._createNewDataPoint())
    }

    _createNewDataPoint() {
        let ret = new DataPoint()

        let slayer = {
            rev: 0,
            tara: 0,
            sven: 0
        }

        let skillExp = {
            "combat": 0,
            "mining": 0,
            "alchemy": 0,
            "farming": 0,
            "taming": 0,
            "enchanting": 0,
            "fishing": 0,
            "foraging": 0,
            "runecrafting": 0,
            "carpentry": 0
        }

        ret.setData(slayer, skillExp)

        return ret;
    }
}

class GrindDisplay {
    constructor() {
        this.dataStore = new GrindData()
        this.currentData = new GrindDataPoint()

        let slayer = {
            rev: 0,
            tara: 0,
            sven: 0
        }

        let skillExp = {
            "combat": 0,
            "mining": 0,
            "alchemy": 0,
            "farming": 0,
            "taming": 0,
            "enchanting": 0,
            "fishing": 0,
            "foraging": 0,
            "runecrafting": 0,
            "carpentry": 0
        }
        this.currentData.setData(slayer, skillExp)
    }

    getDataStore() {
        return this.dataStore
    }

    render(x, y) {
        //Renderer.drawString(this.currentData.slayer.rev, x, y);
    }
}

let render = new GrindDisplay()

let lastTime = 0
register("tick", () => {
    if (new Date().getTime() - lastTime > 10 * 60000) { // every 10 mins (10 because api limit)
        lastTime = new Date().getTime()

        //render.getDataStore().newDataPoint()
    }
})

export default render;