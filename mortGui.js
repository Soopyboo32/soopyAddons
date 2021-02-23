/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
//                                                   DOES NOT SUPPORT NEU CALLENDER, (also buggy with neu itempane)
const GL11 = Java.type("org.lwjgl.opengl.GL11");

let isMortGui = false
let mortNameReplace = {}
let scale = 1
let playerSecretsCache = {
    
}
register("guiRender",(x,y,gui)=>{
    if(!mortGui.getEnabled()) return;
    if(Client.currentGui.getClassName() !== "GuiEditSign"){
        if(playerIsInMortGui()){
            //stop rendering everything
            GL11.glEnable(GL11.GL_SCISSOR_TEST)
            GL11.glScissor(0,0,0,0)
            
            isMortGui = true
        }
    }
})
register("postGuiRender",(guiScreen, x,y)=>{
    if(isMortGui){
        //re enable rendering
        GL11.glDisable(GL11.GL_SCISSOR_TEST)


        //Renderer.drawRect(Renderer.color(150,150,150,150),Renderer.screen.getWidth()/2-Renderer.getStringWidth(Player.getOpenedInventory().getName())/2*3,40,Renderer.getStringWidth(Player.getOpenedInventory().getName())*3,20)
        
        drawStringCentered(mortNameReplace[Player.getOpenedInventory().getName()],Renderer.screen.getWidth()/2,50*scale,3*scale)

        //aim for width 1920 and height 1080
        let currWidth = Renderer.screen.getWidth()
        let currHeight = Renderer.screen.getWidth()

        let widthChangeVal = (1920)/currWidth
        let heightChangeVal = (1080)/currHeight

        scale = 1/Math.min(widthChangeVal,heightChangeVal)

        renderMortGui(guiScreen, x, y)
        isMortGui = false
    }
})

let lastCustomNames = []
let lastPageName = ""
let lastClickTime = 0
register("chat",()=>{
    lastCustomNames = []
}).setChatCriteria("&r&aRefreshing...&r")

