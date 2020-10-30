//use in like chrome console or something
//requires changeLog (found in updateDetecter.js)

var res = []
var res1 = ""
versionData.changeLog.forEach((change) => {
    res1 += "**" + change.version + "**"
    if (res1.length > 1000) {
        res.push(res1)
        res1 = ""
    }
    res1 += "\n"
    if (change.changeLog !== undefined) {
        res1 += "```diff\n"
        if (change.changeLog.length == 0) {
            res1 += "*** There appears to be no change noted in the changelogs here." + "\n"
        } else {
            change.changeLog.forEach((text) => {
                res1 += text + "\n"
            })
        }
        res1 += "```\n\n"
    }
})
res.push(res1)
res1 = ""