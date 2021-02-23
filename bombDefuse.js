/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
        //One day i will finish this

const GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
const GL11 = Java.type("org.lwjgl.opengl.GL11");

let enums = {
    DIRECTION_NONE: -1,
    DIRECTION_LEFT: 0, //x--
    DIRECTION_RIGHT: 1, //x++
    DIRECTION_UP: 2, //z--
    DIRECTION_DOWN: 3, //z++
    DIRECTION_X: 4,
    DIRECTION_Y: 5,
    ROOM_UNKNOWN: 5
}

let bombDefuseLocation = undefined
let bombDefuseDirection = enums.DIRECTION_NONE //
let bombDefuseDirectionFine = enums.DIRECTION_NONE //


register("chat",()=>{
    bombDefuse.loadRoomPos()
}).setChatCriteria("&r&a&l[BOMB] &r&aCreeper&r&f: That's a fine pair of loot chests! You better hurry or I'll explode and destroy them!&r")

register("command",()=>{
    bombDefuse.loadRoomPos()
}).setName("force_start_bomb_defuse")
register("command",(dir)=>{
    bombDefuse.loadRoomPos([Math.floor(Player.getX()),Math.floor(Player.getY()),Math.floor(Player.getZ())],dir)
}).setName("force_start_bomb_defuse_here")



class BombRoom{
    constructor(midX, midY, midZ, left, rotation){
        this.midX = midX
        this.midY = midY
        this.midZ = midZ
        this.left = left
        this.rotation = rotation
        this.roomId = enums.ROOM_UNKNOWN
    }

    getMidX = function(){return this.midX}
    getMidY = function(){return this.midY}
    getMidZ = function(){return this.midZ}

    getBlock = function(xOff, yOff, zOff){
        switch(this.rotation){
            case enums.DIRECTION_RIGHT:
                drawBoxAtBlock(midX+xOff,midY+yOff,midZ+zOff, 0,255,0)
                break;
            case enums.DIRECTION_LEFT:
                drawBoxAtBlock(midX-xOff,midY+yOff,midZ-zOff, 0,255,0)
                break;
            case enums.DIRECTION_UP:
                drawBoxAtBlock(midX-zOff,midY+yOff,midZ-xOff, 0,255,0)
                break;
            case enums.DIRECTION_DOWN:
                drawBoxAtBlock(midX-xOff,midY+yOff,midZ+xOff, 0,255,0)
                break;
        }
    }

    render = function(){
        drawBoxAtBlock(this.getMidX(),this.getMidY(),this.getMidZ(),0,255,0)
    }
}

class BombDefuse{
    constructor(){
        this.roomsLeft = []
        this.roomsRight = []
    }

    render = function(){
        if(bombDefuseLocation !== undefined){
            drawBoxAtBlock(...bombDefuseLocation, 0,0,255)
            drawBoxAtBlock(bombDefuseLocation[0],bombDefuseLocation[1]+1,bombDefuseLocation[2], 0,0,255)
            if(bombDefuseDirection === enums.DIRECTION_X){
                drawBoxAtBlock(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]+1, 0,255,0)
                drawBoxAtBlock(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]-1, 0,255,0)
            }else{
                drawBoxAtBlock(bombDefuseLocation[0]+1,bombDefuseLocation[1],bombDefuseLocation[2], 0,255,0)
                drawBoxAtBlock(bombDefuseLocation[0]-1,bombDefuseLocation[1],bombDefuseLocation[2], 0,255,0)
            }
            switch(bombDefuseDirectionFine){
                case enums.DIRECTION_RIGHT:
                    drawBoxAtBlock(bombDefuseLocation[0]+3,bombDefuseLocation[1]-1,bombDefuseLocation[2]-12, 0,255,0)
                    drawBoxAtBlock(bombDefuseLocation[0]-3,bombDefuseLocation[1]-1,bombDefuseLocation[2]-12, 0,255,0)
                break;
                case enums.DIRECTION_LEFT:
                    drawBoxAtBlock(bombDefuseLocation[0]+3,bombDefuseLocation[1]-1,bombDefuseLocation[2]+12, 0,255,0)
                    drawBoxAtBlock(bombDefuseLocation[0]-3,bombDefuseLocation[1]-1,bombDefuseLocation[2]+12, 0,255,0)
                    break;
                case enums.DIRECTION_UP:
                    drawBoxAtBlock(bombDefuseLocation[0]+12,bombDefuseLocation[1]-1,bombDefuseLocation[2]+3, 0,255,0)
                    drawBoxAtBlock(bombDefuseLocation[0]+12,bombDefuseLocation[1]-1,bombDefuseLocation[2]-3, 0,255,0)
                    break;
                case enums.DIRECTION_DOWN:
                    drawBoxAtBlock(bombDefuseLocation[0]-12,bombDefuseLocation[1]-1,bombDefuseLocation[2]+3, 0,255,0)
                    drawBoxAtBlock(bombDefuseLocation[0]-12,bombDefuseLocation[1]-1,bombDefuseLocation[2]-3, 0,255,0)
                    break;
            }