function renderMortGui(guiScreen, mouseX, mouseY){
    if(lastPageName !== Player.getOpenedInventory().getName()){
        lastPageName = Player.getOpenedInventory().getName()
        lastCustomNames = []
    }

    function renderLeftHandButtons(itemLocations, itemNames){

        if(Player.getOpenedInventory().getName() === "Select Type" && Player.getOpenedInventory().getStackInSlot(12).getName() === " "){
            itemLocations = [13]
            itemNames = ["&cThe Catacombs"]
        }

        if(Player.getOpenedInventory().getName() === "Select Floor" && Player.getOpenedInventory().getStackInSlot(22).getName() === " "){
            itemLocations =itemLocations.filter((b)=>{return b!== 22})
            itemNames.shift()
        }

        if(itemNames === "custom_dungeon_classes"){
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                    item.getLore().forEach((line)=>{
                        if(ChatLib.removeFormatting(line) === "SELECTED"){
                            itemNames[index] += " &e(SELECTED)"
                        }
                    })
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }

        let customItemNameDungeonStats = false
        if(itemNames === "custom_dungeon_stats"){
            customItemNameDungeonStats = true
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }
        let customItemNameDungeonParties = false
        if(itemNames === "custom_dungeon_parties"){
            customItemNameDungeonParties = true
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                    item.getLore().forEach((line)=>{
                        if(ChatLib.removeFormatting(line).startsWith("Note: ")){
                            itemNames[index] += "\n&e(" + ChatLib.removeFormatting(line).substr(6) + ")"
                        }
                    })
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }

        let renderX = 75
        let height = 30
        let longestItemName = 0
        itemNames.forEach((b)=>{
            if(b === undefined) return;
            b.split("\n").forEach((a)=>{
                let l = Renderer.getStringWidth(ChatLib.removeFormatting(a))
                if(l > longestItemName){
                    longestItemName= l
                }
            })
        })
        let width = longestItemName*2+height

        if(customItemNameDungeonParties){
            width = longestItemName+height
        }

        let blankThings = 0

        itemLocations.forEach((slot, index)=>{
            let notNum = false
            if(typeof(slot) !== "number"){
                notNum = true
            }
            let item = undefined
            if(!notNum){
                item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
            }   
            let renderY = 75+(index-blankThings)*50
            if(index === 5 && customItemNameDungeonStats){
                renderX += width + height/2
            }
            if(index >= 5 && customItemNameDungeonStats){
                renderY -= 5*50
            }
            if(index % 8 === 0 && index > 1){
                renderX += width + height/2
            }
            if(index >= 8){
                renderY -= (8*50)*(Math.floor(index/8))
            }
            if(!notNum){
                if((item.getName() === " ")) {
                    blankThings++
                    return
                }
            }

            if(itemNames[index] === undefined) return;

            let background = new Rectangle(notNum?Renderer.color(150,150,150):Renderer.color(item.getID() === -1?125 : 150,item.getID() === -1?125 : 150,item.getID() === -1?125 : 150),renderX*scale,renderY*scale,width*scale,height*scale)
            background.setOutline(true)
            background.setOutlineColor(Renderer.color(100,100,100))
            background.setThickness(3*scale)
            background.draw()
            
            drawStringCenteredVertically(itemNames[index] ,(renderX+height/2)*scale,(renderY+height/2-(customItemNameDungeonParties?height/8:0))*scale,(customItemNameDungeonParties?1:2)*scale)
        
            if(!notNum){
                if(mouseX > renderX*scale && mouseX < (renderX+width)*scale
                    && mouseY > renderY*scale && mouseY < (renderY+height)*scale && item.getID() !== -1){

                    let lore = []
                    item.getLore().forEach((a)=>{lore.push(a)})

                    guiScreen.func_146283_a(lore, mouseX,mouseY) 
                }
            }
        })
    }
    function renderRightHandButtons(itemLocations, itemNames){

        if(Player.getOpenedInventory().getName() === "Select Type" && Player.getOpenedInventory().getStackInSlot(12).getName() === " "){
            itemLocations = [31]
            itemNames = ["&cGo Back"]
        }

        if(Player.getOpenedInventory().getName() === "Select Floor" && Player.getOpenedInventory().getStackInSlot(22).getName() === " "){
            itemLocations = [49]
            itemNames = ["&cGo Back"]
        }

        let height = 30
        let longestItemName = 0
        itemNames.forEach((a)=>{
            let l = Renderer.getStringWidth(ChatLib.removeFormatting(a))
            if(l > longestItemName){
                longestItemName= l
            }
        })
        let width = longestItemName*2+height
        let renderX = (Renderer.screen.getWidth()*(1/scale))-width-75

        let blankThings = 0

        itemLocations.forEach((slot, index)=>{
            let item = Player.getOpenedInventory().getStackInSlot(slot)
            if(item === null) return;
            let renderY = 75+(index-blankThings)*50
            if((item.getName() === " ")) {
                blankThings++
                return
            }

            let background = new Rectangle(Renderer.color(item.getID() === -1?125 : 150,item.getID() === -1?125 : 150,item.getID() === -1?125 : 150),renderX*scale,renderY*scale,width*scale,height*scale)
            background.setOutline(true)
            background.setOutlineColor(Renderer.color(100,100,100))
            background.setThickness(3*scale)
            background.draw()
            
            drawStringCenteredVertically(itemNames[index] ,(renderX+height/2)*scale,(renderY+height/2)*scale,2*scale)
        
            if(mouseX > renderX*scale && mouseX < (renderX+width)*scale
                && mouseY > renderY*scale && mouseY < (renderY+height)*scale && item.getID() !== -1){

                    let lore = []
                    item.getLore().forEach((a)=>{lore.push(a)})

                    guiScreen.func_146283_a(lore, mouseX,mouseY) 
                }
        })
    }

    let data = getMortButtonsFromName(Player.getOpenedInventory().getName())
    renderLeftHandButtons(...data.left)
    renderRightHandButtons(...data.right)
}

mortNameReplace = {
    "Catacombs Gate":"Catacombs Gate",
    "Need a party!":"&cYou need a party!",
    "Dungeon Classes": "Select Class!",
    "Your Catacombs Profile": "Your Catacombs Stats",
    "The Catacombs - Entrance": "Your Catacombs Enterance Stats",
    "The Catacombs - Floor I": "Your Catacombs Floor I Stats",
    "The Catacombs - Floor II": "Your Catacombs Floor II Stats",
    "The Catacombs - Floor III": "Your Catacombs Floor III Stats",
    "The Catacombs - Floor IV": "Your Catacombs Floor IV Stats",
    "The Catacombs - Floor V": "Your Catacombs Floor V Stats",
    "The Catacombs - Floor VI": "Your Catacombs Floor VI Stats",
    "The Catacombs - Floor VII": "Your Catacombs Floor VII Stats",
    "Dungeon Rules and Tips":"Dungeon Rules and Tips",
    "Party Finder":"Party finder",
    "Search Settings": "Search Settings",
    "Select Floor":"Select Floor",
    "Select Type": "Select Type",
    "Group Builder": "Group Builder",
    "Undersized party!": "Undersized party!",
    "On cooldown!": "On cooldown!",
    "Creating dungeon....": "Creating dungeon....",
    "Error!": "Error!",
    "It broke!":"It broke!"
}

