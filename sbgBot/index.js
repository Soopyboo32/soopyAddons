/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
export default "Nothing is here";
import commandQueue from 'soopyAddons/sbgBot/command.js';
const NBTTagList = Java.type("com.chattriggers.ctjs.minecraft.wrappers.objects.inventory.nbt.NBTTagList")
const NBTTagString = Java.type("net.minecraft.nbt.NBTTagString")

let isSoopy = Player.getUUID().toString().replace(/-/ig, "") === "dc8c39647b294e03ae9ed13ebd65dd29"
let isSbgAdmin = isSoopy || Player.getUUID().toString().replace(/-/ig, "") === "b9d90392124048bb993f8f1b836657a8" || Player.getUUID().toString().replace(/-/ig, "") === "a80b52f6707a4f8286cabc6e95cf9fdf"

// const ByteArrayInputStream = Java.type("java.io.ByteArrayInputStream");
// const Base64 = Java.type("java.util.Base64");
// const CompressedStreamTools = Java.type("net.minecraft.nbt.CompressedStreamTools");

new Thread(() => {
    let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/getIsBotUser.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + Player.getUUID().toString()))
    if (res.success) {
        let skillData = JSON.parse(FileLib.getUrlContent("https://api.hypixel.net/resources/skyblock/skills"))
        ChatLib.chat("Hosting guild chat bot...")
        let lowestBins = {}
        let lowestBinsAvg = {}
        let bazaar = {}
        let scammerData = {}

        let commandAlias = {
            "cheapestbin": "lowestbin",
            "bin": "lowestbin",
            "leaderboardposition": "lbpos",
            "stoneof": "whatstone",
            "nw": "networth",
            "bz": "bazzar",
            "sc":"scammercheck",
            "scammer":"scammercheck",
            "fetch": "fetchur"
        }

        let commandsSpeed = 0
        let commandsSpeedLimit = 3

        let lastUpdateLowestBins = 0
        let lastCommandOverLimit = false;

        register("tick", () => {
            commandsSpeed *= 0.9997
            if (commandsSpeed > commandsSpeedLimit) {
                if (!lastCommandOverLimit) {
                    lastCommandOverLimit = true

                    commandsSpeed++
                    //commandQueue.other.push(spamBypass("/gc @everyone, bot messages in guild chat have been moved to dms due to spam"))
                }
            } else {
                if (lastCommandOverLimit) {
                    lastCommandOverLimit = false

                    //commandQueue.other.push(spamBypass("/gc @everyone, bot messages are now back in guild chat"))
                }
            }
        })

        register("chat", (player, message, e) => {

            //player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")

            cancel(e)
                //ChatLib.chat("&r&2SBGBOT > &r&7[DM] " + "&6" + player + "&a" + " -> " + "&r" + message)
        }).setChatCriteria("&dTo &r${player}&r&7: &r&7@sbgbot ${message}&r")
        let i = 10;
        register("tick", () => {
            if (new Date().getTime() - lastUpdateLowestBins > 2 * 60 * 60 * 1000) {
                lastUpdateLowestBins = new Date().getTime()
                new Thread(() => {
                    i++
                    if (i > 10) {
                        i = 0
                        try{
                            scammerData = JSON.parse(FileLib.getUrlContent("https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json"))
                            lowestBinsAvg = JSON.parse(FileLib.getUrlContent("http://moulberry.codes/auction_averages_lbin/1day.json")) //Uses moulberrys api, i will maby code my own sometime tho
                        }catch(e){}
                    }
                    bazaar = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/bazaar")) //Uses leas api, i will maby code my own sometime tho
                    let lowestBinsData = JSON.parse(FileLib.getUrlContent("https://moulberry.codes/lowestbin.json")) //Uses moulberrys api, i will maby code my own sometime tho
                    let lowestBinsNew = {}
                    let petReplace = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"]
                    let petList = ["BAT", "BLAZE", "CHICKEN", "HORSE", "JERRY", "OCELOT", "PIGMAN", "RABBIT", "SHEEP", "SILVERFISH", "WITHER_SKELETON", "SKELETON_HORSE", "WOLF", "ENDERMAN", "PHOENIX", "MAGMA_CUBE", "FLYING_FISH", "BLUE_WHALE", "TIGER", "LION", "PARROT", "SNOWMAN", "TURTLE", "BEE", "ENDER_DRAGON", "GUARDIAN", "SQUID", "GIRAFFE", "ELEPHANT", "MONKEY", "SPIDER", "ENDERMITE", "GHOUL", "JELLYFISH", "PIG", "ROCK", "SKELETON", "ZOMBIE", "DOLPHIN", "BABY_YETI", "MEGALODON", "GOLEM", "HOUND", "TARANTULA", "BLACK_CAT", "SPIRIT", "GRIFFIN"]

                    Object.keys(lowestBinsData).forEach((key) => {
                        let keyNew = key
                        if (key.includes(";")) {
                            let a = key.split(";")
                            if (petList.includes(a[0])) {
                                keyNew = petReplace[parseInt(a[1])] + "_" + a[0]
                            } else {
                                keyNew = a[0] + "_" + a[1]
                            }
                        }
                        lowestBinsNew[keyNew] = lowestBinsData[key]
                    })
                    lowestBins = lowestBinsNew
                }).start()
            }
        })

        register("chat", (player, message) => {
            if (message.substr(0, 1) !== "-" && message.substr(0, 1) !== "/") { return }
            player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
            message = message.substr(1, message.length - 1)
            let args = message.split(" ")
            let command = args[0]

            ranCommand(player, command, args)

        }).setChatCriteria("&r&2Guild > ${player}&f: &r${message}&r")


        function ranCommand(player, command, args) {

            new Thread(() => {
                Thread.sleep((commandQueue.other.length + commandQueue.dm.length) * 100)
                commandsSpeed++
                if (commandFunctions[command] == undefined) {
                    if (commandFunctions[commandAlias[command]] == undefined) {
                        //commandQueue.other.push(spamBypass("/gc @" + player + ", " + command + " is not a valid command!"))
                    } else {
                        let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/shouldRunCommand.json?key=lkRFxoMYwrkgovPRn2zt&command=" + sha256(player + ": " + args.join(" "))))
                        if (res.result) {
                            commandFunctions[commandAlias[command]](player, command, args)
                        }
                        return;
                    }
                } else {
                    let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/shouldRunCommand.json?key=lkRFxoMYwrkgovPRn2zt&command=" + sha256(player + ": " + args.join(" "))))
                    if (res.result) {
                        commandFunctions[command](player, command, args)
                    }
                    return;
                }

            }).start()
        }

        let reforgeToStone = {
            "Necrotic": {
                "name": "Necromancer's Brooch",
                "id": "NECROMANCER_BROOCH"
            },
            "Perfect": {
                "name": "Diamond Atom",
                "id": "DIAMOND_ATOM"
            },
            "Spiked": {
                "name": "Dragon Scale",
                "id": "DRAGON_SCALE"
            },
            "Fabled": {
                "name": "Dragon Claw",
                "id": "DRAGON_CLAW"
            },
            "Renowned": {
                "name": "Dragon Horn",
                "id": "DRAGON_HORN"
            },
            "Undead": {
                "name": "Premium Flesh",
                "id": "PREMIUM_FLESH"
            },
            "Cubic": {
                "name": "Molten Cube",
                "id": "MOLTEN_CUBE"
            },
            "Silky": {
                "name": "Luxurious Spool",
                "id": "LUXURIOUS_SPOOL"
            },
            "Warped": {
                "name": "End Stone Geode",
                "id": "ENDSTONE_GEODE"
            },
            "Reinforced": {
                "name": "Rare Diamond",
                "id": "RARE_DIAMOND"
            },
            "Magnetic": {
                "name": "Lapis Crystal",
                "id": "LAPIS_CRYSTAL"
            },
            "Gilded": {
                "name": "Midas Jewel",
                "id": "MIDAS_JEWEL"
            },
            "Fruitful": {
                "name": "Onyx",
                "id": "ONYX"
            },
            "Bloody": {
                "name": "Beating Heart",
                "id": "BEATING_HEART"
            },
            "Precise": {
                "name": "Optical Lens",
                "id": "OPTICAL_LENS"
            },
            "Ridiculous": {
                "name": "Red Nose",
                "id": "RED_NOSE"
            },
            "Loving": {
                "name": "Red Scarf",
                "id": "RED_SCARF"
            },
            "Suspicious": {
                "name": "Suspicious Vial",
                "id": "SUSPICIOUS_VIAL"
            },
            "Spiritual": {
                "name": "Spirit Stone",
                "id": ""
            },
            "Warped": {
                "name": "Warped Stone",
                "id": "AOTE_STONE"
            },
            "Shaded": {
                "name": "Dark Orb",
                "id": "DARK_ORB"
            },
            "Giant": {
                "name": "Giant Tooth",
                "id": "GIANT_TOOTH"
            },
            "Empowered": {
                "name": "Sadan's Brooch",
                "id": "SADAN_BROOCH"
            },
            "Moil": {
                "name": "Moil Log",
                "id": "MOIL_LOG"
            },
            "Dirty": {
                "name": "Dirty Bottle",
                "id": "DIRT_BOTTLE"
            },
            "Toil": {
                "name": "Toil Log",
                "id": "TOIL_LOG"
            },
            "Refined": {
                "name": "Refined Amber",
                "id": "REFINED_AMBER"
            },
            "Blessed": {
                "name": "Blessed Fruit",
                "id": "BLESSED_FRUIT"
            },
            "Sweet": {
                "name": "Rock Candy",
                "id": "ROCK_CANDY"
            },
            "Candied": {
                "name": "Candy Corn",
                "id": "CANDY_CORN"
            },
            "Submerged": {
                "name": "Deep Sea Orb",
                "id": "DEEP_SEA_ORB"
            },
            "Ancient": {
                "name": "Precursor Gear",
                "id": "PRECURSOR_GEAR"
            },
            "Withered": {
                "name": "Wither Blood",
                "id": "WITHER_BLOOD"
            }
        }

        let commandFunctions = {}
        let commandFunctionsNonGuild = {}

        if (isSoopy) {


            //-----------------------------------------------------
            //             SOOPY BOT POGGGGGGGGGGGGG
            //-----------------------------------------------------
            
            register("chat", (player, message) => {
                if (message.substr(0, 1) !== "-" && message.substr(0, 1) !== "/") { return }
                player = player.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
                message = message.substr(1, message.length - 1)
                let args = message.split(" ")
                let command = args[0]

                ranCommandNonGuild(player, "pc", command, args)

            }).setChatCriteria("&r&9Party &8> ${player}&f: &r${message}&r")


            function ranCommandNonGuild(player, responceCommand, command, args) {
                new Thread(() => {
                    if (commandFunctionsNonGuild[command] == undefined) {
                        if (commandFunctionsNonGuild[commandAlias[command]] == undefined) {
                            //commandQueue.other.push(spamBypass("/gc @" + player + ", " + command + " is not a valid command!"))
                        } else {
                            commandFunctionsNonGuild[commandAlias[command]](player, responceCommand, command, args)
                        }
                    } else {
                        commandFunctionsNonGuild[command](player, responceCommand, command, args)
                        return;
                    }
                }).start()
            }
            
            commandFunctionsNonGuild.math = function(player, chatCommand, command, args) {
                if(args === undefined){
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", invalid equasion!"))
                }

                args.shift()
                
                let res = FileLib.getUrlContent("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(args.join(" ")))

                commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", " + res))
            }
            commandFunctionsNonGuild.networth = function(player, chatCommand, command, args) {
                if (args[1] === undefined) {
                    args[1] = player
                }
    
                let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))
                try {
                    let netWorth = 0
                    let netWorthLast = 0
    
    
                    function worthChangeVerift() {
                        if (netWorth.toString() === "NaN" || netWorth.toString() === "undefined") {
                            netWorth = netWorthLast
                        }
                        netWorthLast = netWorth
                    }
    
                    let items = []
                    let pets = []
    
                    Object.keys(data.profiles).forEach((profId) => {
                        let itemStorage = ["wardrobe_inventory", "inventory", "enderchest", "talisman_bag", "fishing_bag", "quiver", "potion_bag"]
                        let itemStorageReplace = {
                            "wardrobe": "wardrobe_inventory",
                            "ward": "wardrobe_inventory",
                            "invent": "inventory",
                            "inv": "inventory",
                            "ec": "enderchest",
                            "talis": "talisman_bag",
                            "fish": "fishing_bag",
                            "potion": "potion_bag"
                        }
                        itemStorage.forEach((itemLocation) => {
                            data.profiles[profId].items[itemLocation].forEach((item) => {
                                if (args[2] === undefined || args[2].toLowerCase() === itemLocation || itemStorageReplace[args[2].toLowerCase()] === itemLocation) {
                                    items.push({...item, "location": itemLocation })
                                }
                            })
                        })
                        if (args[2] === undefined || args[2].toLowerCase() === "pets") {
                            data.profiles[profId].data.pets.forEach((pet) => {
                                pets.push(pet)
                            })
                        }
    
                        if (args[2] === undefined) {
                            netWorth += data.profiles[profId].raw.coin_purse
                            worthChangeVerift()
                            netWorth += data.profiles[profId].data.bank
                            worthChangeVerift()
                            netWorth += data.profiles[profId].data.slayer_coins_spent.total
                            worthChangeVerift()
                        }
                    })
                    items.forEach((item) => {
                        if (item.Count !== undefined) {
                            netWorth += getItemWorth(item)
                            worthChangeVerift()
                        }
                    })
                    pets.forEach((pet) => {
                        netWorth += getPetWorth(pet)
                        worthChangeVerift()
                    })
    
    
                    netWorth = addNotation("oneLetters", netWorth)
                    commandQueue.dm.push(spamBypass("/" + chatCommand + " " + player + ", " + (args[1] === player ? "You have" : args[1] + " has") + " a networth of $" + netWorth + "!"))

    
                } catch (e) {
                    console.log(JSON.stringify(e))
                        commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", there was an error!"))
                }
            }

            commandFunctionsNonGuild.lowestbin = function(player, chatCommand, command, args) {
                let vals = {}

                args.forEach((arg) => {
                    if (arg == "lowestbin") {
                        return;
                    }
                    Object.keys(lowestBins).forEach((lowestBin) => {
                        if (lowestBin.toLowerCase().includes(arg.toLowerCase())) {
                            if (vals[lowestBin] == undefined) { vals[lowestBin] = 0 }
                            vals[lowestBin]++
                                if (lowestBin.includes("STARRED")) {
                                    vals[lowestBin] -= 0.1
                                }
                        }
                    })
                })

                let topItem = undefined
                let topScore = 0;

                Object.keys(vals).forEach((val) => {
                    if (vals[val] > topScore) {
                        topItem = val
                        topScore = vals[val]
                    }
                })

                if (topItem === undefined) {
                    commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", no auctions found!"))
                    return;
                }

                let itemName = topItem.replace(/_/g, " ").toLowerCase()
                itemName = itemName.substr(0, 1).toUpperCase() + itemName.substr(1)

                commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + ", Cheapest bin for " + itemName + " is " + numberWithCommas(lowestBins[topItem]) + "!"))

            }
            commandFunctionsNonGuild.help = function(player, chatCommand, command, args) {
                commandQueue.other.push(spamBypass("/" + chatCommand + " @" + player + " DMing you the results, make sure to have your dms open :)"))

                if (args[1] === undefined) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Possible commands are:"))
                    Object.keys(commandFunctionsNonGuild).forEach((commandF) => {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot " + commandF))
                    })
                } else {
                    switch (args[1]) {
                        // case "aliases":

                        //     commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Command aliases "))
                        //     Object.keys(commandAlias).forEach((alias) => {
                        //         commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot " + alias + " runs " + commandAlias[alias]))
                        //     })
                        //     break;

                        default:

                            commandQueue.dm.push(spamBypass("/msg " + player + " @soopybot Help for command " + args[1]))
                        break;
                    }
                }
            }
        }

        commandFunctions.scammercheck = function(player, command, args){
            if (args[1] === undefined) {
                args[1] = player
            }

            let playerUUID = JSON.parse(FileLib.getUrlContent("https://api.mojang.com/users/profiles/minecraft/" + args[1])).id

            let isScammer = scammerData[playerUUID] !== undefined

            if(!isScammer){
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot "+ (player.toLowerCase()===args[1].toLowerCase()?"You are":args[1]+" is") + " not a scammer"))
                } else {
                    commandQueue.dm.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase()===args[1].toLowerCase()?"You are":args[1]+" is") + " not a scammer"))
                }
            }else{
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " +(player.toLowerCase()===args[1].toLowerCase()?"You are":args[1]+" is") + " a scammer"))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Reason: " + scammerData[playerUUID].reason))
                } else {
                    commandQueue.dm.push(spamBypass("/gc @" + player + ", "+ (player.toLowerCase()===args[1].toLowerCase()?"You are":args[1]+" is") + " a scammer"))
                    commandQueue.dm.push(spamBypass("/gc @" + player + ", Reason: " + scammerData[playerUUID].reason))
                }
            }
        }
        commandFunctions.fetchur = function(player, command, args){
            let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getFetchur.json?key=lkRFxoMYwrkgovPRn2zt")).fetchur

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Fetchur is currently " + (data?data:"Unknown") + "."))
            } else {
                commandQueue.dm.push(spamBypass("/gc @" + player + ", Fetchur is currently " + (data?data:"Unknown") + "."))
            }
        }

        commandFunctions.stats = function(player, command, args) {
            if (args[1] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot U need to specify the player to check!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", U need to specify the player to check!"))
                }
                return;
            }
            if (commandsSpeed > commandsSpeedLimit) {

            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", DMing you the results :)"))
            }

            try {
                let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + args[1].replace("_", "^")))
                let playerUUID = ""

                if (!playerData.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + playerData.reason))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + playerData.reason))
                    }
                    return;
                }
                if (!playerData.data.success) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data!"))
                    }
                    return;
                }

                if (playerData.data.player == null) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data (Invalid player?)"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data (Invalid player?)"))
                    }
                    return;
                }

                playerUUID = playerData.data.player.uuid

                try {
                    let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerUUID))

                    if (!skyblockData.success) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data: " + skyblockData.reason))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data: " + skyblockData.reason))
                        }
                        return;
                    }
                    if (!skyblockData.data.success) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error fetching data!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Error fetching data!"))
                        }
                        return;
                    }
                    if (skyblockData.data.profiles == null) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Player has no skyblock profiles!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", Player has no skyblock profiles!"))
                        }
                        return;
                    }

                    let last_save = 0

                    let playerProfile = skyblockData.data.profiles[0]
                    skyblockData.data.profiles.forEach((profile) => {
                        if (profile.members[playerUUID].last_save > last_save) {
                            last_save = profile.members[playerUUID].last_save
                            playerProfile = profile
                        }
                    })
                    let playerProf = playerProfile.members[playerUUID]

                    //let book = new Book(playerProf.player.rank_formatted + " " + playerProf.player.username + "&r&7's skyblock stats")

                    let skillApiOff = false;
                    let slayerApiOff = false;
                    let bankApiOff = false;
                    let playerTotalSlayer = 0;
                    let playerTotalSkillExp = 0;
                    let playerSkillAvg = 0;
                    let playerBankCoins = 0;
                    let fairySouls;
                    let slayerHover = "";
                    let skillHover = "";
                    let petText = "NONE";
                    let petHover = "&aPets\n\n&r";
                    let bankHover = "&aRecent transactions\n\n&r";

                    if (playerProfile.banking == null) {
                        bankApiOff = true
                        bankHover = "&cAPI OFF";
                    } else {
                        playerBankCoins = playerProfile.banking.balance

                        playerProfile.banking.transactions.reverse()
                        for (let i = 0; i < Math.min(10, playerProfile.banking.transactions.length); i++) {
                            bankHover += playerProfile.banking.transactions[i].action === "DEPOSIT" ? "&a+" : "&c-"
                            bankHover += " &6" + numberWithCommas(Math.round(playerProfile.banking.transactions[i].amount)) + "&7,"
                            bankHover += " &e" + timeSince(playerProfile.banking.transactions[i].timestamp) + " ago" + " &7by "
                            if (playerProfile.banking.transactions[i].initiator_name.substr(0, 1) !== "B") {
                                playerProfile.banking.transactions[i].initiator_name = playerProfile.banking.transactions[i].initiator_name.substr(1)
                            }
                            bankHover += playerProfile.banking.transactions[i].initiator_name + "\n"
                        }
                        bankHover = bankHover.replace(/[^0-9.abcdefghijklmnopqrstuvwxyz+\-, &\n\[\]_]+/gi, "&")
                        bankHover = bankHover.replace("olo Transfer", "Solo Transfer")
                        bankHover = bankHover.substr(0, bankHover.length - 1)
                    }

                    let skyblockSkills = [
                        "combat",
                        "mining",
                        "alchemy",
                        "farming",
                        "taming",
                        "enchanting",
                        "fishing",
                        "foraging",
                        "runecrafting",
                        "carpentry"
                    ]

                    skyblockSkills.forEach((skill) => {
                        if (playerProf["experience_skill_" + skill] === undefined) {
                            skillApiOff = true
                        } else {
                            let skillEXP = playerProf["experience_skill_" + skill]
        
                            let lvlCap = skillLevelCaps["experience_skill_" + skill]
                            if(skill === "farming"){
                              try{
                                lvlCap -= 10
                                lvlCap += playerProf.jacob2?.perks?.farming_level_cap || 0
                              }catch(e){}
                            }
                            
                            let skillData = getLevelByXp(skillEXP, skill === "runecrafting" ? 1 : 0,lvlCap)
        
                            skillHover += "&r" + firstLetterWordCapital(skill) + ": &7" + Math.round((skillData.level + skillData.progress) * 100) / 100 + "\n&r"
                            if (skill === "carpentry" || skill === "runecrafting") {
                                return;
                            }
                            playerSkillAvg += (skillData.level + skillData.progress) / (8)
                            playerTotalSkillExp += skillEXP
                        }
                    })
                    skillHover = skillHover.substr(0, skillHover.length - 3)
                    playerSkillAvg = Math.round(playerSkillAvg * 100) / 100

                    Object.keys(playerProf.slayer_bosses).forEach((slayer) => {
                        slayerHover += "&r&6" + firstLetterWordCapital(slayer) + "&7: &r" + numberWithCommas(playerProf.slayer_bosses[slayer].xp) + "\n&r"

                        slayerHover += " &bSlayer level: " + Object.keys(playerProf.slayer_bosses[slayer].claimed_levels).length + "\n&r"

                        let boss_kills_type = [
                            0,
                            1,
                            2,
                            3
                        ]

                        boss_kills_type.forEach((tier) => {
                            slayerHover += " - &7Kills tier " + (tier + 1) + ": " + numberWithCommas(playerProf.slayer_bosses[slayer]["boss_kills_tier_" + tier] || 0) + "\n"
                        })
                        slayerHover += "\n&r"

                        playerTotalSlayer += playerProf.slayer_bosses[slayer].xp
                    })
                    slayerHover = slayerHover.substr(0, slayerHover.length - 3)
                    fairySouls = playerProf.fairy_souls_collected

                    let petTierColor = {
                        "COMMON": "&f",
                        "UNCOMMON": "&a",
                        "RARE": "&9",
                        "EPIC": "&5",
                        "LEGENDARY": "&6"
                    }
                    let rarityNumber = {
                        "COMMON": 1,
                        "UNCOMMON": 2,
                        "RARE": 3,
                        "EPIC": 4,
                        "LEGENDARY": 5
                    }

                    if (playerProf.pets.length > 0) {
                        playerProf.pets = playerProf.pets.sort((a, b) => {
                            if (a.tier !== b.tier) {
                                return rarityNumber[b.tier] - rarityNumber[a.tier]
                            } else {
                                return b.exp - a.exp
                            }
                        })


                        for (let i = 0; i < playerProf.pets.length; i++) {
                            if (playerProf.pets[i].heldItem == "PET_ITEM_TIER_BOOST") {
                                playerProf.pets[i].tier = tierBoostChange[playerProf.pets[i].tier]
                            }
                        }

                        playerProf.pets.forEach((pet) => {
                            if (pet.active) {
                                petText = "[Lv" + getPetLevel(pet).level + "] " + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
                            }

                            petHover += "&7[Lv" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + "\n"
                        })

                        petHover = petHover.substr(0, petHover.length - 1)
                    } else {
                        petHover = "&cNo Pets!"
                    }

                    let pagemsg = new Message(new TextComponent(ChatLib.addColor("")))

                    let playerSkillHover

                    if (skillApiOff) {
                        playerSkillHover = "&c" + Math.floor(getPlayerSkill(0, playerTotalSlayer) * 1.5)
                    } else {
                        playerSkillHover = "&a" + getPlayerSkill(playerTotalSkillExp, playerTotalSlayer)
                    }


                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + playerData.data.player.displayname + "'s skyblock stats"))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Purse Coins: " + addNotation("oneLetters", playerProf.coin_purse)))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Bank Coins: " + (bankApiOff ? "API OFF" : addNotation("oneLetters", playerBankCoins))))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Skill Avg: " + (skillApiOff ? "API OFF" : playerSkillAvg)))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Total Slayer: " + (slayerApiOff ? "API OFF" : addNotation("oneLetters", playerTotalSlayer))))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Fairy souls: " + numberWithCommas(fairySouls)))
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Pet: " + petText))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor(playerData.data.player.displayname + "&7's skyblock stats"))
                    //         .setHover("show_text", ChatLib.addColor("&aPlayer skill: " + playerSkillHover))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))


                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Purse Coins: &7" + addNotation("oneLetters", playerProf.coin_purse)))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Bank Coins: &7" + (bankApiOff ? "API OFF" : addNotation("oneLetters", playerBankCoins))))
                    //         .setHover("show_text", ChatLib.addColor(bankHover))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Skill Avg: &7" + (skillApiOff ? "API OFF" : playerSkillAvg)))
                    //         .setHover("show_text", ChatLib.addColor(skillHover))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Total Slayer: &7" + (slayerApiOff ? "API OFF" : addNotation("oneLetters", playerTotalSlayer))))
                    //         .setHover("show_text", ChatLib.addColor(slayerHover))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Fairy souls: &7" + numberWithCommas(fairySouls)))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.addTextComponent(
                    //     new TextComponent(ChatLib.addColor("&3Pet: &7" + petText))
                    //         .setHover("show_text", ChatLib.addColor(petHover))
                    // )
                    // pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

                    // pagemsg.chat()
                    //book.addPage(pagemsg)

                    //book.display()
                } catch (err) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error: " + err))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", Error: " + err))
                    }
                }
            } catch (err) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Error: " + err))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", Error: " + err))
                }
            }
        }
        if (isSbgAdmin) {
            commandFunctions.guildrankschange = function(player, command, args) {
                if (player !== "Soopyboo32" && player !== "vNoxus" && player !== "alon1396" && player !== "Leyrox") {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you do not have permission to perform this command!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", you do not have permission to perform this command!"))
                    }
                    return;
                }
                let guildData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/guildData.json?key=lkRFxoMYwrkgovPRn2zt&guildName=" + "Skyblock Gods".replace(/ /gi, "%20").toLowerCase()))

                let loaded = true
                let loadedNum = 0
                guildData.data.members.forEach((m) => {
                    if (!m.loaded) {
                        loaded = false
                    } else {
                        loadedNum++
                    }
                })
                if (!loaded) {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", the lbs arnt fully loaded yet. try again later! (" + loadedNum + " / " + guildData.data.members.length + ")"))
                    return;
                }
                commandQueue.other.push(spamBypass("/gc @everyone, doing ranks update thing. this may cause some spam!"))

                let membersNeedChange = {}

                let membersSkillsSorted = guildData.data.members.sort((a, b) => { return a["skill-avg"] - b["skill-avg"] }).reverse().filter((m) => { return (m.guildRank == "Member" || m.guildRank == "Elite" || m.guildRank == "Skyblock God" || m.guildRank == "Skyblock King") })
                let membersSlayerSorted = guildData.data.members.sort((a, b) => { return a["total-slayer"] - b["total-slayer"] }).reverse().filter((m) => { return (m.guildRank == "Member" || m.guildRank == "Elite" || m.guildRank == "Skyblock God" || m.guildRank == "Skyblock King") })
                let membersDungsSorted = guildData.data.members.sort((a, b) => { return a["dungeon"] - b["dungeon"] }).reverse().filter((m) => { return (m.guildRank == "Member" || m.guildRank == "Elite" || m.guildRank == "Skyblock God" || m.guildRank == "Skyblock King") })

                let pos = 0
                membersSkillsSorted.forEach((p) => {
                    membersNeedChange[p.name] = "Member"
                    pos++
                    if (pos <= 3) {
                        if (membersNeedChange[p.name] === "Skyblock King" || membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock God"
                        }
                        return;
                    }
                    if (pos <= 10) {
                        if (membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock King"
                        }
                        return;
                    }
                    if (pos <= 25) {
                        if (membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Elite"
                        }
                        return;
                    }
                })
                pos = 0
                membersSlayerSorted.forEach((p) => {
                    pos++
                    if (pos <= 3) {
                        if (membersNeedChange[p.name] === "Skyblock King" || membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock God"
                        }
                        return;
                    }
                    if (pos <= 10) {
                        if (membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock King"
                        }
                        return;
                    }
                    if (pos <= 25) {
                        if (membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Elite"
                        }
                        return;
                    }
                })
                pos = 0
                membersDungsSorted.forEach((p) => {
                    pos++
                    if (pos <= 3) {
                        if (membersNeedChange[p.name] === "Skyblock King" || membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock God"
                        }
                        return;
                    }
                    if (pos <= 10) {
                        if (membersNeedChange[p.name] === "Elite" || membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Skyblock King"
                        }
                        return;
                    }
                    if (pos <= 25) {
                        if (membersNeedChange[p.name] === "Member") {
                            membersNeedChange[p.name] = "Elite"
                        }
                        return;
                    }
                })
                Object.keys(membersNeedChange).forEach((key) => {
                    //ChatLib.chat(key + " => " + membersNeedChange[key])
                    guildData.data.members.forEach((m) => {
                        if (m.name === key) {
                            if (membersNeedChange[key] !== m.guildRank) {
                                commandQueue.other.push("/g setrank " + key + " " + membersNeedChange[key])
                            }
                        }
                    })
                })
                commandQueue.other.push(spamBypass("/gc @everyone, finished updating ranks!"))
            }
        }

        commandFunctions.lowestbin = function(player, command, args) {
            let vals = {}

            args.forEach((arg) => {
                if (arg == "lowestbin") {
                    return;
                }
                Object.keys(lowestBins).forEach((lowestBin) => {
                    if (lowestBin.toLowerCase().includes(arg.toLowerCase())) {
                        if (vals[lowestBin] == undefined) { vals[lowestBin] = 0 }
                        vals[lowestBin]++
                            vals[lowestBin] -= 0.01 * lowestBin.length
                    }
                })
            })

            let topItem = undefined
            let topScore = 0;

            Object.keys(vals).forEach((val) => {
                if (vals[val] > topScore) {
                    topItem = val
                    topScore = vals[val]
                }
            })

            if (topItem === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot no auctions found!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", no auctions found!"))
                }
                return;
            }

            let itemName = topItem.replace(/_/g, " ").toLowerCase()
            itemName = itemName.substr(0, 1).toUpperCase() + itemName.substr(1)

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Cheapest bin for " + itemName + " is " + numberWithCommas(lowestBins[topItem]) + "!"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", Cheapest bin for " + itemName + " is " + numberWithCommas(lowestBins[topItem]) + "!"))
            }

        }

        commandFunctions.bazzar = function(player, command, args) {
            let vals = {}

            args.forEach((arg) => {
                if (arg == "bazzar") {
                    return;
                }
                Object.keys(bazaar).forEach((bazItem) => {
                    if (bazaar[bazItem].name.toLowerCase().includes(arg.toLowerCase())) {
                        if (vals[bazItem] == undefined) { vals[bazItem] = 0 }
                        vals[bazItem]++
                        vals[bazItem] -= 0.01 * bazaar[bazItem].name.length
                    }
                })
            })

            let topItem = undefined
            let topScore = 0;

            Object.keys(vals).forEach((val) => {
                if (vals[val] > topScore) {
                    topItem = val
                    topScore = vals[val]
                }
            })

            if (topItem === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot no item found!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", no item found!"))
                }
                return;
            }

            let itemName = bazaar[topItem].name

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Insta buy for " + itemName + " is " + numberWithCommas(Math.round(bazaar[topItem].buyPrice)) + " Insta sell is " + numberWithCommas(Math.round(bazaar[topItem].sellPrice)) + "!"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", Insta buy for " + itemName + " is " + numberWithCommas(Math.round(bazaar[topItem].buyPrice)) + " Insta sell is " + numberWithCommas(Math.round(bazaar[topItem].sellPrice)) + "!"))
            }

        }
        commandFunctions.help = function(player, command, args) {
            if (commandsSpeed > commandsSpeedLimit) {

            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + " DMing you the results, make sure to have your dms open :)"))
            }

            if (args[1] === undefined) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Possible commands are:"))
                Object.keys(commandFunctions).forEach((commandF) => {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + commandF))
                })
            } else {
                switch (args[1]) {
                    case "aliases":

                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Command aliases "))
                        Object.keys(commandAlias).forEach((alias) => {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + alias + " runs " + commandAlias[alias]))
                        })
                        break;

                    default:

                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot Help for command " + args[1]))
                        break;
                }
            }
        }
        commandFunctions.joke = function(player, command, args) {
            if (args[1] == "player") {
                if (args[2] == undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot requires 3 args!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", requires 3 args!"))
                    }
                    return;
                }
                if (args[3] == undefined) {
                    args[3] = ""
                }
                let joke = JSON.parse(FileLib.getUrlContent("http://api.icndb.com/jokes/random?firstName=" + args[2] + "&lastName=" + args[3] + "&escape=javascript"))
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke.value.joke))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke.value.joke))
                }
                return;
            }
            let type = "general"
            if (args[1] === undefined) { args[1] = "" }
            if (args[1].includes("prog")) { type = "programming" }
            let joke = JSON.parse(FileLib.getUrlContent("https://official-joke-api.appspot.com/jokes/" + type + "/random"))
            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke[0].setup))
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + joke[0].punchline))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke[0].setup))
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + joke[0].punchline))
            }
        }
        commandFunctions.math = function(player, command, args) {
            if(args === undefined){
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid equasion!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", invalid equasion!"))
                }
            }

            args.shift()
            
            let res = FileLib.getUrlContent("http://api.mathjs.org/v4/?expr=" + encodeURIComponent(args.join(" ")))

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + res))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + res))
            }
        }
        commandFunctions.networth = function(player, command, args) {
            if (args[1] === undefined) {
                args[1] = player
            }

            let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))
            try {
                let netWorth = 0
                let netWorthLast = 0


                function worthChangeVerift() {
                    if (netWorth.toString() === "NaN" || netWorth.toString() === "undefined") {
                        netWorth = netWorthLast
                    }
                    netWorthLast = netWorth
                }

                let items = []
                let pets = []

                Object.keys(data.profiles).forEach((profId) => {
                    let itemStorage = ["wardrobe_inventory", "inventory", "enderchest", "talisman_bag", "fishing_bag", "quiver", "potion_bag"]
                    let itemStorageReplace = {
                        "wardrobe": "wardrobe_inventory",
                        "ward": "wardrobe_inventory",
                        "invent": "inventory",
                        "inv": "inventory",
                        "ec": "enderchest",
                        "talis": "talisman_bag",
                        "fish": "fishing_bag",
                        "potion": "potion_bag"
                    }
                    itemStorage.forEach((itemLocation) => {
                        data.profiles[profId].items[itemLocation].forEach((item) => {
                            if (args[2] === undefined || args[2].toLowerCase() === itemLocation || itemStorageReplace[args[2].toLowerCase()] === itemLocation) {
                                items.push({...item, "location": itemLocation })
                            }
                        })
                    })
                    if (args[2] === undefined || args[2].toLowerCase() === "pets") {
                        data.profiles[profId].data.pets.forEach((pet) => {
                            pets.push(pet)
                        })
                    }

                    if (args[2] === undefined) {
                        netWorth += data.profiles[profId].raw.coin_purse
                        worthChangeVerift()
                        netWorth += data.profiles[profId].data.bank
                        worthChangeVerift()
                        netWorth += data.profiles[profId].data.slayer_coins_spent.total
                        worthChangeVerift()
                    }
                })
                items.forEach((item) => {
                    if (item.Count !== undefined) {
                        netWorth += getItemWorth(item)
                        worthChangeVerift()
                    }
                })
                pets.forEach((pet) => {
                    netWorth += getPetWorth(pet)
                    worthChangeVerift()
                })


                netWorth = addNotation("oneLetters", netWorth)

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (args[1] === player ? "You have" : args[1] + " has") + " a networth of $" + netWorth + "!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + (args[1] === player ? "You have" : args[1] + " has") + " a networth of $" + netWorth + "!"))
                }

            } catch (e) {
                console.log(JSON.stringify(e))
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error!"))
                }
            }
        }

        function getItemWorth(item) {
            let worth = 0;
            let worthLast = 0;

            function worthChangeVerift() {
                if (worth.toString() === "NaN" || worth.toString() === "undefined") {
                    worth = worthLast
                }
                worthLast = worth
            }

            try {
                if (item.tag.ExtraAttributes !== undefined) {
                    if (bazaar[item.tag.ExtraAttributes.id] === undefined) {
                        worth += getAverageLowestBin(item.tag.ExtraAttributes.id)
                    } else {
                        worth += bazaar[item.tag.ExtraAttributes.id].price
                    }
                    worthChangeVerift()
                    worth += bazaar.RECOMBOBULATOR_3000.price * item.tag.ExtraAttributes.rarity_upgrades
                    worthChangeVerift()
                    worth += bazaar.HOT_POTATO_BOOK.price * Math.min(10, item.tag.ExtraAttributes.hot_potato_count)
                    worthChangeVerift()
                    worth += bazaar.FUMING_POTATO_BOOK.price * Math.max(0, item.tag.ExtraAttributes.hot_potato_count - 10)
                    worthChangeVerift()
                    if(item.tag.ExtraAttributes.ability_scroll !== undefined){
                        item.tag.ExtraAttributes.ability_scroll.forEach((scrollId)=>{
                            worth += getAverageLowestBin(scrollId)
                            worthChangeVerift()
                        })
                    }
                    try {
                        item.tag.ExtraAttributes.enchantments.forEach((enchant) => {
                            worth += getAverageLowestBin(enchant + ";" + item.tag.ExtraAttributes.enchantments[enchant])
                            worthChangeVerift()
                        })
                    } catch (e) {}
                    if (reforgeToStone[item.tag.ExtraAttributes.modifier] !== undefined) {
                        worth += getAverageLowestBin(reforgeToStone[item.tag.ExtraAttributes.modifier].id)
                        worthChangeVerift()
                    }
                }
                //ChatLib.chat(item.tag.ExtraAttributes.id + ": " + lowestBinsAvg[item.tag.ExtraAttributes.id])
            } catch (e) {
                console.log(JSON.stringify(e))
            }

            if (item.containsItems !== undefined) {
                item.containsItems.forEach((item2) => {
                    if (item2.Count !== undefined) {
                        worth += getItemWorth(item2)
                    }
                })
            }

            return worth * item.Count;
        }

        function getAverageLowestBin(item){
            if(lowestBinsAvg[item] === undefined){
                return lowestBins[item]
            }else{
                return lowestBinsAvg[item]
            }
        }

        function getPetWorth(pet) {
            let worth = 0;
            let worthLast = 0;

            let petReplace = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"]

            function worthChangeVerift() {
                if (worth.toString() === "NaN" || worth.toString() === "undefined") {
                    worth = worthLast
                }
                worthLast = worth
            }

            try {
                worth += getAverageLowestBin(pet.type + ";" + petReplace.indexOf(pet.tier))
                worthChangeVerift()
                worth += getAverageLowestBin(pet.heldItem)
                worthChangeVerift()
                worth += getAverageLowestBin("PET_SKIN_" + pet.skin)
                worthChangeVerift()
                    //ChatLib.chat(item.tag.ExtraAttributes.id + ": " + lowestBinsAvg[item.tag.ExtraAttributes.id])
            } catch (e) {
                console.log(JSON.stringify(e))
            }

            //console.log(pet.type + " " + pet.tier + ": $" + addNotation("oneLetters", worth))
            return worth;
        }

        commandFunctions.missingpets = function(player, command, args) {
            if (args[1] === undefined) {
                args[1] = player
            }

            let data = JSON.parse(FileLib.getUrlContent("https://sky.shiiyu.moe/api/v2/profile/" + args[1]))

            let profile = ""
            Object.keys(data.profiles).forEach((profileId) => {
                if (data.profiles[profileId].current) {
                    profile = profileId
                }
            })

            let missingPets = data.profiles[profile].data.missingPets

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingPets.length + " pets!"))
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot (" + missingPets.slice(0, 5).map(pet => pet.display_name).join(" | ") + ")"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + (args[1] === player ? "You are" : args[1] + " is") + " missing " + missingPets.length + " pets!"))
                commandQueue.other.push(spamBypass("/gc @" + player + ", (" + missingPets.slice(0, 5).map(pet => pet.display_name).join(" | ") + ")"))
            }
        }
        commandFunctions.ehp = function(player, command, args) {
            if (args.length < 2) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot usage: /ehp [health] [defence]!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", usage: /ehp [health] [defence]!"))
                }
                return;
            }
            if (parseFloat[args[1]] > 0 || parseFloat[args[2]] > 0) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot usage: /ehp [health] [defence]!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", usage: /ehp [health] [defence]!"))
                }
                return;
            }

            let ehp = numberWithCommas(Math.round(parseFloat(args[1]) * ((parseFloat(args[2]) / 100) + 1)))
            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + ehp + " ehp!"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + ehp + " ehp!"))
            }
        }
        commandFunctions.commandspamfactor = function(player, command, args) {
            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot the current command spam amount is " + commandsSpeed.toFixed(2) + "!"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", the current command spam amount is " + commandsSpeed.toFixed(2) + "!"))
            }
        }
        commandFunctions.talismans = function(player, command, args) {
            let playerScan = player
            if (args[1] !== undefined) {
                playerScan = args[1]
            }

            let stats1 = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/players/" + playerScan))
            if (stats1.error === "Player does not exist") {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid player!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", invalid player!"))
                }
                return;
            }
            let stats = JSON.parse(FileLib.getUrlContent("https://api.slothpixel.me/api/skyblock/profile/" + playerScan))

            let talisData = {}

            let messageGChat = ""
            let message = []

            try {
                let uuid = stats1.uuid
                let playerName = stats1.username

                let talisData = stats.members[uuid].talisman_bag

                let totalTalis = 0
                let totalRecombedTalis = 0

                talisData.forEach((talis) => {
                    if (talis.attributes === undefined) {
                        return;
                    }
                    totalTalis++
                    totalRecombedTalis += talis.attributes.rarity_upgrades == 1 ? 1 : 0
                })

                messageGChat = playerName + " has a total of " + totalTalis + " talismans (" + totalRecombedTalis + " recombed)"
            } catch (err) {
                console.log(JSON.stringify(err))
                messageGChat = "There was a error :("
            }

            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + messageGChat))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + messageGChat))
            }

            message.forEach((mess) => {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + mess))
            })
        }
        commandFunctions.skill = function(player, command, args) {
            if (args[1] === undefined || args[2] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot requires 2 arguments!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", requires 2 arguments!"))
                }
                return;
            }
            let skillReplace = {
                "dungeon": "dungeoneering",
                "catacombs": "dungeoneering"
            }
            if (skillReplace[args[1]] !== undefined) {
                args[1] = skillReplace[args[1]]
            }

            if (skillData.collections[args[1].toUpperCase()] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill type!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill type!"))
                }
                return;
            }

            args[2] = parseInt(args[2]) - 1


            if (args[3] !== undefined) {
                args[3] = parseInt(args[3]) - 1

                if (skillData.collections[args[1].toUpperCase()].levels[args[3]] === undefined) {
                    if (commandsSpeed > commandsSpeedLimit) {
                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                    } else {
                        commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                    }
                    return;
                }

                let needExp = 0
                if (args[2] === -1) {
                    needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired)
                } else {

                    if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                        }
                        return;
                    }
                    needExp = addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[3]].totalExpRequired - skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired)
                }


                let expinfo = "it takes " + needExp + " exp to go from " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " -> " + (args[3] + 1)
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + expinfo))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", " + expinfo))
                }
                return;
            }
            if (skillData.collections[args[1].toUpperCase()].levels[args[2]] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid skill level!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", invalid skill level!"))
                }
                return;
            }

            if (commandsSpeed > commandsSpeedLimit) {

            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", dming u the results :)"))
            }

            Thread.sleep(500)

            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + firstLetterCapital(args[1].toLowerCase()) + " " + (args[2] + 1) + " (" + addNotation("oneLetters", skillData.collections[args[1].toUpperCase()].levels[args[2]].totalExpRequired) + " exp)"))
            skillData.collections[args[1].toUpperCase()].levels[args[2]].unlocks.forEach((unlock) => {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + unlock))
            })
        }
        commandFunctions.whatstone = function(player, command, args) {
            if (args[1] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot you need to specify what reforge!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", you need to specify what reforge!"))
                }
                return;
            }

            if (reforgeToStone[firstLetterCapital(args[1])] === undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot invalid reforge!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", invalid reforge!"))
                }
                return;
            }


            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + firstLetterCapital(args[1]) + " is from " + reforgeToStone[firstLetterCapital(args[1])].name + "!"))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", " + firstLetterCapital(args[1]) + " is from " + reforgeToStone[firstLetterCapital(args[1])].name + "!"))
            }
        }
        commandFunctions.amibetterthanagentlai = function(player, command, args) {
            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot no."))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", no."))
            }
        }
        commandFunctions.amiworsethanagentlai = function(player, command, args) {
            if (player.toLowerCase() === "symagical") {

                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot yes."))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", yes."))
                }
                return;
            }
            if (commandsSpeed > commandsSpeedLimit) {
                commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot no."))
            } else {
                commandQueue.other.push(spamBypass("/gc @" + player + ", no."))
            }
        }
        commandFunctions.lbpos = function(player, command, args) {
            if (args[1] == undefined) {
                if (commandsSpeed > commandsSpeedLimit) {
                    commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot requires lb type!"))
                } else {
                    commandQueue.other.push(spamBypass("/gc @" + player + ", requires lb type!"))
                }
            }

            let checkPerson = player
            let usesNumberPos = false

            let response = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/guildData.json?key=lkRFxoMYwrkgovPRn2zt&guildName=" + "Skyblock Gods".replace(/ /gi, "%20").toLowerCase()))

            let loaded = true
            let loadedNum = 0
            response.data.members.forEach((m) => {
                if (m["total-slayer"] === undefined) {
                    loaded = false
                } else {
                    loadedNum++
                }
            })
            if (!loaded) {
                commandQueue.other.push(spamBypass("/gc @" + player + ", the lbs arnt fully loaded yet. try again later! (" + loadedNum + " / " + response.data.members.length + ")"))
                return;
            }

            if (args[2] !== undefined) {

                checkPerson = args[2]

                let validPlayer = false
                response.data.members.forEach((p) => {
                    if (!p.loaded) { return; }
                    if (p.name.toLowerCase() == checkPerson.toLowerCase()) {
                        validPlayer = true
                    }
                })

                if (!validPlayer) {
                    if (parseInt(checkPerson) < 126) {
                        usesNumberPos = true
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot the person " + checkPerson + " is not in the guild!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", the person " + checkPerson + " is not in the guild!"))
                        }
                        return;
                    }
                }

            }

            let unloadedMembs = 0;
            let totalMembs = 0;

            let lbtypeReplace = {
                "skills": "skill",
                "dungeon": "catacombs",
                "dungeons": "catacombs",
                "catacombs": "catacombs",
                "dung": "catacombs",
                "dungs": "catacombs",
                "slayers": "slayer",
                "guildexp": "gexp"
            }

            if (args[3] === "excludestaff") {
                response.data.members = response.data.members.filter((m) => { return (m.guildRank == "Member" || m.guildRank == "Elite" || m.guildRank == "Skyblock God" || m.guildRank == "Skyblock King") })
            }

            switch (lbtypeReplace[args[1].toLowerCase()] || args[1].toLowerCase()) {

                case "skill":
                    if (response.success) {
                        response.data.members.forEach((memb) => {
                            if (!memb.loaded) {
                                unloadedMembs++
                            }
                            totalMembs++
                        })
                        let membersSorted = response.data.members.sort((a, b) => { return a["skill-avg"] - b["skill-avg"] })

                        let pos = totalMembs
                        membersSorted.forEach((p) => {
                            if (!p.loaded) { return; }
                            if (usesNumberPos) {
                                if (pos == parseInt(checkPerson)) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the skill lb! (" + p["skill-avg"].toFixed(2) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the skill lb! (" + p["skill-avg"].toFixed(2) + ")"))
                                    }
                                }
                            } else {
                                if (p.name.toLowerCase() == checkPerson.toLowerCase()) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the skill lb! (" + p["skill-avg"].toFixed(2) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the skill lb! (" + p["skill-avg"].toFixed(2) + ")"))
                                    }
                                }
                            }
                            pos--
                        })
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error!"))
                        }
                    }
                    break;
                case "slayer":
                    if (response.success) {
                        response.data.members.forEach((memb) => {
                            if (!memb.loaded) {
                                unloadedMembs++
                            }
                            totalMembs++
                        })
                        let membersSorted = response.data.members.sort((a, b) => { return a["total-slayer"] - b["total-slayer"] })

                        let pos = totalMembs
                        membersSorted.forEach((p) => {
                            if (!p.loaded) { return; }
                            if (usesNumberPos) {
                                if (pos == parseInt(checkPerson)) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the slayer lb! (" + addNotation("oneLetters", p["total-slayer"]) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the slayer lb! (" + addNotation("oneLetters", p["total-slayer"]) + ")"))
                                    }
                                }
                            } else {
                                if (p.name.toLowerCase() == checkPerson.toLowerCase()) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the slayer lb! (" + addNotation("oneLetters", p["total-slayer"]) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the slayer lb! (" + addNotation("oneLetters", p["total-slayer"]) + ")"))
                                    }
                                }
                            }
                            pos--
                        })
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error!"))
                        }
                    }
                    break;
                case "catacombs":
                    if (response.success) {
                        response.data.members.forEach((memb) => {
                            if (!memb.loaded) {
                                unloadedMembs++
                            }
                            totalMembs++
                        })
                        let membersSorted = response.data.members.sort((a, b) => { return a["dungeon"] - b["dungeon"] })

                        let pos = totalMembs
                        membersSorted.forEach((p) => {
                            if (!p.loaded) { return; }
                            if (usesNumberPos) {
                                if (pos == parseInt(checkPerson)) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the catacombs lb! (" + p["dungeon"].toFixed(2) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the catacombs lb! (" + p["dungeon"].toFixed(2) + ")"))
                                    }
                                }
                            } else {
                                if (p.name.toLowerCase() == checkPerson.toLowerCase()) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the catacombs lb! (" + p["dungeon"].toFixed(2) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the catacombs lb! (" + p["dungeon"].toFixed(2) + ")"))
                                    }
                                }
                            }
                            pos--
                        })
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error!"))
                        }
                    }
                    break;
                case "gexp":
                    if (response.success) {
                        response.data.members.forEach((memb) => {
                            if (!memb.loaded) {
                                unloadedMembs++
                            }
                            totalMembs++
                        })
                        let membersSorted = response.data.members.sort((a, b) => { return a["gExp"] - b["gExp"] })

                        let pos = totalMembs
                        membersSorted.forEach((p) => {
                            if (!p.loaded) { return; }
                            if (usesNumberPos) {
                                if (pos == parseInt(checkPerson)) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the gexp lb! (" + addNotation("oneLetters", p["gExp"]) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the gexp lb! (" + addNotation("oneLetters", p["gExp"]) + ")"))
                                    }
                                }
                            } else {
                                if (p.name.toLowerCase() == checkPerson.toLowerCase()) {
                                    if (commandsSpeed > commandsSpeedLimit) {
                                        commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the gexp lb! (" + addNotation("oneLetters", p["gExp"]) + ")"))
                                    } else {
                                        commandQueue.other.push(spamBypass("/gc @" + player + ", " + (player.toLowerCase() == checkPerson.toLowerCase() ? "you are" : p.name + " is") + " #" + pos + " on the gexp lb! (" + addNotation("oneLetters", p["gExp"]) + ")"))
                                    }
                                }
                            }
                            pos--
                        })
                    } else {
                        if (commandsSpeed > commandsSpeedLimit) {
                            commandQueue.dm.push(spamBypass("/msg " + player + " @sbgbot there was an error!"))
                        } else {
                            commandQueue.other.push(spamBypass("/gc @" + player + ", there was an error!"))
                        }
                    }
                    break;
            }
        }




        const chars = [
            "⭍",
            "ࠀ"
        ]
        const spamBypass = message => {
            for (let i = 0; i < (256 - message.length); i++) {
                let char = chars[Math.floor(Math.random() * chars.length)];
                message += char;
            }
            return message
        }

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

        var sha256 = function a(b) {
            function c(a, b) { return a >>> b | a << 32 - b }
            for (var d, e, f = Math.pow, g = f(2, 32), h = "length", i = "", j = [], k = 8 * b[h], l = a.h = a.h || [], m = a.k = a.k || [], n = m[h], o = {}, p = 2; 64 > n; p++)
                if (!o[p]) {
                    for (d = 0; 313 > d; d += p) o[d] = p;
                    l[n] = f(p, .5) * g | 0, m[n++] = f(p, 1 / 3) * g | 0
                }
            for (b += "\x80"; b[h] % 64 - 56;) b += "\x00";
            for (d = 0; d < b[h]; d++) {
                if (e = b.charCodeAt(d), e >> 8) return;
                j[d >> 2] |= e << (3 - d) % 4 * 8
            }
            for (j[j[h]] = k / g | 0, j[j[h]] = k, e = 0; e < j[h];) {
                var q = j.slice(e, e += 16),
                    r = l;
                for (l = l.slice(0, 8), d = 0; 64 > d; d++) {
                    var s = q[d - 15],
                        t = q[d - 2],
                        u = l[0],
                        v = l[4],
                        w = l[7] + (c(v, 6) ^ c(v, 11) ^ c(v, 25)) + (v & l[5] ^ ~v & l[6]) + m[d] + (q[d] = 16 > d ? q[d] : q[d - 16] + (c(s, 7) ^ c(s, 18) ^ s >>> 3) + q[d - 7] + (c(t, 17) ^ c(t, 19) ^ t >>> 10) | 0),
                        x = (c(u, 2) ^ c(u, 13) ^ c(u, 22)) + (u & l[1] ^ u & l[2] ^ l[1] & l[2]);
                    l = [w + x | 0].concat(l), l[4] = l[4] + w | 0
                }
                for (d = 0; 8 > d; d++) l[d] = l[d] + r[d] | 0
            }
            for (d = 0; 8 > d; d++)
                for (e = 3; e + 1; e--) {
                    var y = l[d] >> 8 * e & 255;
                    i += (16 > y ? 0 : "") + y.toString(16)
                }
            return i
        };


        var timeSince = function(date) {
            if (typeof date !== 'object') {
                date = new Date(date);
            }

            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                interval = seconds;
                                intervalType = "second";
                            }
                        }
                    }
                }
            }

            if (interval > 1 || interval === 0) {
                intervalType += 's';
            }

            return interval + ' ' + intervalType;
        };

        function getLevelByXp(xp, type, levelCap) {
            let xp_table =
              type == 1
                ? someData.runecrafting_xp
                : type == 2
                  ? someData.dungeoneering_xp
                  : someData.leveling_xp;
          
            if (isNaN(xp)) {
              return {
                xp: 0,
                level: 0,
                xpCurrent: 0,
                xpForNext: xp_table[1],
                progress: 0,
              };
            }
          
            let xpTotal = 0;
            let level = 0;
          
            let xpForNext = Infinity;
          
            let maxLevel = Math.min(levelCap,Object.keys(xp_table)
              .sort((a, b) => Number(a) - Number(b))
              .map((a) => Number(a))
              .pop())
          
            for (let x = 1; x <= maxLevel; x++) {
              xpTotal += xp_table[x];
          
              if (xpTotal > xp) {
                xpTotal -= xp_table[x];
                break;
              } else {
                level = x;
              }
            }
          
            let xpCurrent = Math.floor(xp - xpTotal);
          
            if (level < maxLevel) xpForNext = Math.ceil(xp_table[level + 1]);
          
            let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
          
            return {
              xp,
              level,
              maxLevel,
              xpCurrent,
              xpForNext,
              progress,
            };
          }
        let skillLevelCaps = {
            "experience_skill_combat": 50,
            "experience_skill_foraging": 50,
            "experience_skill_farming": 60,
            "experience_skill_fishing": 50,
            "experience_skill_alchemy": 50,
            "experience_skill_enchanting": 60,
            "experience_skill_mining": 60,
            "experience_skill_taming": 50,
          }
        let someData = {
            leveling_xp: {
                1: 50,
                2: 125,
                3: 200,
                4: 300,
                5: 500,
                6: 750,
                7: 1000,
                8: 1500,
                9: 2000,
                10: 3500,
                11: 5000,
                12: 7500,
                13: 10000,
                14: 15000,
                15: 20000,
                16: 30000,
                17: 50000,
                18: 75000,
                19: 100000,
                20: 200000,
                21: 300000,
                22: 400000,
                23: 500000,
                24: 600000,
                25: 700000,
                26: 800000,
                27: 900000,
                28: 1000000,
                29: 1100000,
                30: 1200000,
                31: 1300000,
                32: 1400000,
                33: 1500000,
                34: 1600000,
                35: 1700000,
                36: 1800000,
                37: 1900000,
                38: 2000000,
                39: 2100000,
                40: 2200000,
                41: 2300000,
                42: 2400000,
                43: 2500000,
                44: 2600000,
                45: 2750000,
                46: 2900000,
                47: 3100000,
                48: 3400000,
                49: 3700000,
                50: 4000000,
                51: 4300000,
                52: 4600000,
                53: 4900000,
                54: 5200000,
                55: 5500000,
                56: 5800000,
                57: 6100000,
                58: 6400000,
                59: 6700000,
                60: 7000000
              },

            // XP required for each level of Runecrafting
            runecrafting_xp: {
                1: 50,
                2: 100,
                3: 125,
                4: 160,
                5: 200,
                6: 250,
                7: 315,
                8: 400,
                9: 500,
                10: 625,
                11: 785,
                12: 1000,
                13: 1250,
                14: 1600,
                15: 2000,
                16: 2465,
                17: 3125,
                18: 4000,
                19: 5000,
                20: 6200,
                21: 7800,
                22: 9800,
                23: 12200,
                24: 15300,
                25: 19050
            },

            dungeoneering_xp: {
                1: 50,
                2: 75,
                3: 110,
                4: 160,
                5: 230,
                6: 330,
                7: 470,
                8: 670,
                9: 950,
                10: 1340,
                11: 1890,
                12: 2665,
                13: 3760,
                14: 5260,
                15: 7380,
                16: 10300,
                17: 14400,
                18: 20000,
                19: 27600,
                20: 38000,
                21: 52500,
                22: 71500,
                23: 97000,
                24: 132000,
                25: 180000,
                26: 243000,
                27: 328000,
                28: 445000,
                29: 600000,
                30: 800000,
                31: 1065000,
                32: 1410000,
                33: 1900000,
                34: 2500000,
                35: 3300000,
                36: 4300000,
                37: 5600000,
                38: 7200000,
                39: 9200000,
                40: 12000000,
                41: 15000000,
                42: 19000000,
                43: 24000000,
                44: 30000000,
                45: 38000000,
                46: 48000000,
                47: 60000000,
                48: 75000000,
                49: 93000000,
                50: 116250000
            },

            guild_xp: [
                100000,
                150000,
                250000,
                500000,
                750000,
                1000000,
                1250000,
                1500000,
                2000000,
                2500000,
                2500000,
                2500000,
                2500000,
                2500000,
                3000000
            ],

            // total XP required for level of Slayer
            slayer_xp: {
                zombie: {
                    1: 5,
                    2: 15,
                    3: 200,
                    4: 1000,
                    5: 5000,
                    6: 20000,
                    7: 100000,
                    8: 400000,
                    9: 1000000
                },
                spider: {
                    1: 5,
                    2: 15,
                    3: 200,
                    4: 1000,
                    5: 5000,
                    6: 20000,
                    7: 100000,
                    8: 400000,
                    9: 1000000
                },
                wolf: {
                    1: 5,
                    2: 15,
                    3: 200,
                    4: 1500,
                    5: 5000,
                    6: 20000,
                    7: 100000,
                    8: 400000,
                    9: 1000000
                }
            },

            slayer_boss_xp: {
                1: 5,
                2: 25,
                3: 100,
                4: 500
            }
        };

        function firstLetterCapital(string) {
            return string.substr(0, 1).toUpperCase() + string.substr(1)
        }

        function firstLetterWordCapital(string) {
            let retString = ""
            string.split(" ").forEach((str) => { retString += " " + firstLetterCapital(str) })
            return retString.substr(1);
        }

        let tierBoostChange = {
            "COMMON": "UNCOMMON",
            "UNCOMMON": "RARE",
            "RARE": "EPIC",
            "EPIC": "LEGENDARY",
            "LEGENDARY": "LEGENDARY"
        }

        function getPetLevel(pet) {
            const rarityOffset = constants.pet_rarity_offset[pet.tier.toLowerCase()];
            const levels = constants.pet_levels.slice(rarityOffset, rarityOffset + 99);

            const xpMaxLevel = levels.reduce((a, b) => a + b, 0)
            let xpTotal = 0;
            let level = 1;

            let xpForNext;

            for (let i = 0; i < 100; i++) {
                xpTotal += levels[i];

                if (xpTotal > pet.exp) {
                    xpTotal -= levels[i];
                    break;
                } else {
                    level++;
                }
            }

            let xpCurrent = Math.floor(pet.exp - xpTotal);
            let progress;

            if (level < 100) {
                xpForNext = Math.ceil(levels[level - 1]);
                progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
            } else {
                level = 100;
                xpCurrent = pet.exp - levels[99];
                xpForNext = 0;
                progress = 1;
            }

            return {
                level,
                xpCurrent,
                xpForNext,
                progress,
                xpMaxLevel
            };
        }

        let constants = {
            pet_rarity_offset: {
                common: 0,
                uncommon: 6,
                rare: 11,
                epic: 16,
                legendary: 20
            },

            pet_levels: [
                100,
                110,
                120,
                130,
                145,
                160,
                175,
                190,
                210,
                230,
                250,
                275,
                300,
                330,
                360,
                400,
                440,
                490,
                540,
                600,
                660,
                730,
                800,
                880,
                960,
                1050,
                1150,
                1260,
                1380,
                1510,
                1650,
                1800,
                1960,
                2130,
                2310,
                2500,
                2700,
                2920,
                3160,
                3420,
                3700,
                4000,
                4350,
                4750,
                5200,
                5700,
                6300,
                7000,
                7800,
                8700,
                9700,
                10800,
                12000,
                13300,
                14700,
                16200,
                17800,
                19500,
                21300,
                23200,
                25200,
                27400,
                29800,
                32400,
                35200,
                38200,
                41400,
                44800,
                48400,
                52200,
                56200,
                60400,
                64800,
                69400,
                74200,
                79200,
                84700,
                90700,
                97200,
                104200,
                111700,
                119700,
                128200,
                137200,
                146700,
                156700,
                167700,
                179700,
                192700,
                206700,
                221700,
                237700,
                254700,
                272700,
                291700,
                311700,
                333700,
                357700,
                383700,
                411700,
                441700,
                476700,
                516700,
                561700,
                611700,
                666700,
                726700,
                791700,
                861700,
                936700,
                1016700,
                1101700,
                1191700,
                1286700,
                1386700,
                1496700,
                1616700,
                1746700,
                1886700
            ],

            pet_levels_accum: [
                100,
                110,
                120,
                130,
                145,
                160,
                175,
                190,
                210,
                230,
                250,
                275,
                300,
                330,
                360,
                400,
                440,
                490,
                540,
                600,
                660,
                730,
                800,
                880,
                960,
                1050,
                1150,
                1260,
                1380,
                1510,
                1650,
                1800,
                1960,
                2130,
                2310,
                2500,
                2700,
                2920,
                3160,
                3420,
                3700,
                4000,
                4350,
                4750,
                5200,
                5700,
                6300,
                7000,
                7800,
                8700,
                9700,
                10800,
                12000,
                13300,
                14700,
                16200,
                17800,
                19500,
                21300,
                23200,
                25200,
                27400,
                29800,
                32400,
                35200,
                38200,
                41400,
                44800,
                48400,
                52200,
                56200,
                60400,
                64800,
                69400,
                74200,
                79200,
                84700,
                90700,
                97200,
                104200,
                111700,
                119700,
                128200,
                137200,
                146700,
                156700,
                167700,
                179700,
                192700,
                206700,
                221700,
                237700,
                254700,
                272700,
                291700,
                311700,
                333700,
                357700,
                383700,
                411700,
                441700,
                476700,
                516700,
                561700,
                611700,
                666700,
                726700,
                791700,
                861700,
                936700,
                1016700,
                1101700,
                1191700,
                1286700,
                1386700,
                1496700,
                1616700,
                1746700,
                1886700
            ],

            pet_data: {
                "BAT": {
                    head: "/head/382fc3f71b41769376a9e92fe3adbaac3772b999b219c9d6b4680ba9983e527",
                    type: "mining",
                    emoji: "🦇"
                },
                "BLAZE": {
                    head: "/head/b78ef2e4cf2c41a2d14bfde9caff10219f5b1bf5b35a49eb51c6467882cb5f0",
                    type: "combat",
                    emoji: "🔥"
                },
                "CHICKEN": {
                    head: "/head/7f37d524c3eed171ce149887ea1dee4ed399904727d521865688ece3bac75e",
                    type: "farming",
                    emoji: "🐔"
                },
                "HORSE": {
                    head: "/head/36fcd3ec3bc84bafb4123ea479471f9d2f42d8fb9c5f11cf5f4e0d93226",
                    type: "combat",
                    emoji: "🐴"
                },
                "JERRY": {
                    head: "/head/822d8e751c8f2fd4c8942c44bdb2f5ca4d8ae8e575ed3eb34c18a86e93b",
                    type: "combat",
                    emoji: "🧑"
                },
                "OCELOT": {
                    head: "/head/5657cd5c2989ff97570fec4ddcdc6926a68a3393250c1be1f0b114a1db1",
                    type: "foraging",
                    emoji: "🐈"
                },
                "PIGMAN": {
                    head: "/head/63d9cb6513f2072e5d4e426d70a5557bc398554c880d4e7b7ec8ef4945eb02f2",
                    type: "combat",
                    emoji: "🐷"
                },
                "RABBIT": {
                    head: "/head/117bffc1972acd7f3b4a8f43b5b6c7534695b8fd62677e0306b2831574b",
                    type: "farming",
                    emoji: "🐇"
                },
                "SHEEP": {
                    head: "/head/64e22a46047d272e89a1cfa13e9734b7e12827e235c2012c1a95962874da0",
                    type: "alchemy",
                    emoji: "🐑"
                },
                "SILVERFISH": {
                    head: "/head/da91dab8391af5fda54acd2c0b18fbd819b865e1a8f1d623813fa761e924540",
                    type: "mining",
                    emoji: "🐛"
                },
                "WITHER_SKELETON": {
                    head: "/head/f5ec964645a8efac76be2f160d7c9956362f32b6517390c59c3085034f050cff",
                    type: "mining",
                    emoji: "💀"
                },
                "SKELETON_HORSE": {
                    head: "/head/47effce35132c86ff72bcae77dfbb1d22587e94df3cbc2570ed17cf8973a",
                    type: "combat",
                    emoji: "🐴"
                },
                "WOLF": {
                    head: "/head/dc3dd984bb659849bd52994046964c22725f717e986b12d548fd169367d494",
                    type: "combat",
                    emoji: "🐺"
                },
                "ENDERMAN": {
                    head: "/head/6eab75eaa5c9f2c43a0d23cfdce35f4df632e9815001850377385f7b2f039ce1",
                    type: "combat",
                    emoji: "🔮"
                },
                "PHOENIX": {
                    head: "/head/23aaf7b1a778949696cb99d4f04ad1aa518ceee256c72e5ed65bfa5c2d88d9e",
                    type: "combat",
                    emoji: "🐦"
                },
                "MAGMA_CUBE": {
                    head: "/head/38957d5023c937c4c41aa2412d43410bda23cf79a9f6ab36b76fef2d7c429",
                    type: "combat",
                    emoji: "🌋"
                },
                "FLYING_FISH": {
                    head: "/head/40cd71fbbbbb66c7baf7881f415c64fa84f6504958a57ccdb8589252647ea",
                    type: "fishing",
                    emoji: "🐟"
                },
                "BLUE_WHALE": {
                    head: "/head/dab779bbccc849f88273d844e8ca2f3a67a1699cb216c0a11b44326ce2cc20",
                    type: "fishing",
                    emoji: "🐋"
                },
                "TIGER": {
                    head: "/head/fc42638744922b5fcf62cd9bf27eeab91b2e72d6c70e86cc5aa3883993e9d84",
                    type: "combat",
                    emoji: "🐯"
                },
                "LION": {
                    head: "/head/38ff473bd52b4db2c06f1ac87fe1367bce7574fac330ffac7956229f82efba1",
                    type: "foraging",
                    emoji: "🦁"
                },
                "PARROT": {
                    head: "/head/5df4b3401a4d06ad66ac8b5c4d189618ae617f9c143071c8ac39a563cf4e4208",
                    type: "alchemy",
                    emoji: "🦜"
                },
                "SNOWMAN": {
                    head: "/head/11136616d8c4a87a54ce78a97b551610c2b2c8f6d410bc38b858f974b113b208",
                    type: "combat",
                    emoji: "⛄"
                },
                "TURTLE": {
                    head: "/head/212b58c841b394863dbcc54de1c2ad2648af8f03e648988c1f9cef0bc20ee23c",
                    type: "combat",
                    emoji: "🐢"
                },
                "BEE": {
                    head: "/head/7e941987e825a24ea7baafab9819344b6c247c75c54a691987cd296bc163c263",
                    type: "farming",
                    emoji: "🐝"
                },
                "ENDER_DRAGON": {
                    head: "/head/aec3ff563290b13ff3bcc36898af7eaa988b6cc18dc254147f58374afe9b21b9",
                    type: "combat",
                    emoji: "🐲"
                },
                "GUARDIAN": {
                    head: "/head/221025434045bda7025b3e514b316a4b770c6faa4ba9adb4be3809526db77f9d",
                    type: "combat",
                    emoji: "🐡"
                },
                "SQUID": {
                    head: "/head/01433be242366af126da434b8735df1eb5b3cb2cede39145974e9c483607bac",
                    type: "fishing",
                    emoji: "🦑"
                },
                "GIRAFFE": {
                    head: "/head/176b4e390f2ecdb8a78dc611789ca0af1e7e09229319c3a7aa8209b63b9",
                    type: "foraging",
                    emoji: "🦒"
                },
                "ELEPHANT": {
                    head: "/head/7071a76f669db5ed6d32b48bb2dba55d5317d7f45225cb3267ec435cfa514",
                    type: "farming",
                    emoji: "🐘"
                },
                "MONKEY": {
                    head: "/head/13cf8db84807c471d7c6922302261ac1b5a179f96d1191156ecf3e1b1d3ca",
                    type: "foraging",
                    emoji: "🐒"
                },
                "SPIDER": {
                    head: "/head/cd541541daaff50896cd258bdbdd4cf80c3ba816735726078bfe393927e57f1",
                    type: "combat",
                    emoji: "🕷️"
                },
                "ENDERMITE": {
                    head: "/head/5a1a0831aa03afb4212adcbb24e5dfaa7f476a1173fce259ef75a85855",
                    type: "mining",
                    emoji: "🐛"
                },
                "GHOUL": {
                    head: "/head/87934565bf522f6f4726cdfe127137be11d37c310db34d8c70253392b5ff5b",
                    type: "combat",
                    emoji: "🧟"
                },
                "JELLYFISH": {
                    head: "/head/913f086ccb56323f238ba3489ff2a1a34c0fdceeafc483acff0e5488cfd6c2f1",
                    type: "alchemy",
                    emoji: "🎐"
                },
                "PIG": {
                    head: "/head/621668ef7cb79dd9c22ce3d1f3f4cb6e2559893b6df4a469514e667c16aa4",
                    type: "farming",
                    emoji: "🐷"
                },
                "ROCK": {
                    head: "/head/cb2b5d48e57577563aca31735519cb622219bc058b1f34648b67b8e71bc0fa",
                    type: "mining",
                    emoji: "🗿"
                },
                "SKELETON": {
                    head: "/head/fca445749251bdd898fb83f667844e38a1dff79a1529f79a42447a0599310ea4",
                    type: "combat",
                    emoji: "💀"
                },
                "ZOMBIE": {
                    head: "/head/56fc854bb84cf4b7697297973e02b79bc10698460b51a639c60e5e417734e11",
                    type: "combat",
                    emoji: "🧟"
                },
                "DOLPHIN": {
                    head: "/head/cefe7d803a45aa2af1993df2544a28df849a762663719bfefc58bf389ab7f5",
                    type: "fishing",
                    emoji: "🐬"
                },
                "BABY_YETI": {
                    head: "/head/ab126814fc3fa846dad934c349628a7a1de5b415021a03ef4211d62514d5",
                    type: "fishing",
                    emoji: "❄️"
                },
                "GOLEM": {
                    head: "/head/89091d79ea0f59ef7ef94d7bba6e5f17f2f7d4572c44f90f76c4819a714",
                    type: "combat",
                    emoji: "🗿"
                },
                "HOUND": {
                    head: "/head/b7c8bef6beb77e29af8627ecdc38d86aa2fea7ccd163dc73c00f9f258f9a1457",
                    type: "combat",
                    emoji: "👹"
                },
                "TARANTULA": {
                    head: "/head/8300986ed0a04ea79904f6ae53f49ed3a0ff5b1df62bba622ecbd3777f156df8",
                    type: "combat",
                    emoji: "🕸️"
                },
                "BLACK_CAT": {
                    head: "/head/e4b45cbaa19fe3d68c856cd3846c03b5f59de81a480eec921ab4fa3cd81317",
                    type: "combat",
                    emoji: "🐱"
                },
                "MEGALODON": {
                    head: null,
                    type: "combat",
                    emoji: "🐬"
                }
            },

            pet_value: {
                "common": 1,
                "uncommon": 2,
                "rare": 3,
                "epic": 4,
                "legendary": 5
            },

            pet_rewards: {
                0: {
                    magic_find: 0
                },
                10: {
                    magic_find: 1
                },
                25: {
                    magic_find: 2
                },
                50: {
                    magic_find: 3
                },
                75: {
                    magic_find: 4
                },
                100: {
                    magic_find: 5
                },
                130: {
                    magic_find: 6
                },
                175: {
                    magic_find: 7
                }
            },

            pet_items: {
                PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
                    description: "§7Gives +§a10% §7pet exp for all skills",
                    xpBoost: 0.1,
                    xpBoostType: "all"
                },
                PET_ITEM_BIG_TEETH_COMMON: {
                    description: "§7Increases §9Crit Chance §7by §a5%",
                    stats: {
                        crit_chance: 5
                    },
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_IRON_CLAWS_COMMON: {
                    description: "§7Increases the pet's §9Crit Damage §7by §a40% §7and §9Crit Chance §7by §a40%",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
                    description: "§7Increases §9Crit Damage §7by §a15%",
                    stats: {
                        crit_damage: 15
                    },
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_HARDENED_SCALES_UNCOMMON: {
                    description: "§7Increases §aDefense §7by §a25",
                    stats: {
                        defense: 25
                    },
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_BUBBLEGUM: {
                    description: "§7Your pet fuses its power with placed §aOrbs §7to give them §a2x §7duration",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_LUCKY_CLOVER: {
                    description: "§7Increases §bMagic Find §7by §a7",
                    stats: {
                        magic_find: 7
                    },
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_TEXTBOOK: {
                    description: "§7Increases the pet's §bIntelligence §7by §a100%",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_SADDLE: {
                    description: "§7Increase horse speed by §a50% §7 and jump boost by §a100%",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_EXP_SHARE: {
                    description: "§7While unequipped this pet gains §a25% §7of the equipped pet's xp, this is §7split between all pets holding the item.",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_TIER_BOOST: {
                    description: "§7Boosts the §ararity §7of your pet by 1 tier!",
                    xpBoost: 0,
                    xpBoostType: "all"
                },
                PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
                    description: "§7Gives +§a20% §7pet exp for Combat",
                    xpBoost: 0.2,
                    xpBoostType: "combat"
                },
                PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
                    description: "§7Gives +§a30% §7pet exp for Combat",
                    xpBoost: 0.3,
                    xpBoostType: "combat"
                },
                PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
                    description: "§7Gives +§a40% §7pet exp for Combat",
                    xpBoost: 0.4,
                    xpBoostType: "combat"
                },
                PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
                    description: "§7Gives +§a50% §7pet exp for Combat",
                    xpBoost: 0.5,
                    xpBoostType: "combat"
                },
                PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
                    description: "§7Gives +§a20% §7pet exp for Fishing",
                    xpBoost: 0.2,
                    xpBoostType: "fishing"
                },
                PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
                    description: "§7Gives +§a30% §7pet exp for Fishing",
                    xpBoost: 0.3,
                    xpBoostType: "fishing"
                },
                PET_ITEM_FISHING_SKILL_BOOST_RARE: {
                    description: "§7Gives +§a40% §7pet exp for Fishing",
                    xpBoost: 0.4,
                    xpBoostType: "fishing"
                },
                PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
                    description: "§7Gives +§a50% §7pet exp for Fishing",
                    xpBoost: 0.5,
                    xpBoostType: "fishing"
                },
                PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
                    description: "§7Gives +§a20% §7pet exp for Foraging",
                    xpBoost: 0.2,
                    xpBoostType: "foraging"
                },
                PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
                    description: "§7Gives +§a30% §7pet exp for Foraging",
                    xpBoost: 0.3,
                    xpBoostType: "foraging"
                },
                PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
                    description: "§7Gives +§a40% §7pet exp for Foraging",
                    xpBoost: 0.4,
                    xpBoostType: "foraging"
                },
                PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
                    description: "§7Gives +§a50% §7pet exp for Foraging",
                    xpBoost: 0.5,
                    xpBoostType: "foraging"
                },
                PET_ITEM_MINING_SKILL_BOOST_COMMON: {
                    description: "§7Gives +§a20% §7pet exp for Mining",
                    xpBoost: 0.2,
                    xpBoostType: "mining"
                },
                PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
                    description: "§7Gives +§a30% §7pet exp for Mining",
                    xpBoost: 0.3,
                    xpBoostType: "mining"
                },
                PET_ITEM_MINING_SKILL_BOOST_RARE: {
                    description: "§7Gives +§a40% §7pet exp for Mining",
                    xpBoost: 0.4,
                    xpBoostType: "mining"
                },
                PET_ITEM_MINING_SKILL_BOOST_EPIC: {
                    description: "§7Gives +§a50% §7pet exp for Mining",
                    xpBoost: 0.5,
                    xpBoostType: "mining"
                },
                PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
                    description: "§7Gives +§a20% §7pet exp for Farming",
                    xpBoost: 0.2,
                    xpBoostType: "farming"
                },
                PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
                    description: "§7Gives +§a30% §7pet exp for Farming",
                    xpBoost: 0.3,
                    xpBoostType: "farming"
                },
                PET_ITEM_FARMING_SKILL_BOOST_RARE: {
                    description: "§7Gives +§a40% §7pet exp for Farming",
                    xpBoost: 0.4,
                    xpBoostType: "farming"
                },
                PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
                    description: "§7Gives +§a50% §7pet exp for Farming",
                    xpBoost: 0.5,
                    xpBoostType: "farming"
                }
            },
            talismans: {
                talisman_upgrades: {
                    WOLF_TALISMAN: [
                        'WOLF_RING'
                    ],
                    RING_POTION_AFFINITY: [
                        'ARTIFACT_POTION_AFFINITY'
                    ],
                    POTION_AFFINITY_TALISMAN: [
                        'RING_POTION_AFFINITY',
                        'ARTIFACT_POTION_AFFINITY'
                    ],
                    FEATHER_RING: [
                        'FEATHER_ARTIFACT'
                    ],
                    FEATHER_TALISMAN: [
                        'FEATHER_RING',
                        'FEATHER_ARTIFACT'
                    ],
                    SEA_CREATURE_RING: [
                        'SEA_CREATURE_ARTIFACT'
                    ],
                    SEA_CREATURE_TALISMAN: [
                        'SEA_CREATURE_RING',
                        'SEA_CREATURE_ARTIFACT'
                    ],
                    HEALING_TALISMAN: [
                        'HEALING_RING'
                    ],
                    CANDY_ARTIFACT: [
                        'CANDY_RELIC'
                    ],
                    CANDY_RING: [
                        'CANDY_ARTIFACT',
                        'CANDY_RELIC'
                    ],
                    CANDY_TALISMAN: [
                        'CANDY_RING',
                        'CANDY_ARTIFACT',
                        'CANDY_RELIC'
                    ],
                    INTIMIDATION_RING: [
                        'INTIMIDATION_ARTIFACT'
                    ],
                    INTIMIDATION_TALISMAN: [
                        'INTIMIDATION_RING',
                        'INTIMIDATION_ARTIFACT'
                    ],
                    SPIDER_RING: [
                        'SPIDER_ARTIFACT'
                    ],
                    SPIDER_TALISMAN: [
                        'SPIDER_RING',
                        'SPIDER_ARTIFACT'
                    ],
                    RED_CLAW_RING: [
                        'RED_CLAW_ARTIFACT'
                    ],
                    RED_CLAW_TALISMAN: [
                        'RED_CLAW_RING',
                        'RED_CLAW_ARTIFACT'
                    ],
                    HUNTER_TALISMAN: [
                        'HUNTER_RING'
                    ],
                    ZOMBIE_RING: [
                        'ZOMBIE_ARTIFACT'
                    ],
                    ZOMBIE_TALISMAN: [
                        'ZOMBIE_RING',
                        'ZOMBIE_ARTIFACT'
                    ],
                    BAT_RING: [
                        'BAT_ARTIFACT'
                    ],
                    BAT_TALISMAN: [
                        'BAT_RING',
                        'BAT_ARTIFACT'
                    ],
                    BROKEN_PIGGY_BANK: [
                        'CRACKED_PIGGY_BANK',
                        'PIGGY_BANK'
                    ],
                    CRACKED_PIGGY_BANK: [
                        'PIGGY_BANK'
                    ],
                    SPEED_TALISMAN: [
                        'SPEED_RING',
                        'SPEED_ARTIFACT'
                    ],
                    SPEED_RING: [
                        'SPEED_ARTIFACT'
                    ],
                    PERSONAL_COMPACTOR_4000: [
                        'PERSONAL_COMPACTOR_5000',
                        'PERSONAL_COMPACTOR_6000'
                    ],
                    PERSONAL_COMPACTOR_5000: [
                        'PERSONAL_COMPACTOR_6000'
                    ],
                    SCARF_STUDIES: [
                        'SCARF_THESIS',
                        'SCARF_GRIMOIRE'
                    ],
                    SCARF_THESIS: [
                        'SCARF_GRIMOIRE'
                    ],
                    CAT_TALISMAN: [
                        'LYNX_TALISMAN',
                        'CHEETAH_TALISMAN'
                    ],
                    LYNX_TALISMAN: [
                        'CHEETAH_TALISMAN'
                    ],
                    SHADY_RING: [
                        'CROOKED_ARTIFACT',
                        'SEAL_OF_THE_FAMILY'
                    ],
                    CROOKED_ARTIFACT: [
                        'SEAL_OF_THE_FAMILY'
                    ],
                    TREASURE_TALISMAN: [
                        'TREASURE_RING',
                        'TREASURE_ARTIFACT'
                    ],
                    TREASURE_RING: [
                        'TREASURE_ARTIFACT'
                    ],
                    BEASTMASTER_CREST_COMMON: [
                        'BEASTMASTER_CREST_UNCOMMON',
                        'BEASTMASTER_CREST_RARE',
                        'BEASTMASTER_CREST_EPIC',
                        'BEASTMASTER_CREST_LEGENDARY'
                    ],
                    BEASTMASTER_CREST_UNCOMMON: [
                        'BEASTMASTER_CREST_RARE',
                        'BEASTMASTER_CREST_EPIC',
                        'BEASTMASTER_CREST_LEGENDARY'
                    ],
                    BEASTMASTER_CREST_RARE: [
                        'BEASTMASTER_CREST_EPIC',
                        'BEASTMASTER_CREST_LEGENDARY'
                    ],
                    BEASTMASTER_CREST_EPIC: [
                        'BEASTMASTER_CREST_LEGENDARY'
                    ],
                    RAGGEDY_SHARK_TOOTH_NECKLACE: [
                        'DULL_SHARK_TOOTH_NECKLACE',
                        'HONED_SHARK_TOOTH_NECKLACE',
                        'SHARP_SHARK_TOOTH_NECKLACE',
                        'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                    ],
                    DULL_SHARK_TOOTH_NECKLACE: [
                        'HONED_SHARK_TOOTH_NECKLACE',
                        'SHARP_SHARK_TOOTH_NECKLACE',
                        'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                    ],
                    HONED_SHARK_TOOTH_NECKLACE: [
                        'SHARP_SHARK_TOOTH_NECKLACE',
                        'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                    ],
                    SHARP_SHARK_TOOTH_NECKLACE: [
                        'RAZOR_SHARP_SHARK_TOOTH_NECKLACE'
                    ],
                    BAT_PERSON_TALISMAN: [
                        'BAT_PERSON_RING',
                        'BAT_PERSON_ARTIFACT'
                    ],
                    BAT_PERSON_RING: [
                        'BAT_PERSON_ARTIFACT'
                    ],
                    LUCKY_HOOF: [
                        'ETERNAL_HOOF'
                    ],
                    WITHER_ARTIFACT: [
                        'WITHER_RELIC'
                    ],

                    WEDDING_RING_0: [
                        'WEDDING_RING_2',
                        'WEDDING_RING_4',
                        'WEDDING_RING_7',
                        'WEDDING_RING_9'
                    ],
                    WEDDING_RING_2: [
                        'WEDDING_RING_4',
                        'WEDDING_RING_7',
                        'WEDDING_RING_9'
                    ],
                    WEDDING_RING_4: [
                        'WEDDING_RING_7',
                        'WEDDING_RING_9'
                    ],
                    WEDDING_RING_7: [
                        'WEDDING_RING_9'
                    ],

                    CAMPFIRE_TALISMAN_1: [
                        'CAMPFIRE_TALISMAN_4',
                        'CAMPFIRE_TALISMAN_8',
                        'CAMPFIRE_TALISMAN_13',
                        'CAMPFIRE_TALISMAN_21'
                    ],
                    CAMPFIRE_TALISMAN_4: [
                        'CAMPFIRE_TALISMAN_8',
                        'CAMPFIRE_TALISMAN_13',
                        'CAMPFIRE_TALISMAN_21'
                    ],
                    CAMPFIRE_TALISMAN_8: [
                        'CAMPFIRE_TALISMAN_13',
                        'CAMPFIRE_TALISMAN_21'
                    ],
                    CAMPFIRE_TALISMAN_13: [
                        'CAMPFIRE_TALISMAN_21'
                    ]
                },

                talisman_duplicates: {
                    WEDDING_RING_0: [
                        'WEDDING_RING_1'
                    ],
                    WEDDING_RING_2: [
                        'WEDDING_RING_3'
                    ],
                    WEDDING_RING_4: [
                        'WEDDING_RING_5',
                        'WEDDING_RING_6'
                    ],
                    WEDDING_RING_7: [
                        'WEDDING_RING_8'
                    ],

                    CAMPFIRE_TALISMAN_1: [
                        'CAMPFIRE_TALISMAN_2',
                        'CAMPFIRE_TALISMAN_3'
                    ],
                    CAMPFIRE_TALISMAN_4: [
                        'CAMPFIRE_TALISMAN_5',
                        'CAMPFIRE_TALISMAN_6',
                        'CAMPFIRE_TALISMAN_7'
                    ],
                    CAMPFIRE_TALISMAN_8: [
                        'CAMPFIRE_TALISMAN_9',
                        'CAMPFIRE_TALISMAN_10',
                        'CAMPFIRE_TALISMAN_11',
                        'CAMPFIRE_TALISMAN_12'
                    ],
                    CAMPFIRE_TALISMAN_13: [
                        'CAMPFIRE_TALISMAN_14',
                        'CAMPFIRE_TALISMAN_15',
                        'CAMPFIRE_TALISMAN_16',
                        'CAMPFIRE_TALISMAN_17',
                        'CAMPFIRE_TALISMAN_18',
                        'CAMPFIRE_TALISMAN_19',
                        'CAMPFIRE_TALISMAN_20'
                    ],
                    CAMPFIRE_TALISMAN_21: [
                        'CAMPFIRE_TALISMAN_22',
                        'CAMPFIRE_TALISMAN_23',
                        'CAMPFIRE_TALISMAN_24',
                        'CAMPFIRE_TALISMAN_25',
                        'CAMPFIRE_TALISMAN_26',
                        'CAMPFIRE_TALISMAN_27',
                        'CAMPFIRE_TALISMAN_28',
                        'CAMPFIRE_TALISMAN_29'
                    ]
                },
                talismans: {
                    'WEDDING_RING_0': {
                        name: "Shiny Yellow Rock",
                        rarity: "common",
                        texture: "/item/WEDDING_RING_0"
                    },
                    'WEDDING_RING_2': {
                        name: "Mediocre Ring of Love",
                        rarity: "uncommon",
                        texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                    },
                    'WEDDING_RING_4': {
                        name: "Modest Ring of Love",
                        rarity: "rare",
                        texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                    },
                    'WEDDING_RING_7': {
                        name: "Exquisite Ring of Love",
                        rarity: "epic",
                        texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                    },
                    'WEDDING_RING_9': {
                        name: "Legendary Ring of Love",
                        rarity: "legendary",
                        texture: "/head/8fb265c8cc6136063b4eb15450fe1fe1ab7738b0bf54d265490e1ef49da60b7c"
                    },

                    'CAMPFIRE_TALISMAN_1': {
                        name: "Campfire Initiate Badge",
                        rarity: "common",
                        texture: "/head/af41cc2250d2f5cfcf4384aa0cf3e23c19767549a2a8abd7532bd52c5a1de"
                    },
                    'CAMPFIRE_TALISMAN_4': {
                        name: "Campfire Adept Badge",
                        rarity: "uncommon",
                        texture: "/head/af41cc2250d2f5cfcf4384aa0cf3e23c19767549a2a8abd7532bd52c5a1de"
                    },
                    'CAMPFIRE_TALISMAN_8': {
                        name: "Campfire Cultist Badge",
                        rarity: "rare",
                        texture: "/head/a3cfd94e925eab4330a768afcae6c128b0a28e23149eee41c9c6df894c24f3de"
                    },
                    'CAMPFIRE_TALISMAN_13': {
                        name: "Campfire Scion Badge",
                        rarity: "epic",
                        texture: "/head/a3cfd94e925eab4330a768afcae6c128b0a28e23149eee41c9c6df894c24f3de"
                    },
                    'CAMPFIRE_TALISMAN_21': {
                        name: "Campfire Skyblock God Badge",
                        rarity: "legendary",
                        texture: "/head/4080bbefca87dc0f36536b6508425cfc4b95ba6e8f5e6a46ff9e9cb488a9ed"
                    },

                    'FARMING_TALISMAN': null,
                    'VACCINE_TALISMAN': {
                        name: "Vaccine Talisman",
                        rarity: "common",
                        texture: "/head/71408ede8b4f444015c59abd5cd32b8769de51881edabcc15abb6519f5b49"
                    },
                    'WOOD_TALISMAN': {
                        name: "Wood Affinity Talisman",
                        rarity: "uncommon",
                        texture: "/head/219ad5215ba6c7e4e4d0668f02d3a9c937ac536acc75ac49e7bd7b1c8ccf80"
                    },
                    'SKELETON_TALISMAN': null,
                    'COIN_TALISMAN': {
                        name: "Talisman of Coins",
                        rarity: "common",
                        texture: "/head/452dca68c8f8af533fb737faeeacbe717b968767fc18824dc2d37ac789fc77"
                    },
                    'MAGNETIC_TALISMAN': null,
                    'GRAVITY_TALISMAN': null,
                    'VILLAGE_TALISMAN': null,
                    'MINE_TALISMAN': null,
                    'NIGHT_VISION_CHARM': null,
                    'LAVA_TALISMAN': null,
                    'SCAVENGER_TALISMAN': null,
                    'FIRE_TALISMAN': null,
                    'PIGGY_BANK': null,
                    'CRACKED_PIGGY_BANK': null,
                    'BROKEN_PIGGY_BANK': null,
                    'PIGS_FOOT': null,
                    'WOLF_PAW': null,
                    'FROZEN_CHICKEN': null,
                    'FISH_AFFINITY_TALISMAN': null,
                    'FARMER_ORB': null,
                    'HASTE_RING': null,
                    'EXPERIENCE_ARTIFACT': null,
                    'NEW_YEAR_CAKE_BAG': null,
                    'DAY_CRYSTAL': {
                        name: "Day Crystal",
                        rarity: "rare",
                        texture: "/item/DAY_CRYSTAL"
                    },
                    'NIGHT_CRYSTAL': {
                        name: "Night Crystal",
                        rarity: "rare",
                        texture: "/item/NIGHT_CRYSTAL"
                    },
                    'FEATHER_TALISMAN': null,
                    'FEATHER_RING': null,
                    'FEATHER_ARTIFACT': null,
                    'POTION_AFFINITY_TALISMAN': null,
                    'RING_POTION_AFFINITY': null,
                    'ARTIFACT_POTION_AFFINITY': null,
                    'HEALING_TALISMAN': null,
                    'HEALING_RING': null,
                    'CANDY_TALISMAN': null,
                    'CANDY_RING': null,
                    'CANDY_ARTIFACT': null,
                    'MELODY_HAIR': {
                        name: "Melody's Hair",
                        rarity: "epic",
                        texture: "/item/MELODY_HAIR"
                    },
                    'SEA_CREATURE_TALISMAN': {
                        name: "Sea Creature Talisman",
                        rarity: "common",
                        texture: "/head/eaa44b170d749ce4099aa78d98945d193651484089efb87ba88892c6fed2af31"
                    },
                    'SEA_CREATURE_RING': null,
                    'SEA_CREATURE_ARTIFACT': null,
                    'INTIMIDATION_TALISMAN': null,
                    'INTIMIDATION_RING': null,
                    'INTIMIDATION_ARTIFACT': null,
                    'WOLF_TALISMAN': null,
                    'WOLF_RING': null,
                    'BAT_TALISMAN': null,
                    'BAT_RING': null,
                    'BAT_ARTIFACT': null,
                    'DEVOUR_RING': null,
                    'ZOMBIE_TALISMAN': null,
                    'ZOMBIE_RING': null,
                    'ZOMBIE_ARTIFACT': null,
                    'SPIDER_TALISMAN': null,
                    'SPIDER_RING': null,
                    'SPIDER_ARTIFACT': null,
                    'ENDER_ARTIFACT': null,
                    'TARANTULA_TALISMAN': null,
                    'SURVIVOR_CUBE': null,
                    'WITHER_ARTIFACT': null,
                    'RED_CLAW_TALISMAN': null,
                    'RED_CLAW_RING': null,
                    'RED_CLAW_ARTIFACT': null,
                    'BAIT_RING': null,
                    'SHADY_RING': null,
                    'CROOKED_ARTIFACT': null,
                    'SEAL_OF_THE_FAMILY': null,
                    'HUNTER_TALISMAN': null,
                    'HUNTER_RING': null,
                    'PARTY_HAT_CRAB': null,
                    'POTATO_TALISMAN': null,
                    'PERSONAL_COMPACTOR_4000': {
                        name: "Personal Compactor 4000",
                        rarity: "uncommon",
                        texture: "/item/PERSONAL_COMPACTOR_4000"
                    },
                    'PERSONAL_COMPACTOR_5000': {
                        name: "Personal Compactor 5000",
                        rarity: "rare",
                        texture: "/item/PERSONAL_COMPACTOR_5000"
                    },
                    'PERSONAL_COMPACTOR_6000': {
                        name: "Personal Compactor 6000",
                        rarity: "epic",
                        texture: "/item/PERSONAL_COMPACTOR_6000"
                    },
                    'SPEED_TALISMAN': {
                        name: "Speed Talisman",
                        rarity: "common",
                        texture: "/head/8624bacb5f1986e6477abce4ae7dca1820a5260b6233b55ba1d9ba936c84b"
                    },
                    'SPEED_RING': {
                        name: "Speed Ring",
                        rarity: "uncommon",
                        texture: "/head/c2da40a91f8fa7e1cbdd934da92a7668dc95d75b57c9c80a381c5e178cee6ba7"
                    },
                    'SPEED_ARTIFACT': {
                        name: "Speed Artifact",
                        rarity: "rare",
                        texture: "/head/f06706eecb2d558ace27abda0b0b7b801d36d17dd7a890a9520dbe522374f8a6"
                    },
                    'CAT_TALISMAN': {
                        name: "Cat Talisman",
                        rarity: "uncommon",
                        texture: "/head/3a12188258601bcb7f76e3e2489555a26c0d76e6efec2fd966ca372b6dde00"
                    },
                    'LYNX_TALISMAN': {
                        name: "Lynx Talisman",
                        rarity: "rare",
                        texture: "/head/12b84e9c79815a39b7be8ce6e91248d71f760f42b5a4de5e266b44b87a952229"
                    },
                    'CHEETAH_TALISMAN': {
                        name: "Cheetah Talisman",
                        rarity: "epic",
                        texture: "/head/1553f8856dd46de7e05d46f5fc2fb58eafba6829b11b160a1545622e89caaa33"
                    },
                    'SCARF_STUDIES': {
                        name: "Scarf's Studies",
                        rarity: "rare",
                        texture: "/head/6de4ab129e137f9f4cbf7060318ee1748dc39da9b5d129a8da0e614e2337693"
                    },
                    'SCARF_THESIS': {
                        name: "Scarf's Thesis",
                        rarity: "epic",
                        texture: "/head/8ce4c87eb4dde27459e3e7f85921e7e57b11199260caa5ce63f139ee3d188c"
                    },
                    'SCARF_GRIMOIRE': {
                        name: "Scarf's Grimoire",
                        rarity: "legendary",
                        texture: "/head/bafb195cc75f31b619a077b7853653254ac18f220dc32d1412982ff437b4d57a"
                    },
                    'TREASURE_TALISMAN': {
                        name: "Treasure Talisman",
                        rarity: "rare",
                        texture: "/head/31f320025142596396032cc0088e2ac36489f24cfa5e9dda13e081cf69f77f4d"
                    },
                    'TREASURE_RING': {
                        name: "Treasure Ring",
                        rarity: "epic",
                        texture: "/head/6a1cc5525a217a399b5b86c32f0f22dd91378874b5f44d5a383e18bc0f3bc301"
                    },
                    'TREASURE_ARTIFACT': {
                        name: "Treasure Artifact",
                        rarity: "legendary",
                        texture: "/head/e10f20a55b6e188ebe7578459b64a6fbd825067bc497b925ca43c2643d059025"
                    },
                    'MINERAL_TALISMAN': {
                        name: "Mineral Talisman",
                        rarity: "rare",
                        texture: "/head/3cbd70f73e2e09566ef914c697b13f48b97bfd6c11c83e540a15ff4d736b9c16"
                    },
                    'BEASTMASTER_CREST_COMMON': {
                        name: "Beastmaster Crest",
                        rarity: "common",
                        texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                    },
                    'BEASTMASTER_CREST_UNCOMMON': {
                        name: "Beastmaster Crest",
                        rarity: "uncommon",
                        texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                    },
                    'BEASTMASTER_CREST_RARE': {
                        name: "Beastmaster Crest",
                        rarity: "rare",
                        texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                    },
                    'BEASTMASTER_CREST_EPIC': {
                        name: "Beastmaster Crest",
                        rarity: "epic",
                        texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                    },
                    'BEASTMASTER_CREST_LEGENDARY': {
                        name: "Beastmaster Crest",
                        rarity: "legendary",
                        texture: "/head/53415667de3fb89c5f40c880c39e4971a0caa7f3a9d2c8f712ba37fadcee"
                    },
                    'RAGGEDY_SHARK_TOOTH_NECKLACE': {
                        name: "Raggedy Shark Tooth Necklace",
                        rarity: "common",
                        texture: "/head/d77309ddebbdc278ee2772d92fa4905dd850c5f213a77ffaed5a67eecb23984a"
                    },
                    'DULL_SHARK_TOOTH_NECKLACE': {
                        name: "Dull Shark Tooth Necklace",
                        rarity: "uncommon",
                        texture: "/head/f3ab3aa1ade74915dacd298613904361c18877eebfa81d9f936309f271e1389a"
                    },
                    'HONED_SHARK_TOOTH_NECKLACE': {
                        name: "Honed Shark Tooth Necklace",
                        rarity: "rare",
                        texture: "/head/e6b120938d83bf49ddab3a78666a0bf37a3de7b46b9d97b984da3be62ce3e5e3"
                    },
                    'SHARP_SHARK_TOOTH_NECKLACE': {
                        name: "Sharp Shark Tooth Necklace",
                        rarity: "epic",
                        texture: "/head/228e3fb6bd9887d60434ccd279ec3e59227826c9a2f8dd9ce9899ea6683d4ee8"
                    },
                    'RAZOR_SHARP_SHARK_TOOTH_NECKLACE': {
                        name: "Razor Sharp Shark Tooth Necklace",
                        rarity: "legendary",
                        texture: "/head/7792676664ac711488641f72b25961835613da9ffd43ea3bdd163cb365343a6"
                    },
                    'HEGEMONY_ARTIFACT': {
                        name: "Hegemony Artifact",
                        rarity: "legendary",
                        texture: "/head/313384a293cfbba3489b483ebc1de7584ca2726d7f5c3a620513474925e87b97"
                    },
                    'BITS_TALISMAN': {
                        name: "Bits Talisman",
                        rarity: "rare",
                        texture: "/head/2ebadb1725aa85bb2810d0b73bf7cd74db3d9d8fc61c4cf9e543dbcc199187cc"
                    },
                    'BAT_PERSON_TALISMAN': {
                        name: "Bat Person Talisman",
                        rarity: "common",
                        texture: "/head/b841a49b199a59c431bf3fc3783f6b6545ce78c38042617f66ebd87cdd548e8c"
                    },
                    'BAT_PERSON_RING': {
                        name: "Bat Person Ring",
                        rarity: "uncommon",
                        texture: "/head/b4451ecf2584a36de4297031c6d852977d3e249e85a3f0add967fcd7d6bde953"
                    },
                    'BAT_PERSON_ARTIFACT': {
                        name: "Bat Person Artifact",
                        rarity: "rare",
                        texture: "/head/c4444c3982720b30938f504c4374232b11a4f6f56cd57c973d8abb07fd0dcff7"
                    },
                    'CANDY_RELIC': {
                        name: "Candy Relic",
                        rarity: "legendary",
                        texture: "/head/39668767f1141835e2c49ad2b415598f1b166be9173902a0257e77704f913e1f"
                    },
                    'LUCKY_HOOF': null,
                    'ETERNAL_HOOF': null,
                    'WITHER_RELIC': {
                        name: "Wither Relic",
                        rarity: "epic",
                        texture: "/head/964e1c3e315c8d8fffc37985b6681c5bd16a6f97ffd07199e8a05efbef103793"
                    },
                    'CATACOMBS_EXPERT_RING': {
                        name: "Catacombs Expert Ring",
                        rarity: "epic",
                        texture: "/head/c078c68f6f9669370ea39be72945a3a8688e0e024e5d6158fd854fb2b80fb"
                    },
                    'AUTO_RECOMBOBULATOR': {
                        name: "Auto Recombobulator",
                        rarity: "legendary",
                        texture: "/head/5dff8dbbab15bfbb11e23b1f50b34ef548ad9832c0bd7f5a13791adad0057e1b"
                    }
                }
            }
        }

        function getPlayerSkill(skillExp, slayerExp) {
            return Math.round(Math.pow(skillExp / 1, 0.5))
        }

    }
}).start()