            this.roomsLeft.forEach((room)=>{
                room.render()
            })
            this.roomsRight.forEach((room)=>{
                room.render()
            })
        }
    }
    
    loadRoomPos = function(location, direction){

        if(location !== undefined){
            bombDefuseLocation = location
            bombDefuseDirectionFine = direction
            bombDefuseDirection = this.getDirectionFromFine(direction)
            return;
        }

        let entity = undefined
        World.getAllEntities().forEach((e)=>{    
            if(e.getName() === "Creeper"){
                bombDefuseLocation = [e.getX(), e.getY(),e.getZ()].map((a)=>{return Math.floor(a)})
                let blocks = [World.getBlockAt(bombDefuseLocation[0]+1,bombDefuseLocation[1],bombDefuseLocation[2]).getRegistryName(),
                    World.getBlockAt(bombDefuseLocation[0]-1,bombDefuseLocation[1],bombDefuseLocation[2]).getRegistryName(),
                    World.getBlockAt(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]+1).getRegistryName(),
                    World.getBlockAt(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]-1).getRegistryName()]
    
                if(blocks.filter((b)=>{return b === "minecraft:chest"}).length === 2){
                    entity = e
                }
            }
        })

        if(entity === undefined){
            ChatLib.chat("No bomb defuse found!")
            return;
        }
        
        bombDefuseLocation = [entity.getX(), entity.getY(),entity.getZ()].map((a)=>{return Math.floor(a)})
        
        let chestLocations = []
    
        if(World.getBlockAt(bombDefuseLocation[0]+1,bombDefuseLocation[1],bombDefuseLocation[2]).getRegistryName() === "minecraft:chest"){
            chestLocations.push([bombDefuseLocation[0]+1,bombDefuseLocation[1],bombDefuseLocation[2]])
        }
        if(World.getBlockAt(bombDefuseLocation[0]-1,bombDefuseLocation[1],bombDefuseLocation[2]).getRegistryName() === "minecraft:chest"){
            chestLocations.push([bombDefuseLocation[0]-1,bombDefuseLocation[1],bombDefuseLocation[2]])
        }
        if(World.getBlockAt(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]+1).getRegistryName() === "minecraft:chest"){
            chestLocations.push([bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]+1])
        }
        if(World.getBlockAt(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]-1).getRegistryName() === "minecraft:chest"){
            chestLocations.push([bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]-1])
        }
    
        if(chestLocations[0][0] === chestLocations[1][0]){
            bombDefuseDirection = enums.DIRECTION_X
            bombDefuseDirectionFine = World.getBlockAt(bombDefuseLocation[0],bombDefuseLocation[1],bombDefuseLocation[2]+5).getRegistryName() === "minecraft:iron_bars"?enums.DIRECTION_UP:enums.DIRECTION_DOWN
        }
        if(chestLocations[0][2] === chestLocations[1][2]){
            bombDefuseDirection = enums.DIRECTION_Y
            bombDefuseDirectionFine = World.getBlockAt(bombDefuseLocation[0]+5,bombDefuseLocation[1],bombDefuseLocation[2]).getRegistryName() === "minecraft:iron_bars"?enums.DIRECTION_LEFT:enums.DIRECTION_RIGHT
        }
    
        this.loadRooms()
    }
    getDirectionFromFine = function(a){
        return (a===enums.DIRECTION_LEFT || a === enums.DIRECTION_RIGHT)?enums.DIRECTION_X : enums.DIRECTION_Y
    }

    unloadPuzzle = function(){
        this.roomsLeft = []
        this.roomsRight = []
        bombDefuseLocation = undefined
        bombDefuseDirection = enums.DIRECTION_NONE
        bombDefuseDirectionFine = enums.DIRECTION_NONE
    }

    //(midX, midY, midZ, left, rotation){//6
    loadRooms = function(){
        switch(bombDefuseDirectionFine){
            case enums.DIRECTION_RIGHT:
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-12,true, bombDefuseDirectionFine),1)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-12,false, bombDefuseDirectionFine),1)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-5,true, bombDefuseDirectionFine),2)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-5,false, bombDefuseDirectionFine),2)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+2,true, bombDefuseDirectionFine),3)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+2,false, bombDefuseDirectionFine),3)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),4)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,false, bombDefuseDirectionFine),4)
                break;
            case enums.DIRECTION_LEFT:
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+12,true, bombDefuseDirectionFine),1)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+12,false, bombDefuseDirectionFine),1)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+5,true, bombDefuseDirectionFine),2)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+5,false, bombDefuseDirectionFine),2)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-2,true, bombDefuseDirectionFine),3)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-2,false, bombDefuseDirectionFine),3)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,true, bombDefuseDirectionFine),4)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),4)
                break;
            case enums.DIRECTION_UP:
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+12,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),1)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]+12,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),1)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+5,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),2)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]+5,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),2)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]-2,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),3)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-2,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),3)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),4)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),4)
                break;
            case enums.DIRECTION_DOWN:
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]-12,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),1)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-12,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),1)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]-5,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),2)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]-5,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),2)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+2,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),3)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]+2,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),3)
                this.roomsLeft.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]+9,true, bombDefuseDirectionFine),4)
                this.roomsRight.push(new BombRoom(bombDefuseLocation[0]+9,bombDefuseLocation[1]-1,bombDefuseLocation[2]-9,false, bombDefuseDirectionFine),4)
                break;
        }
    }
}