let fragrunbots = {
    clickCommands: [],
    displayNames: [],
    botNames: []
}

function updateFragRunBots(){
    new Thread(()=>{
        let data = JSON.parse(FileLib.getUrlContent("https://api.fragruns.com/stats"))

        fragrunbots.clickCommands = ["fragbot_0"]
        fragrunbots.displayNames =  ["&cParty Vanilla_Steve"]
        fragrunbots.botNames =  ["Vanilla_Steve"]

        Object.keys(data.queueLength).forEach((element, i) => {
            fragrunbots.clickCommands.push("fragbot_" + (i+1))
            fragrunbots.displayNames.push("&cParty " + element)
            fragrunbots.botNames.push(element)
        });
    }).start()
}

updateFragRunBots()
register("worldLoad",()=>{
    updateFragRunBots()
})

function getMortButtonsFromName(name){

    if(name === "Catacombs Gate"){

        return {left:[[11,12,13,14,15,21,22,23,...(fragrunbots.clickCommands)],[
            "&aThe Catacombs &8- &eEntrance",
            "&aThe Catacombs &8- &eFloor I",
            "&aThe Catacombs &8- &eFloor II",
            "&aThe Catacombs &8- &eFloor III",
            "&aThe Catacombs &8- &eFloor IV",
            "&aThe Catacombs &8- &eFloor V",
            "&aThe Catacombs &8- &eFloor VI",
            "&aThe Catacombs &8- &eFloor VII",
            ...(fragrunbots.displayNames)
        ]],
        right:[[47,48,50,53,49],[
            "&aSelect Class",
            "&aParty Finder",
            "&aYour Catacombs Profile",
            "&aDungeon Rules and Tips",
            "&cClose"
        ]]}
    }
    if(name === "Need a party!"){

        return {left:[[14,...(fragrunbots.clickCommands)],[
            "&aParty Finder",...(fragrunbots.displayNames)
        ]],
        right:[[31],[
            "&cGo Back"
        ]]}

    }
    if(name === "Dungeon Classes"){

        return {left:[[11,12,13,14,15],"custom_dungeon_classes"],
        right:[[30,31],[
            "&cGo Back",
            "&cClose"
        ]]}

    }
    if(name === "Your Catacombs Profile"){

        return {left:[[11,12,13,14,15,21,22,23],[
            "&aThe Catacombs &8- &eEntrance",
            "&aThe Catacombs &8- &eFloor I",
            "&aThe Catacombs &8- &eFloor II",
            "&aThe Catacombs &8- &eFloor III",
            "&aThe Catacombs &8- &eFloor IV",
            "&aThe Catacombs &8- &eFloor V",
            "&aThe Catacombs &8- &eFloor VI",
            "&aThe Catacombs &8- &eFloor VII",
        ]],
        right:[[48,49],[
            "&cGo Back",
            "&cClose"
        ]]}

    }
    if(name === "The Catacombs - Entrance" || name.startsWith("The Catacombs - Floor ")){

        return {left:[[11,12,13,14,15,20,21,22,23,24],"custom_dungeon_stats"],
        right:[[48,49],[
            "&cGo Back",
            "&cClose"
        ]]}

    }
    if(name === "Dungeon Rules and Tips"){
        return {left:[[10,13,16,28,31,34],[
            "&aGeneral Changes",
            "&aCombat Changes",
            "&aEnchantment Changes",
            "&aGear Changes",
            "&aDeath Rules",
            "&aTips"
        ]],
        right:[[48,49],[
            "&cGo Back",
            "&cClose"
        ]]}
    }
    if(name === "Party Finder"){
        return {left:[[10,11,12,13,14,15,16,19,20,21,22,23,24,25,28,29,30,31,32,33,34],"custom_dungeon_parties"],
        right:[[45,46,50,48,49,26,18,52,53],[
            "&aStart a new queue",
            "&aRefresh",
            "&aSearch Settings",
            "&cGo Back",
            "&cClose",
            "&aNext Page",
            "&aPrevious Page",
            "&aDe-list group",
            "&6Your Party"
        ]]}
    }
    if(name === "Search Settings"){
        return {left:[[11,13,15],[
            "&aSelect Floor",
            "&aSelect Dungeon Type",
            "&aEnter Search"
        ]],
        right:[[30,31],[
            "&cGo Back",
            "&cClose"
        ]]}
    }
    if(name === "Select Floor"){
        return {left:[[10,12,14,16,22,28,30,32,34],[
            "&aAny",
            "&aEntrance",
            "&aFloor I",
            "&aFloor II",
            "&aFloor III",
            "&aFloor IV",
            "&aFloor V",
            "&aFloor VI",
            "&aFloor VII"
        ]],
        right:[[48,49],[
            "&cGo Back",
            "&cClose"
        ]]}
    }
    if(name === "Select Type"){
        return {left:[[12,14],[
            "&aAny",
            "&aCatacombs"
        ]],
        right:[[30,31],[
            "&cGo Back",
            "&cClose"
        ]]}
    }
    if(name === "Group Builder"){
        return {left:[[11,12,13,14,15],[
            "&aSelect Dungeon Type",
            "&aSelect Floor",
            "&aSet Group Note",
            "&aSet Class Level Required",
            "&aSet Dungeon Level Required"
        ]],
        right:[[31,32],[
            "&cGo Back",
            "&aConfirm Group"
        ]]}
    }
    if(name === "Undersized party!"){
        return {left:[[13,14],[
            "&eUndersized Party!",
            "&aParty Finder"
        ]],
        right:[[31,32],[
            "&cGo Back"
        ]]}
    }
    if(name === "On cooldown!"){
        return {left:[[13,14],[
            "&cOn cooldown!",
            "&aParty Finder"
        ]],
        right:[[31],[
            "&cClose"
        ]]}
    }
    if(name === "Creating dungeon...."){
        return {left:[[13],[
            "&cCreating dungeon..."
        ]],
        right:[[31],[
            "&cClose"
        ]]}
    }
    if(name === "Error!"){
        return {left:[[13],[
            "&cError!"
        ]],
        right:[[31],[
            "&cClose"
        ]]}
    }
    if(name === "It broke!"){
        return {left:[[13],[
            "&cIt broke!"
        ]],
        right:[[31],[
            "&cClose"
        ]]}
    }
    
    return false
}

