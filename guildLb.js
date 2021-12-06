/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
module.exports = {};
let currGuildName = ""
let currGuildData = undefined;
let currGuildMembersSorted = undefined

let gui = new Gui();

let defaultHead = undefined
new Thread(()=>{
    defaultHead = new Image("Soopyboo32", "https://cravatar.eu/helmavatar/dc8c39647b294e03ae9ed13ebd65dd29")
}).start()

gui.registerClicked(guiClickedFunction);
gui.registerMouseDragged(guiDraggedFunction);
gui.registerScrolled(guiScrolledFunction);
gui.registerDraw(guiRenderFunction);

let scrollLast = 0
let scroll = 0
let scrollNext = 0
const GL11 = Java.type("org.lwjgl.opengl.GL11");
let lastLoadedData = 0
let loadingData = false
let scrollingStartY = 0
let currSort = "skill-avg"

function guiClickedFunction(mouseX, mouseY, button) {
    if(button === 0){
        
        let screenWidth = Renderer.screen.getWidth()
        let screenHeight = Renderer.screen.getHeight()
        let topBarX = screenWidth/5
        let topBarY = screenHeight/10+screenHeight/15 + 5
        let topBarHeight = screenHeight/15
        let topBarWidth = screenWidth/5*3

        let locData = [
            {"id":"skill-avg",x:topBarX+(topBarWidth/6.75*3)-5-Renderer.getStringWidth("Avg skill level")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Avg skill level")+10},
            {"id":"total-slayer",x:topBarX+(topBarWidth/7*4)-5-Renderer.getStringWidth("Slayer exp")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Slayer exp")+10},
            {"id":"dungeon",x:topBarX+(topBarWidth/7*5)-5-Renderer.getStringWidth("Catacombs level")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Catacombs level")+10},
            {"id":"gExp",x:topBarX+(topBarWidth/7*6)-5-Renderer.getStringWidth("Guild exp")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Guild exp")+10}
        ]
        locData.forEach((data)=>{
            if(mouseX > data.x && mouseX < data.x+data.width
                && mouseY > data.y && mouseY < data.y+19){
                
                let notLoaded = false
    
                if(currGuildMembersSorted !== undefined){
                    currGuildMembersSorted.forEach((mem)=>{
                        if(!mem.loaded){
                            notLoaded = true
                        }
                    })
                }
                if(notLoaded || currGuildData === null || currGuildData === undefined){
                    return;
                }
                currSort = data.id
                currGuildMembersSorted = currGuildMembersSorted.sort((a,b)=>{return b[currSort]-a[currSort]})
            }
        })
        
        let scrollWidth = 7
        let scrollY = screenHeight/10+screenHeight/15+screenHeight/15+10
        let scrollHeight = screenHeight-scrollY-screenHeight/10
        let scrollX = screenWidth/5+(screenWidth/5*3 -10)+(10-scrollWidth)

        let totalHeight = (screenHeight/15 +2)*(currGuildMembersSorted?.length || 0)
        let scrollPec = (-scroll)/(totalHeight)
        let scrollHeightPec = Math.min(1,(screenHeight-screenHeight/10-(screenHeight/10+screenHeight/15+screenHeight/15+10))/totalHeight)

        let currScrollY = scrollY + scrollPec*scrollHeight+0.01
        let currScrollHeight = scrollHeightPec*scrollHeight+1

        if(mouseX > scrollX && mouseX < scrollX+scrollWidth
            && mouseY > currScrollY && mouseY < currScrollY+currScrollHeight){
            scrollingStartY = mouseY-currScrollY
        }else{
            scrollingStartY = -1
        }
    }
}
function guiDraggedFunction(mouseX, mouseY, button, timeSinceLastClick) {
    if(button !== 0){return}
    
    let screenHeight = Renderer.screen.getHeight()
    
    let scrollY = screenHeight/10+screenHeight/15+screenHeight/15+10
    let scrollHeight = screenHeight-scrollY-screenHeight/10

    let totalHeight = (screenHeight/15 +2)*(currGuildMembersSorted?.length || 0)

    if(timeSinceLastClick > 0){
        if(scrollingStartY === -1){return;}
        let scrollPecNext = ((mouseY-scrollingStartY)-scrollY)/scrollHeight

        scrollNext = totalHeight*(-scrollPecNext)

        let height = (screenHeight/15 +2)*(currGuildMembersSorted.length)
        let lenToBot = (screenHeight-(screenHeight/10)+2)-(screenHeight/10+screenHeight/15+screenHeight/15+10)
        scrollNext = clamp(scrollNext, -(height-lenToBot), 0)
    }
}

function guiScrolledFunction(mouseX, mouseY, direction) {
    if(currGuildMembersSorted !== undefined){
        let screenWidth = Renderer.screen.getWidth()
        let screenHeight = Renderer.screen.getHeight()
        let guiScale = Renderer.screen.getScale()
        scrollNext += direction*50

        let height = (screenHeight/15 +2)*(currGuildMembersSorted.length)
        let lenToBot = (screenHeight-(screenHeight/10)+2)-(screenHeight/10+screenHeight/15+screenHeight/15+10)
        scrollNext = clamp(scrollNext, -(height-lenToBot), 0)
    }
}

function guiRenderFunction(mouseX, mouseY, partialTicks) {
    let currScroll = scrollLast+(scroll-scrollLast)*partialTicks
    let screenWidth = Renderer.screen.getWidth()
    let screenHeight = Renderer.screen.getHeight()
    let guiScale = Renderer.screen.getScale()

    Renderer.drawRect(Renderer.color(0, 0, 0, 75), 0, 0, screenWidth, screenHeight);

    scizzor(screenWidth/3, screenHeight/10, screenWidth/3, screenHeight/15)
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), screenWidth/3, screenHeight/10, screenWidth/3, screenHeight/15);
    if(currGuildData !== null && currGuildData !== undefined){
        drawStringCentered(currGuildData.data?.name || currGuildName, screenWidth/2, screenHeight/10+screenHeight/30,2)
    }else{
        drawStringCentered("Loading...", screenWidth/2, screenHeight/10+screenHeight/30,2)
    }

    let topBarX = screenWidth/5
    let topBarY = screenHeight/10+screenHeight/15 + 5
    let topBarHeight = screenHeight/15
    let topBarWidth = screenWidth/5*3

    if(currGuildMembersSorted == undefined){
        if(currGuildData === undefined || currGuildData === null || currGuildData.data === undefined){
            stopScizzor()
            return;
        }
    }

    scizzor( topBarX, topBarY, topBarWidth, topBarHeight)
    Renderer.drawRect(Renderer.color(0, 0, 0, 100), topBarX, topBarY, topBarWidth, topBarHeight);
    if((currGuildData.data?.loadedAmount || 0) !== (currGuildData.data?.guildMembers || 0)){

        drawStringCentered((currGuildData.data?.loadedAmount || 0) + "/" + (currGuildData.data?.guildMembers || 0) + " eta: " + Math.max(Math.ceil(((currGuildData.data?.loadedEta || 0)-Date.now())/1000),-1000000000000000) + "s", topBarX+(topBarWidth/2), topBarY+topBarHeight/2, 1.5)

        stopScizzor()
        return;
    }
    if(currGuildData !== null && currGuildData !== undefined){
        if(!currGuildData.success){
            drawStringCentered("Error: " + currGuildData.reason, topBarX+(topBarWidth/2), topBarY+topBarHeight/2, 1.5)

            stopScizzor()
            return;
        }
    }

    let hoveded = ""
    let locData = [
        {"id":"skill-avg",x:topBarX+(topBarWidth/6.75*3)-5-Renderer.getStringWidth("Avg skill level")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Avg skill level")+10},
        {"id":"total-slayer",x:topBarX+(topBarWidth/7*4)-5-Renderer.getStringWidth("Slayer exp")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Slayer exp")+10},
        {"id":"dungeon",x:topBarX+(topBarWidth/7*5)-5-Renderer.getStringWidth("Catacombs level")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Catacombs level")+10},
        {"id":"gExp",x:topBarX+(topBarWidth/7*6)-5-Renderer.getStringWidth("Guild exp")/2,y:topBarY+topBarHeight/2-5-(9/2),width: Renderer.getStringWidth("Guild exp")+10}
    ]
    locData.forEach((data)=>{
        if(mouseX > data.x && mouseX < data.x+data.width
            && mouseY > data.y && mouseY < data.y+19){

            if(currGuildData.data.loadedAmount !== currGuildData.data.guildMembers || currGuildData === null || currGuildData === undefined){
                return;
            }
            hoveded = data.id
        }
    })

    drawStringCentered("Name", topBarX+(topBarWidth/6), topBarY+topBarHeight/2, 1.5)
    drawStringCentered("Pos", topBarX+(topBarWidth/6*2), topBarY+topBarHeight/2, 1.25)
    drawStringCentered((currSort==="skill-avg"?"&d":"") + "Avg skill level", topBarX+(topBarWidth/6.75*3), topBarY+topBarHeight/2, hoveded==="skill-avg"?1.25:1)
    drawStringCentered((currSort==="total-slayer"?"&d":"") + "Slayer exp", topBarX+(topBarWidth/7*4), topBarY+topBarHeight/2,hoveded==="total-slayer"?1.25:1)
    drawStringCentered((currSort==="dungeon"?"&d":"") + "Catacombs level", topBarX+(topBarWidth/7*5), topBarY+topBarHeight/2, hoveded==="dungeon"?1.25:1)
    drawStringCentered((currSort==="gExp"?"&d":"") + "Guild exp", topBarX+(topBarWidth/7*6), topBarY+topBarHeight/2, hoveded==="gExp"?1.25:1)
    

    let scrollWidth = 7
    let scrollY = screenHeight/10+screenHeight/15+screenHeight/15+10
    let scrollHeight = screenHeight-scrollY-screenHeight/10
    let scrollX = screenWidth/5+(screenWidth/5*3 -10)+(10-scrollWidth)

    let totalHeight = (screenHeight/15 +2)*(currGuildMembersSorted?.length || 0)
    let scrollPec = (-scroll)/(totalHeight)
    let scrollHeightPec = Math.min(1,(screenHeight-screenHeight/10-(screenHeight/10+screenHeight/15+screenHeight/15+10))/totalHeight)

    let currScrollY = scrollY + scrollPec*scrollHeight+0.01
    let currScrollHeight = scrollHeightPec*scrollHeight+1

    let bottom = scrollY+scrollHeight

    if(currGuildMembersSorted !== undefined){
        currGuildMembersSorted.forEach((mem, index)=>{

            let x = screenWidth/5
            let y = screenHeight/10+screenHeight/15+screenHeight/15+10+((screenHeight/15 +2)*index) +currScroll
            let width =  screenWidth/5*3 -10
            let height = screenHeight/15

            if(y>bottom || y+height < topBarY){
                return;
            }


            scizzor(x, Math.max(y,topBarY+topBarHeight+5), width, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            Renderer.drawRect(Renderer.color(0, 0, 0, 100), x, y, width, height);

            if(mem.head !== undefined){
                mem.head.draw(x + 2, y +2 , height-4,height-4)
            }

            scizzor(x+height, Math.max(y,topBarY+topBarHeight+5), (topBarX+(topBarWidth/6*2))-(x+height)-height/2, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically(((mem.uuid === Player.getUUID().toString().replace(/-/g,"")) ? "&d" : "") + mem.name, x+height+4, y+height/2, 1.5)

            scizzor((topBarX+(topBarWidth/6*2))-height/2+2, Math.max(y,topBarY+topBarHeight+5), height, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically("#" + (index+1), (topBarX+(topBarWidth/6*2))-height/2+2, y+height/2, 1.5)

            scizzor((topBarX+(topBarWidth/7*3))-height/2+2, Math.max(y,topBarY+topBarHeight+5), height*2, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically(mem["skill-avg"]?.toFixed(2), (topBarX+(topBarWidth/7*3))-height/2+2, y+height/2, 1.5)

            scizzor((topBarX+(topBarWidth/7*4))-height/2+2, Math.max(y,topBarY+topBarHeight+5), height*2, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically(addNotation("oneLetters",mem["total-slayer"]), (topBarX+(topBarWidth/7*4))-height/2+2, y+height/2, 1.5)

            scizzor((topBarX+(topBarWidth/7*5))-height/2+2, Math.max(y,topBarY+topBarHeight+5), height*2, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically(mem["dungeon"]?.toFixed(2), (topBarX+(topBarWidth/7*5))-height/2+2, y+height/2, 1.5)

            scizzor((topBarX+(topBarWidth/7*6))-height/2+2, Math.max(y,topBarY+topBarHeight+5), height*2, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
            drawStringCenteredVertically(addNotation("oneLetters",mem["gExp"]), (topBarX+(topBarWidth/7*6))-height/2+2, y+height/2, 1.5)
            scizzor(x, Math.max(y,topBarY+topBarHeight+5), width, Math.min(height,bottom-Math.max(y,topBarY+topBarHeight+5)))
        })
    }
    stopScizzor()
    
    Renderer.drawRect(Renderer.color(0, 0, 0, 75), scrollX, scrollY, scrollWidth, scrollHeight);
    Renderer.drawRect(Renderer.color(0, 0, 0, 75), scrollX, currScrollY, scrollWidth, currScrollHeight);

    if(hoveded !== ""){
        let idToName = {
            "skill-avg": "skill level",
            "total-slayer": "slayer exp",
            "dungeon": "catacombs level",
            "gExp": "guild exp"
        }

        let avg = 0
        currGuildMembersSorted.forEach((mem)=>{
            avg += mem[hoveded]/currGuildMembersSorted.length
        })

        if(hoveded === "total-slayer" || hoveded === "gExp"){
            avg = addNotation("oneLetters",avg)
        }else{
            avg = avg.toFixed(2)
        }

        scizzor(mouseX+10,mouseY-10,Math.max(Renderer.getStringWidth("Average " + idToName[hoveded] + ": "),Renderer.getStringWidth(avg))*2+10,(18+10+12))
        Renderer.drawRect(Renderer.color(0, 0, 0, 150), mouseX+10,mouseY-10,Math.max(Renderer.getStringWidth("Average " + idToName[hoveded] + ": "),Renderer.getStringWidth(avg))*2,(18+10+12));
        drawStringCenteredVertically("Average " + idToName[hoveded] + ": ", mouseX+10+5,mouseY-5+9,2)
        drawStringCenteredVertically(avg, mouseX+10+5,mouseY-5+(18+9),2)
        
        stopScizzor()
    }
}

function drawString(text, x, y, scale){
    Renderer.scale(scale, scale)
    Renderer.drawString(text || "undefined", x/scale, y/scale)
    Renderer.scale(1, 1)
}
function drawStringCentered(text, x, y, scale){
    drawString(text, x-((Renderer.getStringWidth(text)/2)*scale), y-((9*scale)/2),scale)
}
function drawStringCenteredVertically(text, x, y, scale){
    drawString(text, x, y-((9*scale)/2),scale)
}
function scizzor(x, y, width, height){
    let guiScale = Renderer.screen.getScale()
    let screenHeight = Renderer.screen.getHeight()
    GL11.glEnable(GL11.GL_SCISSOR_TEST);
    GL11.glScissor(x*guiScale, screenHeight*guiScale-(y*guiScale)-(height*guiScale), width*guiScale, height*guiScale)
}
function stopScizzor(){
    GL11.glDisable(GL11.GL_SCISSOR_TEST);
}

function clamp(val, min, max){
    return Math.min(Math.max(val,min),max)
}

register("tick",()=>{
    if(!gui.isOpen()){return;}
    let notLoaded = (currGuildData?.data?.loadedAmount || 0) !== (currGuildData?.data?.guildMembers || 0)
    if((currGuildName !== "" && (currGuildData === undefined || currGuildData.data === undefined) || notLoaded) && Date.now()-lastLoadedData > 5000 && !loadingData){
        loadData()
    }

    scrollLast = scroll
    scroll += (scrollNext-scroll)/10

})

function loadData(){
    loadingData = true

    lastLoadedData = Date.now()

    new Thread(()=>{
        try{
            currGuildData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/guildData.json?key=lkRFxoMYwrkgovPRn2zt&guildName=" + currGuildName.replace(/ /gi, "%20").toLowerCase()))
        }catch(e){
            console.log("error loading guild lb:")
            console.log(JSON.parse(e))

            loadingData = false

            return;
        }

        currGuildMembersSorted = []
        if(!currGuildData.success){return;}
        currGuildData.data.members.sort((a,b)=>{return b[currSort]-a[currSort]}).forEach((mem)=>{
            let data = {
                name: mem.name,
                uuid: mem.uuid,
                "skill-avg": mem["skill-avg"],
                "total-slayer": mem["total-slayer"],
                dungeon: mem.dungeon,
                gExp: mem.gExp,
                guildRank: mem.guildRank,
                loaded: mem.loaded,
                head: undefined
            }

            if(mem.name !== undefined){
                data.name = mem.name.substr(0,1) + "⭍" + mem.name.substr(1)
            }

            currGuildMembersSorted.push(data)
        })

        // if(currGuildData.data.loadedAmount === currGuildData.data.guildMembers){
        //     currGuildMembersSorted.map((a)=>{
                

        //         if(a.loaded){
        //             a.head = new Image(a.name, "https://cravatar.eu/helmavatar/" + a.uuid)
        //         }else{
        //             a.head = defaultHead
        //         }

        //         return a
        //     })
        // }
        loadingData = false
    }).start()
}

class GuildGuiManager{
    constructor (){

    }
    open(guild){
        if(guild === undefined){
            currGuildName = "Skyblock Gods"
            currGuildData = undefined;
        }else{
            currGuildName = guild
            currGuildData = undefined;
        }

        scroll = 0
        scrollNext = 0

        currGuildMembersSorted = undefined
        currSort = "skill-avg"

        gui.open()
        loadData()
    }
}

guildGuiManager = new GuildGuiManager()

export default guildGuiManager

function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === "shortScale") {
        //notation type
        //do notation stuff here
        notList = [
            " Thousand",
            " Million",
            " Billion",
            " Trillion",
            " Quadrillion",
            " Quintillion"
        ];
    }

    if (type === "oneLetters") {
        notList = [" K", " M", " B", " T"];
    }

    let checkNum = 1000;

    if (type !== "none" && type !== "commas") {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift();
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100);
                    returnVal = Math.floor(returnVal);
                    returnVal = (returnVal / Math.pow(10, o)) * 10;
                    returnVal = +returnVal.toFixed(o - 1) + notValue;
                }
                checkNum *= 10;
            }
        }
    } else {
        returnVal = numberWithCommas(value.toFixed(0));
    }

    return returnVal;
}

function numberWithCommas(x) {
    if (x === undefined) { return "" }
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}