let bombDefuse = new BombDefuse()

export default bombDefuse;

//&r&c&lPUZZLE FAIL! &r&eThe &r&a&lCreeper Bomb &r&eexploded! You took too long! &r&4Y&r&ci&r&6k&r&ee&r&as&r&2!&r

function startDrawingLines(){
	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(3);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();
}
function stopDrawingLines(){
	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
}

function drawBoxAtBlock(x, y, z, colorR, colorG, colorB){

    startDrawingLines()
	
	Tessellator.begin(3).colorize(colorR, colorG, colorB);
		
	Tessellator.pos(x+1,y+1,z+1).tex(0, 0);
	Tessellator.pos(x+1,y+1,z).tex(0, 0);
	Tessellator.pos(x,y+1,z).tex(0, 0);
	Tessellator.pos(x,y+1,z+1).tex(0, 0);
	Tessellator.pos(x+1,y+1,z+1).tex(0, 0);
	Tessellator.pos(x+1,y,z+1).tex(0, 0);
	Tessellator.pos(x+1,y,z).tex(0, 0);
	Tessellator.pos(x,y,z).tex(0, 0);
	Tessellator.pos(x,y,z+1).tex(0, 0);
	Tessellator.pos(x,y,z).tex(0, 0);
	Tessellator.pos(x,y+1,z).tex(0, 0);
	Tessellator.pos(x,y,z).tex(0, 0);
	Tessellator.pos(x+1,y,z).tex(0, 0);
	Tessellator.pos(x+1,y+1,z).tex(0, 0);
	Tessellator.pos(x+1,y,z).tex(0, 0);
	Tessellator.pos(x+1,y,z+1).tex(0, 0);
	Tessellator.pos(x,y,z+1).tex(0, 0);
	Tessellator.pos(x,y+1,z+1).tex(0, 0);
	Tessellator.pos(x+1,y+1,z+1).tex(0, 0);

    Tessellator.draw();
    
    stopDrawingLines()
}


register("worldLoad",()=>{
    bombDefuse.unloadPuzzle()
})