function runCustomFunction(funcName){
    if(funcName.startsWith("fragbot_")){
        ChatLib.say("/party invite " + fragrunbots.botNames[parseInt(funcName.substr(8))])
    }
}

function mortGuiClicked(mouseX,mouseY,button, gui, event){
    function testForSlotsLeft(itemLocations, itemNames){

        if(Player.getOpenedInventory().getName() === "Select Type" && Player.getOpenedInventory().getStackInSlot(12).getName() === " "){
            itemLocations = [13]
            itemNames = ["&cThe Catacombs"]
        }

        if(Player.getOpenedInventory().getName() === "Select Floor" && Player.getOpenedInventory().getStackInSlot(22).getName() === " "){
            itemLocations =itemLocations.filter((b)=>{return b!== 22})
            itemNames.shift()
        }

        if(itemNames === "custom_dungeon_classes"){
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                    item.getLore().forEach((line)=>{
                        if(ChatLib.removeFormatting(line) === "SELECTED"){
                            itemNames[index] += " &e(SELECTED)"
                        }
                    })
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }

        let customItemNameDungeonStats = false
        if(itemNames === "custom_dungeon_stats"){
            customItemNameDungeonStats = true
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }
        let customItemNameDungeonParties = false
        if(itemNames === "custom_dungeon_parties"){
            customItemNameDungeonParties = true
            itemNames = lastCustomNames
            
            itemLocations.forEach((slot, index)=>{
                let item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
                if(item.getID() !== -1){
                    itemNames[index] = item.getName()
                    item.getLore().forEach((line)=>{
                        if(ChatLib.removeFormatting(line).startsWith("Note: ")){
                            itemNames[index] += "\n&e(" + ChatLib.removeFormatting(line).substr(6) + ")"
                        }
                    })
                }else{
                    if(new Date().getTime() - lastClickTime > 1000){
                        itemNames[index] = undefined
                    }
                }
            })
            lastCustomNames = itemNames
        }

        let renderX = 75
        let height = 30
        let longestItemName = 0
        itemNames.forEach((b)=>{
            if(b === undefined) return;
            b.split("\n").forEach((a)=>{
                let l = Renderer.getStringWidth(ChatLib.removeFormatting(a))
                if(l > longestItemName){
                    longestItemName= l
                }
            })
        })
        let width = longestItemName*2+height

        if(customItemNameDungeonParties){
            width = longestItemName+height
        }

        let blankThings = 0

        itemLocations.forEach((slot, index)=>{
            let notNum = false
            if(typeof(slot) !== "number"){
                notNum = true
            }
            let item = undefined
            if(!notNum){
                item = Player.getOpenedInventory().getStackInSlot(slot)
                if(item === null) return;
            }   
            let renderY = 75+(index-blankThings)*50
            if(index === 5 && customItemNameDungeonStats){
                renderX += width + height/2
            }
            if(index >= 5 && customItemNameDungeonStats){
                renderY -= 5*50
            }
            if(index % 8 === 0 && index > 1 ){
                renderX += width + height/2
            }
            if(index >= 8 ){
                renderY -= (8*50)*(Math.floor(index/8))
            }
            if(!notNum){
                if((item.getName() === " ")) {
                    blankThings++
                    return
                }
            }

            if(itemNames[index] === undefined) return;

                if(mouseX > renderX*scale && mouseX < (renderX+width)*scale
                    && mouseY > renderY*scale && mouseY < (renderY+height)*scale){
                        if(notNum){
                            runCustomFunction(slot)
                        }else{
                            Player.getOpenedInventory().drop(slot, false)
                            lastClickTime = new Date().getTime()
                        }
            }
        })
    }
    function testForSlotsRight(slots, itemNames){

        if(Player.getOpenedInventory().getName() === "Select Type" && Player.getOpenedInventory().getStackInSlot(12).getName() === " "){
            itemLocations = [31]
            itemNames = ["&cGo Back"]
        }

        if(Player.getOpenedInventory().getName() === "Select Floor" && Player.getOpenedInventory().getStackInSlot(22).getName() === " "){
            itemLocations = [49]
            itemNames = ["&cGo Back"]
        }
        
        let height = 30
        let longestItemName = 0
        itemNames.forEach((a)=>{
            let l = Renderer.getStringWidth(ChatLib.removeFormatting(a))
            if(l > longestItemName){
                longestItemName= l
            }
        })
        let width = longestItemName*2+height
        let renderX = (Renderer.screen.getWidth()*(1/scale))-width-75


        let blankThings = 0
        slots.forEach((slot, index)=>{
            let item = Player.getOpenedInventory().getStackInSlot(slot)
            if(item === null) return;
            if(item.getID() === -1) return;

            let renderY = 75+(index-blankThings)*50
            if((item.getName() === " ")) {
                blankThings++
                return
            }
        
            if(mouseX > renderX*scale && mouseX < (renderX+width)*scale
                && mouseY > renderY*scale && mouseY < (renderY+height)*scale){
                    Player.getOpenedInventory().drop(slot, false)
                    lastClickTime = new Date().getTime()
                }
        })
    }
    
    let data = getMortButtonsFromName(Player.getOpenedInventory().getName())
    testForSlotsLeft(...data.left)
    testForSlotsRight(...data.right)
}

register("guiKey",(char, keyCode, gui, event)=>{
    if(!mortGui.getEnabled()) return;
    if(Client.currentGui.getClassName() !== "GuiEditSign"){
        if(playerIsInMortGui()){
            if(keyCode === 1) return;

            cancel(event)
        }
    }
})
register("guiMouseDrag",(x, y, button, gui, event)=>{
    if(!mortGui.getEnabled()) return;
    if(Client.currentGui.getClassName() !== "GuiEditSign"){
        if(playerIsInMortGui()){
            cancel(event)
        }
    }
})
register("guiMouseClick",(x, y, button, gui, event)=>{
    if(!mortGui.getEnabled()) return; 
    if(Client.currentGui.getClassName() !== "GuiEditSign"){
        if(playerIsInMortGui()){
            cancel(event)
            mortGuiClicked(x,y,button,gui,event)
        }
    }
})
register("guiMouseDrag",(x, y, button, gui, event)=>{
    if(!mortGui.getEnabled()) return;
    if(Client.currentGui.getClassName() !== "GuiEditSign"){
        if(playerIsInMortGui()){
            cancel(event)
        }
    }
})

function playerIsInMortGui(){
    if(Player === null) return false;
    if(Player.getOpenedInventory() === null) return false
    return mortNameReplace[Player.getOpenedInventory().getName()] !== undefined;
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

class MortGui {
    constructor(){
        this.enabled = false
    }

    setEnabled = function(enabled){
        this.enabled = enabled
    }
    getEnabled = function(){
        return this.enabled
    }
}

let mortGui = new MortGui()

export default mortGui;