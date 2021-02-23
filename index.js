/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />


//					Code for soopyaddons
//					 Have fun reading it
//							lmao



//import Promise from 'Promise';
//import request from "request";
// import numeral from 'numeraljs';
// import sendRequest from "slothpixel/requests";
import soopySettings from 'soopyAddons/settings.js';
import versionData from 'soopyAddons/updateDetecter.js';
//import bombDefuseSolver from 'soopyAddons/bombDefuse.js';
//import grindDisplay from 'soopyAddons/currGrindDisplay.js';
import { newSideMessage, setLocation } from "soopyApis";
import { addCustomCompletion } from "CustomTabCompletions";
const GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
const GL11 = Java.type("org.lwjgl.opengl.GL11");
const Instant = Java.type("java.time.Instant");
import nothing from 'soopyAddons/sbgBot/index.js';
import nothing2 from 'soopyAddons/agentlai.js';
import mortGui from 'soopyAddons/mortGui.js';
import guildLbGuiManager from 'soopyAddons/guildLb.js';
const ArmourStandClass = Java.type("net.minecraft.entity.item.EntityArmorStand")



let updateChecked = false
let lastCtLoadTime = new Date().getTime()

let spiritBearName = null
register("worldLoad", () => {
	correctLividColor = undefined
	correctLividColorHP = undefined
	sayLividColors = []
	sayLividColors2 = []

	doRamCheck()

	if(soopySettings.getSetting("hidden", "api-key") === "undefined" && !settings.getSetting("Other","Disable set hypixel api key alert")){
		ChatLib.chat("&c[SOOPYADDONS] You should set your hypixel api key with /soopy setkey [apikey]")
	}else{
		try{
			let data = JSON.parse(FileLib.getUrlContent("https://api.hypixel.net/key?key=" + soopySettings.getSetting("hidden", "api-key")))
			if(!data.success) {
				soopySettings.setSetting("hidden", "api-key", "undefined")
				soopySettings.saveSettings()
				return;
			}
		}catch(e){
			soopySettings.setSetting("hidden", "api-key", "undefined")
			soopySettings.saveSettings()
			return;
		}
	}
   
	if (!updateChecked) {
		updateChecked = true

		if (soopySettings.getSetting("hidden", "versionId") === -1) {
			versionData.installMessage.forEach((line) => {
				ChatLib.chat(line)
			})

			soopySettings.setSetting("hidden", "version", versionData.currVersion)
			soopySettings.setSetting("hidden", "versionId", versionData.currVersionId)
		} else {
			if (soopySettings.getSetting("hidden", "versionId") !== versionData.currVersionId) {
				ChatLib.chat("&6Soopy&7Addons Has Updated (" + soopySettings.getSetting("hidden", "version") + " => " + versionData.currVersion + ")")
				versionData.changeLog.forEach((update) => {
					if (update.versionId > soopySettings.getSetting("hidden", "versionId")) {
						ChatLib.chat("&6Soopy&7Addons " + update.version + " changelog:")
						update.changeLog.forEach((line) => {
							ChatLib.chat("&7 " + line)
						})
					}
				})
				ChatLib.chat("&cTo access the new features you may need to go into the soopyaddons settings and click the 'reset settings' button")

				soopySettings.setSetting("hidden", "version", versionData.currVersion)
				soopySettings.setSetting("hidden", "versionId", versionData.currVersionId)
			}
		}
	}
})

let isSoopy = Player.getUUID().toString().replace(/-/ig, "") === "dc8c39647b294e03ae9ed13ebd65dd29"

import { Setting, SettingsObject } from "../SettingsManager/SettingsManager";

let versionDisplay = versionData.currVersion

const settings = new SettingsObject(
	"soopyAddons", [{
		name: "Info",
		settings: [
			new Setting.Button("&6Soopy&7Addons", "&7Version " + versionDisplay, () => { }),
			new Setting.Button("Reset Settings", "click", () => {
				ChatLib.simulateChat("&cReset settings. &7(For SoopyAddons Chattriggers Module)");
			}),
			new Setting.Button("Command Help", "click", () => {
				ChatLib.chat("&6Soopy&7Addons &7Command help");
				ChatLib.chat(" &r- /soopy player [ign] &7: Will show that player's skyblock stats in chat");
				ChatLib.chat(" &r- /soopy guild [guild name] &7: Will show that guilds's stats lb for skill/slayer");
				ChatLib.chat(" &r- /newhub &7: Will warp to your private island and back to hub in skyblock");
				ChatLib.chat(" &r- /dung &7: Will warp to the dungeon hub");
				ChatLib.chat(" &r- /ldung &7: Will warp to the lobby then skyblock then dungeon hub");
				ChatLib.chat(" &r- /reparty &7: Will disband the party and then re-invite all of the members");
			}),
			new Setting.Button("Discord server", "click", () => {
				ChatLib.chat("&6Soopy&7Addons &7Discord server");
				ChatLib.chat(new TextComponent(" &r- https://discord.gg/WShxTFY").setClick("open_url", "https://discord.gg/WShxTFY"))
			}),
			new Setting.Button("Credits", "click", () => {
				ChatLib.chat("&6Soopy&7Addons &7Credits");
				ChatLib.chat(" &r- &6Antonio32A &7: Code for drawing boxes around things");
				ChatLib.chat(" &r- &6Phxntomexile &7: Beta tester and Lots of ideas");
				ChatLib.chat(" &r- &6Agentlai &7: Beta tester");
				ChatLib.chat(" &r- &6vNoxus &7: Ideas and bug testing");
			}),
			new Setting.Button("If you cannot see the tabs at the top of the settings", "", () => { }),
			new Setting.Button("Turn down ur gui scale (u can turn it back after)", "", () => { })
		]
	},
	{
		name: "Improvements",
		settings: [
			new Setting.Toggle("Better line break", true),
			new Setting.Button("", "Mort is the person who lets you join dungeons and does party finder", () => { }),
			new Setting.Button("", "This feature may brake with NEU calender notifications and timer in inventory", () => { }),
			new Setting.Toggle("Better Mort GUI", true)
		]
	},
	{
		name: "Spam hider",
		settings: [
			new Setting.Toggle("Enable spam hider", true),
			new Setting.Toggle("Block some useless messages", true),
			new Setting.Toggle("Move some messages from main chat and to the right side of the screen", true),
			new Setting.Toggle("Just block the messages from showing instead of moving them", false),
			new Setting.Button("Location of where the messages get moved to:", "&cClick to send a test message", () => {
				ChatLib.simulateChat("&cThis is a test message. &7(For SoopyAddons Chattriggers Module)");
			}),
			new Setting.StringSelector("What corner of the screen?", 2, [
				"Top left",
				"Top Right",
				"Bottom Right"
			]),
			new Setting.Slider("ADVANCED: x Offset", 0, -500, 500, 0),
			new Setting.Slider("ADVANCED: y Offset", 0, -500, 500, 0),
			new Setting.Button("Change messages that are moved / hidden", "click", () => {
				ChatLib.simulateChat("&cOPENING MESSAGE EDITS")
			}),
			new Setting.Toggle("Attempt to add messages advertising auctions / discords to spam hider", true)
		]
	},
	{
		name: "Performance",
		settings: [
			new Setting.Button("", "It is recomended to leave these values at default settings", () => { }),
			new Setting.Toggle("Enable Tick event", true),
			new Setting.Toggle("Auto ct load suggestion message", false),
			new Setting.Toggle("Auto ct load", false)
		]
	},
	{
		name: "Dungeons",
		settings: [
			new Setting.Toggle("Watcher finished spawning mobs alert", true),
			new Setting.Toggle("Dungeons 1m in alert", false),
			new Setting.Toggle("Dungeons 80% in alert", false),
			new Setting.Toggle("Show spirit bear / correct livid HP", true),
			new Setting.Slider("Spirit Bear HP X", 10, 0, Math.max(Renderer.screen.getWidth(), 600), 0),
			new Setting.Slider("Spirit Bear HP Y", 40, 0, Math.max(Renderer.screen.getHeight(), 600), 0),
			new Setting.Toggle("Show box around Spirit Bear and Spirit Bow and Correct Livid", true),
			new Setting.Toggle("Show no armour message when entering a dungeon", true),
			new Setting.Toggle("Put a box around bats", false),
			new Setting.Toggle("Put a red box around skeleton masters", false),
			new Setting.Button("", "", () => { }),
			new Setting.Toggle("Auto-kick players that are able to join a f6 dungeon", false),
			new Setting.Toggle("Auto-kick players that are able to join a f5 dungeon", false),
			new Setting.Toggle("Ice Puzzle solver", true),
			new Setting.Toggle("Among us solvers", true),
			new Setting.Toggle("Better terminal clicking",true),
			new Setting.Button("", "&cWARNING: Queue terminal clicking may be bannable", () => { }),
			new Setting.Toggle("Queue terminal clicking",false),
			new Setting.Toggle("Three associates solver",true),
			//new Setting.Toggle("Bomb defuse solver",true),
			new Setting.Toggle("Explosive shot timer / guided sheep",true)
		]
	},
	{
		name: "HUD",
		settings: [
			new Setting.Toggle("Show FPS and CPS", true),
			new Setting.Toggle("Show HYPERION hits / second", true),
			new Setting.Toggle("Show HYPERION hits / second allways", true),
			new Setting.Toggle("Text shadow for HUD", true),
			new Setting.Slider("FPS and CPS Display X", 10, 0, Math.max(Renderer.screen.getWidth(), 600), 0),
			new Setting.Slider("FPS and CPS Display Y", 10, 0, Math.max(Renderer.screen.getHeight(), 600), 0),
			new Setting.Slider("HYPERION hits / second X", 10, 0, Math.max(Renderer.screen.getWidth(), 600), 0),
			new Setting.Slider("HYPERION hits / second Y", 40, 0, Math.max(Renderer.screen.getHeight(), 600), 0),
			new Setting.Toggle("Show 'BOSS SLAIN' Message when you have a empty slayer quest", true),
			new Setting.Toggle("Show 'BOSS SPAWNED' Message when you have spawned a slayer", true),
			new Setting.Toggle("Show current pet", true),
			new Setting.Toggle("Current pet more info", false),
			new Setting.Slider("Pet Display X", 10, 0, Math.max(Renderer.screen.getWidth(), 600), 0),
			new Setting.Slider("Pet Display Y", 30, 0, Math.max(Renderer.screen.getHeight(), 600), 0)
		]
	},
	{
		name: "Events",
		settings: [
			new Setting.Toggle("Griffin burrow waypoints", false),
			new Setting.Toggle("Griffin burrow waypoints Show path",false)
		]
	},
	{
		name: "Other",
		settings: [
			new Setting.Toggle("Show SBG reminders as title", true),
			new Setting.Toggle("Auto ty for SBG reminders", true),
			new Setting.Toggle("Better guild messages", true),
			new Setting.Toggle("Auto guild 'Welcome' for new members", true),
			new Setting.Toggle("Puzzler solver", true),
			//new Setting.Toggle("Item rarity halo", true),
			//new Setting.Toggle("Item rarity halo as circle", true),
			new Setting.Toggle("Show player's 'skill' next to their name in skyblock.", true),
			new Setting.StringSelector("What stat to use as 'skill'", 0, [
				"Skill Average",
				"Catacombs",
				"Total Slayer",
				"Soopy Skill"
			]),
			new Setting.Toggle("Old Ability Messages", true),
			new Setting.Toggle("Disable set hypixel api key alert", false)//,
			//new Setting.Toggle("No cake buff alert (Chat)", true)
			//auto gg for guild QUEST
			//message: &f&l                 GUILD QUEST TIER 1 COMPLETED!&r
		]
	}
]
);


settings.setCommand("soopyaddons").setSize(500, 350);
Setting.register(settings);

function resetSettings() {
	settings.reset();
	settings.load();
}

register("chat", (e) => {
	
	resetSettings();
}).setChatCriteria("&r&cReset settings. &7(For SoopyAddons Chattriggers Module)&r")


function doRamCheck() {
	if (new Date().getTime() - lastCtLoadTime > 1000 * 60 * 30) { //wait 30mins

		if (settings.getSetting("Performance", "Auto ct load")) {
			if (settings.getSetting("Performance", "Auto ct load suggestion message")) {
				if (Client.getMemoryUsage() > 50) {
					ChatLib.chat("&6Soopy&7Addons&7: &rReloading chattriggers due to high memory usage...")
					ChatTriggers.loadCT()
				}
			}
		} else {
			if (settings.getSetting("Performance", "Auto ct load suggestion message")) {
				if (Client.getMemoryUsage() > 50) {
					ChatLib.chat("&6Soopy&7Addons&7: &rIt looks like minecraft is using a lot of ram, consider running &d/ct load&r to maby fix for a bit.")
					ChatLib.chat("&6Soopy&7Addons&7: &rAlso consider enabling the auto-ct load setting in the performance tab to run /ct load automaticly.")
				}
			}
		}

	}
}



let lastAbilityMsg = ""
let lastAbilityTime = 0
TriggerRegister.registerActionBar((mana, ability, e) => {
	if (settings.getSetting("Other", "Old Ability Messages")) {
		
		cancel(e)
		if (new Date().getTime() - lastAbilityTime > 1500 || lastAbilityMsg !== mana + ability) {
			lastAbilityTime = new Date().getTime()
			lastAbilityMsg = mana + ability

			let message = "&r&aUsed &r&6${*}&r&a! &r&b(${*} Mana)&r"
			if (userEdits.includes(message)) {
				return;
			}
			if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Just block the messages from showing instead of moving them")) {
				return;
			}
			if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Move some messages from main chat and to the right side of the screen")) {
				newSideMessage("&r&aUsed &r&6" + ability + "&r&a! &r&b(" + mana + " Mana)&r")
				return;
			}
			ChatLib.chat("&r&aUsed &r&6" + ability + "&r&a! &r&b(" + mana + " Mana)&r")
		}
	}
}).setChatCriteria("&b-${mana} Mana (&6${ability}&b)&r").setParameter("<c>")
TriggerRegister.registerActionBar((mana, ability, secrets, e) => {
	if (settings.getSetting("Other", "Old Ability Messages")) {
		cancel(e)
		ChatLib.actionBar("&7" + secrets + " Secrets&r&r")
		if (new Date().getTime() - lastAbilityTime > 1500 || lastAbilityMsg !== mana + ability) {
			lastAbilityTime = new Date().getTime()
			lastAbilityMsg = mana + ability

			let message = "&r&aUsed &r&6${*}&r&a! &r&b(${*} Mana)&r"
			if (userEdits.includes(message)) {
				return;
			}
			if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Just block the messages from showing instead of moving them")) {
				return;
			}
			if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Move some messages from main chat and to the right side of the screen")) {
				newSideMessage("&r&aUsed &r&6" + ability + "&r&a! &r&b(" + mana + " Mana)&r")
				return;
			}
			ChatLib.chat("&r&aUsed &r&6" + ability + "&r&a! &r&b(" + mana + " Mana)&r")
		}
	}
}).setChatCriteria("&b-${mana} Mana (&6${ability}&b)     &7${secrets} Secrets&r&r").setParameter("<c>")


// TriggerRegister.registerActionBar((e) => {

// 	console.log(ChatLib.getChatMessage(e, true))

// })

//register("chat",()=>{}).setChatCriteria("&cYou are not in a party right now.&r")

register("chat", (mvp, rank, e) => {
	
	if (!settings.getSetting("Other", "Show SBG reminders as title")) { return; }
	Client.showTitle("", "&r&2Guild > " + mvp + " vNoxus " + rank + ": &rTHIS IS A HYDRATION REMINDER!", 20, 40, 20)
	setTimeout(() => {
		Client.showTitle("", "Grab some water and take a sip. Please remember to stay hydrated!&r", 20, 40, 20)
	}, 3250)

	if (settings.getSetting("Other", "Auto ty for SBG reminders")) {
		switch (Math.floor(Math.random() * 5)) {
			case 0:
				ChatLib.say("/gc ty")
				break;
			case 1:
				ChatLib.say("/gc Ty")
				break;
			case 2:
				ChatLib.say("/gc TY")
				break;
			case 3:
				ChatLib.say("/gc Thank you!")
				break;
			case 4:
				ChatLib.say("/gc thank you")
				break;
		}
	}
}).setChatCriteria("&r&2Guild > ${mvp} vNoxus ${rank}: &rTHIS IS A HYDRATION REMINDER! Grab some water and take a sip. Please remember to stay hydrated!&r")

register("chat", (mvp, rank, e) => {
	
	if (!settings.getSetting("Other", "Show SBG reminders as title")) { return; }
	Client.showTitle("", "&r&2Guild > " + mvp + " Xilke " + rank + ": &r&fTHIS IS A NEW DARK AUCTION REMINDER!", 20, 40, 20)
	setTimeout(() => {
		Client.showTitle("", "Grab some money and use them! #SBG ${*}&r", 20, 40, 20)
	}, 3250)

	if (settings.getSetting("Other", "Auto ty for SBG reminders")) {
		switch (Math.floor(Math.random() * 5)) {
			case 0:
				ChatLib.say("/gc ty")
				break;
			case 1:
				ChatLib.say("/gc Ty")
				break;
			case 2:
				ChatLib.say("/gc TY")
				break;
			case 3:
				ChatLib.say("/gc Thank you!")
				break;
			case 4:
				ChatLib.say("/gc thank you")
				break;
		}
	}
}).setChatCriteria("&r&2Guild > ${mvp} Xilke ${rank}: &r&fTHIS IS A NEW DARK AUCTION REMINDER! Grab some money and use them! #SBG ${*}")

register("chat", (mvp, rank, e) => {
	
	if (!settings.getSetting("Other", "Show SBG reminders as title")) { return; }
	Client.showTitle("", "&r&2Guild > " + mvp + " Xilke " + rank + ": &r&fTHIS IS A NEW HYDRATION REMINDER!", 20, 40, 20)
	setTimeout(() => {
		Client.showTitle("", "Grab some water and take a sip! Stay Hydrated! #SBG &r&b?&r", 20, 40, 20)
	}, 3250)

	if (settings.getSetting("Other", "Auto ty for SBG reminders")) {
		switch (Math.floor(Math.random() * 5)) {
			case 0:
				ChatLib.say("/gc ty")
				break;
			case 1:
				ChatLib.say("/gc Ty")
				break;
			case 2:
				ChatLib.say("/gc TY")
				break;
			case 3:
				ChatLib.say("/gc Thank you!")
				break;
			case 4:
				ChatLib.say("/gc thank you")
				break;
		}
	}
}).setChatCriteria("&r&2Guild > ${mvp} Xilke ${rank}: &r&fTHIS IS A NEW HYDRATION REMINDER! Grab some water and take a sip! Stay Hydrated! #SBG ${*}")


register("chat", (rank, player, e) => {
	
	if (rank.toLowerCase().includes(">")) { return; }
	if (!settings.getSetting("Other", "Auto guild 'Welcome' for new members")) { return; }
	Client.showTitle("", rank + " " + player + "&r&e joined the guild!&r", 20, 40, 20)

	switch (Math.floor(Math.random() * 5)) {
		case 0:
			ChatLib.say("/gc Welc ")
			break;
		case 1:
			ChatLib.say("/gc Welcome " + player)
			break;
		case 2:
			ChatLib.say("/gc Welcome")
			break;
		case 3:
			ChatLib.say("/gc welcome")
			break;
		case 4:
			ChatLib.say("/gc WELCOME " + player)
			break;
	}
}).setChatCriteria("${rank} ${player} &r&ejoined the guild!&r")

register("chat", (rank, player, kicker, e) => {
	
	if (rank.toLowerCase().includes(">")) { return; }
	if (!settings.getSetting("Other", "Auto guild 'Welcome' for new members")) { return; }
	Client.showTitle("", rank + " " + player + " &r&ewas kicked from the guild by " + kicker + "&r", 20, 40, 20)

	switch (Math.floor(Math.random() * 5)) {
		case 0:
			ChatLib.say("/gc L ")
			break;
		case 1:
			ChatLib.say("/gc l ")
			break;
		case 2:
			ChatLib.say("/gc LL")
			break;
		case 3:
			ChatLib.say("/gc Lol")
			break;
		case 4:
			ChatLib.say("/gc LLLLLLL ")
			break;
	}
}).setChatCriteria("${rank} ${player} &r&ewas kicked from the guild by ${kicker}&r")

register("chat", (player, e) => {
	

	new Thread(() => {
		showPlayerStats(player)
		return;
	}).start()
}).setChatCriteria("&b-----------------------------------------------------\n&r${*} &r&ahas requested to join the Guild!\n&r&bClick here &r&ato accept or type &r&b/guild accept ${player}&r&a!\n&r&b-----------------------------------------------------\n&r")


register("chat", (player, e) => {
	
	if (!settings.getSetting("Other", "Auto guild 'Welcome' for new members")) { return; }
	Client.showTitle("", "&7" + player + "&r&e joined the guild!&r", 20, 40, 20)

	switch (Math.floor(Math.random() * 5)) {
		case 0:
			ChatLib.say("/gc Welc ")
			break;
		case 1:
			ChatLib.say("/gc Welcome " + player)
			break;
		case 2:
			ChatLib.say("/gc Welcome")
			break;
		case 3:
			ChatLib.say("/gc welcome")
			break;
		case 4:
			ChatLib.say("/gc WELCOME " + player)
			break;
	}
}).setChatCriteria("&7${player} &r&ejoined the guild!&r")

register("chat", (e) => {
	
	if (!settings.getSetting("Dungeons", "Watcher finished spawning mobs alert")) { return; }
	Client.showTitle("", "&cThe Watcher has finished spawning mobs!", 20, 40, 20)
}).setChatCriteria("&r&c[BOSS] The Watcher&r&f: That will be enough for now.&r")

let botNames = []
new Thread(() => {
	let res = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/sbgBot/getBotUsers.json?key=lkRFxoMYwrkgovPRn2zt"))
	botNames = res.data

	return;
}).start()

register("chat", (sender, player, message, e) => {
	
	if (!settings.getSetting("Other", "Better guild messages")) { return; }

	sender = sender.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
	if (!botNames.includes(sender)) { return; }

	cancel(e)
	ChatLib.chat("&r&2SBGBOT > &r" + ((player == Player.getName() || player == "everyone") ? "&6" : "&7") + player + ((player == Player.getName() || player == "everyone") ? "&a" : "&7") + " -> " + ((player == Player.getName() || player == "everyone") ? "&r" : "&7") + message)
}).setChatCriteria("&r&2Guild > ${sender}&f: &r@${player}, ${message}&r")

register("chat", (sender, message, e) => {
	
	if (!settings.getSetting("Other", "Better guild messages")) { return; }

	sender = sender.replace(/(\[[MVIP&0123456789ABCDEFLMNOabcdeflmnor\+]+\])+? /g, "").replace(/\[[A-z]*\]/g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
	if (!botNames.includes(sender)) { return; }

	cancel(e)
	ChatLib.chat("&r&2SBGBOT &7[DM] &2> &r" + "&6" + Player.getName() + "&a" + " -> " + "&r" + message)
}).setChatCriteria("&dFrom &r${sender}&r&7: &r&7@sbgbot ${message}&r")

//Removed because it will lag ur game

// function sendRequestNoBase(add) {

// 	const returnedPromise = request({
// 		url: add,
// 		headers: {
// 			["User-Agent"]: "Mozilla/5.0 (ChatTriggers; soopyaddons module)"
// 		},
// 		connectTimeout: 10000,
// 		readTimeout: 10000,
// 		json: true
// 	});

// 	//	console.log(1)
// 	return new Promise((resolve, reject) => {
// 		//	console.log(1)
// 		returnedPromise.then(value => resolve(value));
// 	});
// }
//DRAWING STUFF ON THE SCREEN
let currPet = "";
register("renderOverlay", renderOverlay);

let lastTimeRender = new Date().getTime()

let lastBossNotSpawnedTime = 0;
let lastDungBelow80 = 0;
let lastDungbelow1m = 0;
let lastNoArmour = 0;

let bossSlainMessage = false
let bossSpawnedMessage = false
let dungeon80 = null
let dungeon1m = null
let updatingIce = false

function drawHudText(text, x, y){
	if (settings.getSetting("HUD", "Text shadow for HUD")) {
		Renderer.drawStringWithShadow(text, x, y)
	}else{
		Renderer.drawString(text, x, y)
	}
}

function renderOverlay() {
	startFunctionPerformanceAnalize("RenderOverlay event")
	let now = new Date().getTime()


	lastTimeRender = now

	//grindDisplay.render(500, 500)

	if (settings.getSetting("HUD", "Show FPS and CPS")) {
		drawHudText("&6FPS&7> &f" + (settings.getSetting("Performance", "Enable Tick event")?(Math.round(fpsDis)) : Client.getFPS()), settings.getSetting("HUD","FPS and CPS Display X"), settings.getSetting("HUD","FPS and CPS Display Y"));
		drawHudText("&6CPS&7> &f" + (CPS.getLeftClicksAverage() + CPS.getRightClicksAverage()), settings.getSetting("HUD","FPS and CPS Display X"), parseInt(settings.getSetting("HUD","FPS and CPS Display Y"))+10);
	}

	if(settings.getSetting("HUD", "Show HYPERION hits / second") && (hypKills > 0 || settings.getSetting("HUD","Show HYPERION hits / second allways"))){
		drawHudText("&6HYP HITS/s&7> &f" + hypKills, settings.getSetting("HUD","HYPERION hits / second X"), settings.getSetting("HUD","HYPERION hits / second Y"));
	}

	if (settings.getSetting("HUD", "Show current pet")) {
		drawHudText(currPet, settings.getSetting("HUD", "Pet Display X"), settings.getSetting("HUD", "Pet Display Y"));
	}
	if (settings.getSetting("Dungeons", "Show no armour message when entering a dungeon") && now - lastNoArmour < 3000) {
		Renderer.scale(10, 10)
		drawHudText("&4NO ARMOUR", Renderer.screen.getWidth() / 10 / 2 - Renderer.getStringWidth("NO ARMOUR") / 2, Renderer.screen.getHeight() / 10 / 2 - 5)
		Renderer.scale(1, 1)
	}
	if (settings.getSetting("Dungeons", "Show spirit bear / correct livid HP") && spiritBearName !== null) {
		drawHudText(spiritBearName, settings.getSetting("Dungeons", "Spirit Bear HP X"), settings.getSetting("Dungeons", "Spirit Bear HP Y"));
	}

	if (settings.getSetting("HUD", "Show 'BOSS SLAIN' Message when you have a empty slayer quest") && bossSlainMessage) {
		Renderer.scale(10, 10)
		drawHudText("&4BOSS SLAIN", Renderer.screen.getWidth() / 10 / 2 - Renderer.getStringWidth("BOSS SLAIN") / 2, Renderer.screen.getHeight() / 10 / 2 - 5)
		Renderer.scale(1, 1)
	}
	if (settings.getSetting("HUD", "Show 'BOSS SPAWNED' Message when you have spawned a slayer") && bossSpawnedMessage) {
		if (now - lastBossNotSpawnedTime < 3000) {
			Renderer.scale(10, 10)
			drawHudText("&4BOSS SPAWNED", Renderer.screen.getWidth() / 10 / 2 - Renderer.getStringWidth("BOSS SPAWNED") / 2, Renderer.screen.getHeight() / 10 / 2 - 5)
			Renderer.scale(1, 1)
		}
	}
	if (settings.getSetting("Dungeons", "Dungeons 80% in alert") && dungeon80 !== null) {
		if (now - lastDungBelow80 < 5000) {
			Renderer.scale(5, 5)
			drawHudText(dungeon80, Renderer.screen.getWidth() / 5 / 2 - Renderer.getStringWidth(dungeon80) / 2, Renderer.screen.getHeight() / 5 / 2 - 5)
			Renderer.scale(1, 1)
		}
	}
	if (settings.getSetting("Dungeons", "Dungeons 1m in alert") && dungeon1m !== null) {
		if (now - lastDungbelow1m < 5000) {
			Renderer.scale(5, 5)
			drawHudText(dungeon1m, Renderer.screen.getWidth() / 5 / 2 - Renderer.getStringWidth(dungeon1m) / 2, Renderer.screen.getHeight() / 5 / 2 - 5)
			Renderer.scale(1, 1)
		}
	}
	if (settings.getSetting("Dungeons", "Explosive shot timer / guided sheep") && lastExplosiveShotTime !== -1 && inDungeons) {
		drawHudText(Math.max(0,Math.ceil((explosiveShotLength-(now-lastExplosiveShotTime))/1000)) + "s", Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(Math.max(0,Math.ceil((explosiveShotLength-(now-lastExplosiveShotTime))/1000)) + "s") / 2, Renderer.screen.getHeight() / 2 + 10)
	}

	endFunctionPerformanceAnalize("RenderOverlay event")
}


//register("worldLoad", () => {
	//if (settings.getSetting("Other", "No cake buff alert (Chat)")) {
		//&r&d&lYum! &r&eYou gain &r&f+10✦ Speed &r&efor &r&a48 &r&ehours!&r
		//&r&d&lYum! &r&eYou gain &r&c+2❁ Strength &r&efor &r&a48 &r&ehours!&r
	//}
//})


register("chat", (e) => {
	
	if (Player.armor.getHelmet().getID() === -1
		&& Player.armor.getChestplate().getID() === -1
		&& Player.armor.getLeggings().getID() === -1
		&& Player.armor.getBoots().getID() === -1) {
		lastNoArmour = new Date().getTime()
	}
}).setChatCriteria("&r${*}&a has started the dungeon countdown. The dungeon will begin in 1 minute.&r")

register("command", (arg, e) => {
	if (arg === "dung") {
		ChatLib.say("/warp dungeon_hub")
	} else {
		if(arg === undefined){
			ChatLib.command("warp")
		}else{
		ChatLib.command("warp " + arg)
		}
	}
}).setName("warp")

register("command", (e) => {
	ChatLib.say("/warp dungeon_hub")
}).setName("dung")

register("command", (e) => {
	new Thread(() => {
		ChatLib.say("/l")
		Thread.sleep(500)
		ChatLib.say("/play skyblock")
		Thread.sleep(500)
		ChatLib.say("/warp dungeon_hub")

		return;
	}).start()
}).setName("ldung")

lastAttemptRePartyTime = 0

// register("command", (e) => {
// 	ChatLib.say("/pl")
// 	commandsQueue.push("")
// 	commandsQueue.push("/p disband")
// 	lastAttemptRePartyTime = new Date().getTime()
// }).setName("reparty")

register("chat", (mode, names, e) => {
	


	if (new Date().getTime() - lastAttemptRePartyTime > 1000) {
		return;
	}

	if (mode !== "Moderators" && mode !== "Members") { return; }

	let membsArr = names.split(" ● ")
	membsArr.pop()

	membsArr.forEach((membNameFormatted) => {
		let membNameUnFormatted = membNameFormatted.replace(/(\[[a-zA-Z0-9\+]+\])+? /g, "").replace(/(&[0123456789ABCDEFLMNOabcdeflmnor])|\[|\]| |\+/g, "")
		commandsQueue.push("/p invite " + membNameUnFormatted)
	})
}).setChatCriteria("Party ${mode}: ${names}")//&eParty Members: &r&6[MVP&r&2++&r&6] Soopyboo32&r&a ● &r&7ItzSirBeanie&r&a ● &r&a[VIP] 98falcon&r&a ● &r

TriggerRegister.registerChat((color, e) => betterBreak(color, e, false)).setChatCriteria("${color}-----------------------------------------------------&r").triggerIfCanceled(false)


function betterBreak(color, e, overwhright) {

	if ((color.length === 2 && settings.getSetting("Improvements", "Better line break")) || overwhright) {

		if (e !== undefined) {
			cancel(e)
		}
		ChatLib.chat(color + "&m" + ChatLib.getChatBreak(" ") + "&r");
	}

}
let fpsDis = 0;
let worldTime = 0
World.getBlockAt
//Stuff for keybinds

//var streamGameKeyBind = getKeyBindFromKey(Keyboard.KEY_NONE, "New game from stream Api nthinfgas");
//
// function getKeyBindFromKey(key, description) {
// 	var mcKeyBind = undefined //MinecraftVars.getKeyBindFromKey(key);
//
// 	if (mcKeyBind == null || mcKeyBind == undefined) {
// 		mcKeyBind = new KeyBind(description, key);
// 	}
//
// 	return mcKeyBind;
// }

function getPlayerSkill(skillExp, slayerExp) {
	return Math.round(Math.pow(skillExp / 1, 0.5))
}

register("chat",(msg, e)=>{
	let words = ["free","/p","join","coins","ah","cheap",">>>","<<<","[][]","==","sell","quick","buy","per","give","p me","craft"]

	let detects = 0;
	words.forEach((word)=>{
		if(msg.toLowerCase().includes(word)){
			detects++
		}
	})

	if(detects >= 2){
		chatEvent(e)
	}
}).setChatCriteria("${*}&${*}&r&${*}: ${msg}&r")

let playersNearbye = 0;
let inDungeons = false;

let msPerFrameLast = 0;

register("command", (e) => {
	ChatLib.chat("----------------------")
	ChatLib.chat("Lobby player Skill:")
	let replaceThing = {
		"Skill Average": "skill-avg",
		"Catacombs": "dungeon",
		"Total Slayer": "slayer-total",
		"Soopy Skill": "skill"
	}

	let thing = replaceThing[settings.getSetting("Other", "What stat to use as 'skill'")]
	Object.keys(playerSkills).sort((a, b) => { return playerSkills[a][thing] - playerSkills[b][thing] }).forEach((key) => {
		if (getPlayerByUUID(key) !== null) {
			if (getPlayerByUUID(key).getPing() !== -1) {

				let player = getPlayerByUUID(key)

				if (playerSkills[key].error) {
					if (playerSkills[key].nick) {

						let mess = new Message();
						mess.addTextComponent(new TextComponent("&7" + player.getName() + " &c[Nick]").setHover("show_text", "&7Click to show more info for " + player.name).setClickAction("run_command").setClickValue("/soopy player " + player.name))
						mess.chat()
					} else {
						let mess = new Message();
						mess.addTextComponent(new TextComponent("&7" + player.getName() + " &c[Error]").setHover("show_text", "&7Click to show more info for " + player.name).setClickAction("run_command").setClickValue("/soopy player " + player.name))
						mess.chat()
					}
				} else {
					if (playerSkills[key].approx) {

						let mess = new Message();
						mess.addTextComponent(new TextComponent("&7" + player.getName() + " &c[" + (playerSkills[key]["usesSoopyaddons"] === true ? "&d⚝&c" : "") + playerSkills[key][thing] + "]").setHover("show_text", "&7Click to show more info for " + player.name).setClickAction("run_command").setClickValue("/soopy player " + player.name))
						mess.chat()
					} else {

						let mess = new Message();
						mess.addTextComponent(new TextComponent("&7" + player.getName() + " &2[" + (playerSkills[key]["usesSoopyaddons"] === true ? "&d⚝&2" : "") + playerSkills[key][thing] + "]").setHover("show_text", "&7Click to show more info for " + player.name).setClickAction("run_command").setClickValue("/soopy player " + player.name))
						mess.chat()
					}
				}
			}
		}
	})
	ChatLib.chat("----------------------")
}).setName("lskills")

let playerSkills = {}
TriggerRegister.registerWorldLoad(function () {
	playerSkills = {}
});
let lastTime1 = 0;

const chars = [
	"⭍",
	"ࠀ"
]
const spamBypass = message => {
	for (let i = 0; i < (256 - message.length); i++) {
		let char = chars[Math.floor(Math.random() * chars.length)];
		message += char;
	}
	return (message);
}



// register("command", (...guild) => {
// 	ChatLib.chat("----------------------")
// 	ChatLib.chat("Friending Guild members...")
// 	ChatLib.chat("----------------------")

// 	if (guild == undefined) {
// 		ChatLib.chat("Invalid Guild")
// 		return;
// 	}

// 	new Thread(() => {
// 		let response = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=guild?name=" + guild.join("%20")))

// 		response.data.guild.members.forEach((member) => {
// 			let response1 = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?uuid=" + member.uuid))
// 			try {
// 				if (response1.data.player.lastLogin > response1.data.player.lastLogout) {
// 					ChatLib.say("/f add " + response1.data.player.playername)
// 					ChatLib.chat("f added " + response1.data.player.playername)
// 				} else {
// 					ChatLib.chat(response1.data.player.playername + " is not online")
// 				}
// 			} catch (err) { }
// 			Thread.sleep(3000)
// 		})

//		return;
// 	}).start()

// }).setName("fallguild")

register("command", (...msg) => {
	ChatLib.say(msg.join(" "))
}).setName("say")

function loadLobbyPlayerStats() {

	if (Scoreboard.getTitle().includes("SKYBLOCK") && settings.getSetting("Other", "Show player's 'skill' next to their name in skyblock.")) {
		new Thread(() => {

			let players = World.getAllPlayers().sort((a, b) => {
				let bDist = Math.pow(b.getX() - Player.getX(), 2) + Math.pow(b.getY() - Player.getY(), 2) + Math.pow(b.getZ() - Player.getZ(), 2)
				let aDist =Math.pow(a.getX() - Player.getX(), 2) + Math.pow(a.getY() - Player.getY(), 2) + Math.pow(a.getZ() - Player.getZ(), 2)
				return aDist - bDist
			})

			let done = false
			players.forEach((player) => {
				try {
					if (!done) {
						if (player.getPing() !== -1) {

							if (playerSkills[player.getUUID().toString().replace(/-/gi, "")] === undefined) {
								done = loadDataFor(player.getUUID().toString().replace(/-/gi, ""))

							}
							if (playerSkills[player.getUUID().toString().replace(/-/gi, "")] !== undefined) {
								if (playerSkills[player.getUUID().toString().replace(/-/gi, "")].error) {
									if (playerSkills[player.getUUID().toString().replace(/-/gi, "")].nick) {

										player.setNametagName(new TextComponent(player.getName() + " &c[Nick]"));
									} else {
										player.setNametagName(new TextComponent(player.getName() + " &c[Error]"));
									}
								} else {
									if (playerSkills[player.getUUID().toString().replace(/-/gi, "")].approx) {


										let replaceThing = {
											"Skill Average": "skill-avg",
											"Catacombs": "dungeon",
											"Total Slayer": "slayer-total",
											"Soopy Skill": "skill"
										}

										let thing = replaceThing[settings.getSetting("Other", "What stat to use as 'skill'")]
										player.setNametagName(new TextComponent(player.getName() + " &c[" + (playerSkills[player.getUUID().toString().replace(/-/gi, "")]["usesSoopyaddons"] === true ? "&d⚝&c" : "") + playerSkills[player.getUUID().toString().replace(/-/gi, "")][thing] + "]"));
									} else {


										let replaceThing = {
											"Skill Average": "skill-avg",
											"Catacombs": "dungeon",
											"Total Slayer": "slayer-total",
											"Soopy Skill": "skill"
										}

										let thing = replaceThing[settings.getSetting("Other", "What stat to use as 'skill'")]
										player.setNametagName(new TextComponent(player.getName() + " &2[" + (playerSkills[player.getUUID().toString().replace(/-/gi, "")]["usesSoopyaddons"] === true ? "&d⚝&2" : "") + playerSkills[player.getUUID().toString().replace(/-/gi, "")][thing] + "]"));
									}
								}
							}
						}
					}
				} catch (e) { console.log(e.message) }
			})


			return;
		}).start()
	}

}

function getPlayerByUUID(uuid) {
	let ret = null;

	World.getAllPlayers().forEach((player) => {
		if (player.getUUID().toString().replace(/-/gi, "") === uuid.replace(/-/gi, "")) {
			ret = player
		}
	})

	return ret;
}

new Thread(() => {
	FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPlayerSkill.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + Player.getUUID().toString().replace(/-/gi, ""))

	return;
}).start()

let hyperionKills = []
let hypKills = 0

register("chat",(num)=>{
	hyperionKills.push({time: new Date().getTime(),num: parseInt(num)})
}).setChatCriteria("&r&7Your Implosion hit &r&c${num} &r&7ene${*} for &r${*}damage.&r")

let dragalert = -1

register("command",(...args)=>{
	if(args[0] === undefined){
		args[0] = "43"
	}

	ChatLib.chat("Alerting you if someone above skill avg " + args[0] + " joins the lobby!")
	ChatLib.chat("Set to -1 to disable")

	dragalert = parseFloat(args[0])
}).setName("dragalert")

function loadDataFor(uuid) {

	try {

		if (getPlayerByUUID(uuid) == null) { return false; }

		let player = getPlayerByUUID(uuid)

		let response = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPlayerSkill.json?key=lkRFxoMYwrkgovPRn2zt&uuid=" + uuid))
		//console.log(JSON.stringify(response))
		if (response.success === false) {
			if (uuid === Player.getUUID().toString().replace(/-/ig, "")) { return !!response.cooldown; }
			if (response.reason === "You have send to many requests in the past minute, wait a minute and try again") { return true; }
			if (response.reason === "The api is curranatly overloaded! Please try again in a few minutes") { return true; } //add catch for server overload
			if (response.reason === "That player Doesent exist") {

				playerSkills[uuid] = { error: true, nick: true }
				return !!response.cooldown;
			}
			playerSkills[uuid] = { error: true, nick: false }
			return !!response.cooldown;
		}


		playerSkills[uuid] = { error: false, "skill": response.skill, "approx": response.approx, "slayer-total": response["slayer-total"], "skill-avg": response["skill-avg"], "dungeon": response["dungeon"], "usesSoopyaddons": response["usesSoopyaddons"] }

		if(dragalert !== -1){
			if(response["skill-avg"] > dragalert){
				Client.showTitle("&cWarning!","&d" + player.getName() + " has a skill avg of " + response["skill-avg"].toFixed(2),20,60,20)
			}
		}

		return !!response.cooldown;
	} catch (e) { console.log(e); return false }
}

register("command",()=>{
	new Thread(()=>{
		let data = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getFetchur.json?key=lkRFxoMYwrkgovPRn2zt")).fetchur

		ChatLib.chat("Fetchur is currently " + (data?data:"Unknown") + ".")
	}).start()
}).setName("fetchur")

let hideMessages = [
	"&r${*}&r&6 ${*} the lobby!&r",
	"&r &b>&c>&a>&r &r${*} the lobby!&r &a<&c<&b<&r",
	"${*} &r&ffound a &r${*} &r&bMystery Box&r&f!&r",
	"&b[Mystery Box] ${*} &ffound a ${*}&r",
	"&r&7Warping you to the ${*} island...&r",
	"&7Sending to server ${*}...&r",
	"&cAutopet &eequipped your ${*}&e! &a&lVIEW RULE&r"
]
let moveMessages = [
	"${*} > ${*} &r&eleft.&r",
	"${*} > ${*} &r&ejoined.&r",
	"&r&aUsed &r&6${*}&r&a! &r&b(${*} Mana)&r",
	"&r&cYou do not have enough mana to do this!&r",
	"&r&cWhow! Slow down there!&r",
	"&r&cThere are blocks in the way!&r",
	"&r&eYour previous ${*} &r&ewas removed!&r",
	"&r&aWarped from the &r${*} Teleport Pad&r&a to the &r${*} Teleport Pad&r&a!&r",
	"&a&aAutomatically activated: ${*}&r",
	"&r&aYou earned &r&2${*} GEXP &r&afrom playing ${*}!&r",
	"&r&cYour stats did not change because you /duel'ed your opponent!&r",
	"&r&aYour &r${*} &r&alevelled up to level &r&9${*}&r&a!&r",
	"&r&cYou are not allowed to leave this area!&r",
	"&r&cYou can't build outside your plot!&r",
	"&r&6$*{*} coins! (${*})  Kill&r",
	"&r&b+1 Soul&r",
	"&r&d+${*} SkyWars Experience (Kill)&r",
	"&r${*}&r&e has joined (&r&b${*}&r&e/&r&b${*}&r&e)!&r",
	"&r&eKALI HAS STRIKEN YOU WITH THE CURSE OF SPAM&r",
	"&r&e✆ Ring... &r",
	"&r&e✆ Ring... Ring... &r",
	"&r&e✆ Ring... Ring... Ring... &r",
	"&r  &r&6&lNICE! SLAYER BOSS SLAIN!&r",
	"&r&c ? &r${*}&r&7 was killed by ${*}&r&7.&r",
	"&r   &r&5&l${*} &r&7Talk to Maddox to claim your ${*} Slayer XP!&r",
	// "&r  &r&a&lSLAYER QUEST COMPLETE!&r",
	// "&r   &r&e${*} Slayer LVL ${*} &r&5- &r&7Next LVL in &r&d${*} XP&r&7!&r",
	"&r  &r&5&lSLAYER QUEST STARTED!&r",
	"&r   &5&l${*} &7Slay &c${*} Combat XP &7worth of ${*}&7.&r",
	"&r&eThe game starts in &r&c${*}&r&e seconds!&r",
	"&r&aYou purchased &r&6${*}&r",
	"&r&eYou will respawn in &r&c${*} &r&eseconds!&r",
	"&r&cThis ability is currently on cooldown for ${*} more seconds.&r",
	"&r&dYou have already found that Fairy Soul!&r",
	"&r&6&lRARE DROP! &r${*}&r",
	"&r&cThis is a test message. &7(For SoopyAddons Chattriggers Module)&r",
	"&r&cThis ability is disabled while guesting!&r",
	"&r&e[NPC]&bMort&f: &rTalk to me to change your class and ready up.&r",
	"${*} is now ready!&r",
	"${*} selected the ${*} &r&aDungeon Class!&r",
	"&r&aDungeon starts in ${*} seconds.&r",
	"&r&e[NPC]&bMort&f: &rHere, I found this map when I first entered the dungeon.&r",
	"&r&e[NPC]&bMort&f: &rYou should find it useful if you get lost.&r",
	"&r&e[NPC]&bMort&f: &rGood luck.&r",
	"&r&c ? ${*} was killed by ${*} and became a ghost&r&7.&r",
	"${*} is ready to use! Press &r&6&lDROP&r&a to activate it!&r",
	"&r&a ? ${*} was revived by ${*}!&r",
	"&r&a ? ${*} was revived!&r",
	"&r&6&lDUNGEON BUFF! ${*} found ${*}!&r",
	"&r&cYou do not have the key for this door!&r",
	"&r&cThe ${*}&c struck you for ${*} damage!&r",
	"&r&cThis ability is currently on cooldown for ${*} more second.&r",
	"&r${*} &r&epicked up ${*}",
	"&r&e&lRIGHT CLICK &r&7on &r&7a ${*} to open it. This key can only be used to open &r&a1&r&7 door!&r",
	"&r&6&lDUNGEON BUFF! ${*} found ${*}&r",
	"&r     &r&7Granted you ${*}.&r",
	"&r&cLost Adventurer &r&aused &r${*}&r&aon you!&r",
	"&r&cYou can only use this ability while in a dungeon!&r",
	"&r&c[BOSS] The Professor&r&f: ${*}&r",
	"&r&4[BOSS] Necron&r&c: ${*}&r",
	"&r${*} found a &r&dWither Essence&r&f! Everyone gains an extra essence!&r",
	"&r&cYou cannot use abilities in this room!&r",
	"&r&c[BOSS] Thorn&r&f:${*}&r",
	"&r&c[BOSS] The Watcher&r&f:${*}&r",
	"&r&b[CROWD] ${*}&r",
	"&r&6Guided Sheep &r&ais now available!&r",
	"&r&7Your Guided Sheep hit &r&c${*} &r&7enemies for &r&c${*} &r&7damage.&r",
	"&r&7Your Guided Sheep hit &r&c1 &r&7enemy for &r&c${*} &r&7damage.&r",
	"&r&7Scarf's Wither Skull hit you for &r&c${*}&r&7 damage.&r",
	"&r&7The &r&9Spirit Chicken&r&7's lightning struck you for &r&c${*}&r&7 damage.&r",
	"&r&7A &r&9Chicken Mine&r&7 exploded, hitting you for &r&c${*}&r&7 damage.&r",
	"&r&7A &r&9Spirit Sheep&r&7 exploded, hitting you for &r&c${*}&r&7 damage.&r",
	"&r&7Your ${*} hit &r&c${*} &r&7enem${*} for &r&c${*} &r&7damage.&r",
	"&r${*} Milestone &r${*}&r&7: You have ${*}&r",
	"&r&cThis ability is on cooldown for ${*}s.&r",
	"&r&cYou already ate this cake recently!&r",
	"&r&a&lYou healed ${*} player${*} for ${*} health!&r",
	"&r&dCreeper Veil &r&aActivated!&r",
	"&r&dCreeper Veil &r&cDe-activated!&r"
]

let userEdits = FileLib.read("soopyAddonsData", "messagesDontEdit.json");

userEdits = JSON.parse(userEdits)

hideMessages.forEach((message) => {
	register("chat", (e) => {
		
		if (userEdits.includes(message)) {
			return;
		}
		if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Block some useless messages")) {
			cancel(e)
		}
	}).setChatCriteria(message)
})

register("chat", (e) => {

	cancel(e)

	betterBreak("&2", undefined, true)
	ChatLib.chat("&cMessages that are HIDDEN")
	betterBreak("&2", undefined, true)

	let i = 0
	hideMessages.forEach((message) => {
		let editMsg;
		let editMsgToggle;
		let includes;
		if (userEdits.includes(message)) {
			editMsg = "&c[LEAVING] &r"
			editMsgToggle = "ENABLE"
			includes = true
		} else {
			editMsg = "&a[EDITING] &r"
			editMsgToggle = "DISABLE"
			includes = false
		}
		let chatMsg = new Message(new TextComponent(editMsg + message)
			.setHover("show_text", ChatLib.addColor("&cClick to " + editMsgToggle + " editing this message: &r" + message))
			.setClickAction("run_command")
			.setClickValue("/soopyaddons_editmsg " + includes + " 0 " + i))


		chatMsg.chat()
		i++
	})

	betterBreak("&2", undefined, true)
	ChatLib.chat("&cMessages that are MOVED")
	betterBreak("&2", undefined, true)

	i = 0

	moveMessages.forEach((message) => {
		let editMsg;
		let editMsgToggle;
		let includes;
		if (userEdits.includes(message)) {
			editMsg = "&c[LEAVING] &r"
			editMsgToggle = "ENABLE"
			includes = true
		} else {
			editMsg = "&a[EDITING] &r"
			editMsgToggle = "DISABLE"
			includes = false
		}
		let chatMsg = new Message(new TextComponent(editMsg + message)
			.setHover("show_text", ChatLib.addColor("&cClick to " + editMsgToggle + " editing this message: &r" + message))
			.setClickAction("run_command")
			.setClickValue("/soopyaddons_editmsg " + includes + " 1 " + i))

		chatMsg.chat()
		i++
	})

}).setChatCriteria("&r&cOPENING MESSAGE EDITS&r")

register("command", (value, what, index) => {
	let message;
	index = parseInt(index)
	if (what === "0") {
		message = hideMessages[index]
	} else {
		message = moveMessages[index]
	}

	if (value === "true") {
		// ChatLib.chat("Enabling editing the message:")
		// ChatLib.chat(message)

		userEdits = userEdits.filter((edit) => {
			return edit !== message;
		})
	} else {
		// ChatLib.chat("No longer editing the message:")
		// ChatLib.chat(message)

		userEdits.push(message)
	}

	let editMsg;
	let editMsgToggle;
	let includes;
	if (userEdits.includes(message)) {
		editMsg = "&c[LEAVING] &r"
	} else {
		editMsg = "&a[EDITING] &r"
	}
	// let chatMsg = new Message(new TextComponent(editMsg + message)
	// 	.setHover("show_text", ChatLib.addColor("&cClick to " + editMsgToggle + " editing this message: &r" + message))
	// 	.setClickAction("run_command")
	// 	.setClickValue("/soopyaddons_editmsg " + includes + " " + what + " " + index))


	let chatMsg = new Message(new TextComponent(editMsg + message)
		.setHover("show_text", ChatLib.addColor("&cTo toggle this message, go back into /soopyaddons and re-open this menu: &r" + message)))
	// .setClickAction("run_command")
	// .setClickValue("/soopyaddons_editmsg " + includes + " " + what + " " + index))

	if (!userEdits.includes(message)) {
		editMsg = "&c[LEAVING] &r"
		editMsgToggle = "ENABLE"
		includes = true
	} else {
		editMsg = "&a[EDITING] &r"
		editMsgToggle = "DISABLE"
		includes = false
	}
	let chatMsgOld = new Message(new TextComponent(editMsg + message)
		.setHover("show_text", ChatLib.addColor("&cClick to " + editMsgToggle + " editing this message: &r" + message))
		.setClickAction("run_command")
		.setClickValue("/soopyaddons_editmsg " + includes + " " + what + " " + index))
	ChatLib.editChat(chatMsgOld, chatMsg)

	saveUserEdits()
}).setName("soopyaddons_editmsg")

function saveUserEdits() {
	FileLib.write("soopyAddonsData", "messagesDontEdit.json", JSON.stringify(userEdits))
}

moveMessages.forEach((message) => {
	register("chat", (e) => {
		if (userEdits.includes(message)) {
			return;
		}
		if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Just block the messages from showing instead of moving them")) {
			cancel(e)
			return;
		}
		if (settings.getSetting("Spam hider", "Enable spam hider") && settings.getSetting("Spam hider", "Move some messages from main chat and to the right side of the screen")) {
			chatEvent(e)
		}
	}).setChatCriteria(message)
})

function chatEvent(e) {

	if (e !== undefined) {
		cancel(e)
	}

	let message = ChatLib.getChatMessage(e, true)
	newSideMessage(message)
}



//oth4er stuff



register("command", () => {
	ChatLib.command("warp home");

	setTimeout(() => {
		ChatLib.command("warp hub");
	}, 2000)
}).setName("newhub");





//STREEMER GAME STUFF!
//I need to move this to a seperate module so its just commented out rn

// let serverAddress = "http://soopymc.my.to"

// //TriggerRegister.registerChat((e)=>{ChatLib.chat("efkjgbsgbyrsgbfbdfgbhdsf")}).setChatCriteria("&r             ${*}&r&f&l${*}&r")


// let replaceGameName = {}

// function newGame() {
// 	ChatLib.chat("Choosing Game...")
// 	getPlayerChoices()
// }
// function getReplace() {
// 	sendRequestNoBase(serverAddress + "/sgc/replace.json").then((resp) => {
// 		replaceGameName = resp
// 	})
// }
// getReplace()


//Party finder stuff
//&dDungeon Finder &r&f> &r&6Hiryan &r&ejoined the dungeon group! (&r&bMage Level 7&r&e)&r



let commandsQueue = []

let commandsQueueLastTime = new Date().getTime()

let lastRender = new Date().getTime();

let correctLividColor = undefined
let correctLividColorHP = undefined
let sayLividColors = []
let sayLividColors2 = []
let lividColor = {
	"Vendetta": "&f",
	"Crossed": "&d",
	"Hockey": "&c",
	"Doctor": "&7",
	"Frog": "&2",
	"Smile": "&a",
	"Scream": "&1",
	"Purple": "&5",
	"Arcade": "&e"
}

let gameOpened = new Date().getTime()

register("renderWorld", (ticks) => {
	
	startFunctionPerformanceAnalize("Main renderworld event")
	let time = new Date().getTime() + (Instant.now().getNano() / 1000000000);
	msPerFrameLast = time - lastRender
	lastRender = time
	let timeSinceGameOpened = time - gameOpened
	if (iceData.render && settings.getSetting("Dungeons", "Ice Puzzle solver")) {

		let x = iceData.playerX
		let y = iceData.playerY
		let z = iceData.playerZ
		let i = 1;
		let lastPos = [x + 0.5, y + 0.1, z + 0.5]
		let lastPos2 = [x + 0.5, y + 0.1, z + 0.5]
		let renderI = 0;
		iceData.solution.forEach((solMov) => {
			i++
			let loops = 4
			
			for (let o = 0; o < loops;o+= 1) {

				timeSinceGameOpened -= 25

				if (solMov == 0) {
					x += (1 / loops)
				}
				if (solMov == 1) {
					x -= (1 / loops)
				}
				if (solMov == 2) {
					z += (1 / loops)
				}
				if (solMov == 3) {
					z -= (1 / loops)
				}

				let positions = [
					lastPos2[0],
					lastPos2[1],
					lastPos2[2],
					lastPos[0],
					lastPos[1],
					lastPos[2],
					x + 0.5,
					y + 0.1,
					z + 0.5
				]

				if(renderI%2===0){
					drawCurve(...positions, timeSinceGameOpened)
				}

				lastPos2 = [...lastPos]
				lastPos = [x + 0.5, y + 0.1, z + 0.5]
				renderI++
			}
		})
	}

	

	boxes.forEach((render) => {
		drawBoxAtEntity(...render, ticks)
	})

	
	if (settings.getSetting("Other", "Puzzler solver")) {
		if(puzzleLocaion !== undefined){
			drawBoxAtBlock(...puzzleLocaion, 0, 255, 0)
		}
	}
	if (settings.getSetting("Dungeons", "Three associates solver")) {
		if(threemanLoc !== undefined){
			drawBoxAtBlock(...threemanLoc, 0, 0, 255)
		}
	}
	// if (settings.getSetting("Dungeons", "Bomb defuse solver")) {
	// 	bombDefuseSolver.render()
	// }
	

	if(lastPath !== undefined && settings.getSetting("Events","Griffin burrow waypoints") && settings.getSetting("Events","Griffin burrow waypoints Show path")){
		let startPoint = [Player.getX(),
			Player.getY(),
			Player.getZ()]

		let points = burrialData.locations.map((a)=>{return [a.x+0.5,a.y+1.3,a.z+0.5]})


		let lastPoint = startPoint

		lastPath.forEach((point)=>{
			let pointLoc = points[point]

			drawLine(...lastPoint,...pointLoc,255,255,0)

			lastPoint = pointLoc
		})
	}	

	if(settings.getSetting("Events","Griffin burrow waypoints")){
		let sorted = burrialData.locations.sort((a,b)=>{
			let aDist = calculateDistance([Player.getX(),Player.getY(),Player.getZ()],[a.x+0.5,a.y+2.5,a.z+0.5])
			let bDist = calculateDistance([Player.getX(),Player.getY(),Player.getZ()],[b.x+0.5,b.y+2.5,b.z+0.5])

			return bDist-aDist
		})
		let nearestI = 0
		sorted.forEach((loc, i)=>{
			if(!loc.clicked){
				if(nearestI < i){
					nearestI = i
				}
			}
		})
		sorted.forEach((loc,i)=>{
			let nearest = i===nearestI

			let typeReplace = [
				"Start",
				"Mob",
				"Treasure",
				"Finish",
				"Other3"
			]
			if(!loc.clicked){
				drawBoxAtBlock(loc.x, loc.y,loc.z,0,255,0)
			}
			Tessellator.drawString(
				"(" + (loc.chain+1) + "/4) " + typeReplace[loc.type] + " BURRIAL (" + Math.round(calculateDistance([Player.getX(),Player.getY(),Player.getZ()],[loc.x+0.5,loc.y+2.5,loc.z+0.5])) + "m)",
				loc.x+0.5,
				loc.y+1.5,
				loc.z+0.5,
				loc.clicked? 65280:(nearest?16711680:6579300), true, loc.clicked? 0.04:(nearest?1:0.5), !loc.clicked
			);
		})
	}

	endFunctionPerformanceAnalize("Main renderworld event")
})

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255
	};
}

function drawLine(x, y, z, x2, y2, z2, r, g, b) {

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(1);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	Tessellator.begin(3).colorize(r, g, b);

	Tessellator.pos(x, y, z).tex(0, 0);
	Tessellator.pos(x2, y2, z2).tex(0, 0);

	Tessellator.draw();


	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
}
function drawLineSmall(x, y, z, x2, y2, z2, r, g, b) {

	Tessellator.begin(3).colorize(r, g, b);

	Tessellator.pos(x, y, z).tex(0, 0);
	Tessellator.pos(x2, y2, z2).tex(0, 0);

	Tessellator.draw();
}

function pointBetween(one, two, progress) {
	return one + ((two-one) * progress)
}

function drawCurve(x, y, z, x2, y2, z2, x3, y3, z3, timeSinceGameOpened) {

	let oneLine = false
	if(x===x2 && x===x3){
		oneLine = true
	}
	if(z===z2 && z===z3){
		oneLine = true
	}

	if(oneLine){
		GL11.glBlendFunc(770, 771);
		GL11.glEnable(GL11.GL_BLEND);
		GL11.glLineWidth(2);
		GL11.glDisable(GL11.GL_TEXTURE_2D);
		GL11.glDisable(GL11.GL_DEPTH_TEST);
		GL11.glDepthMask(false);
		GlStateManager.func_179094_E();

		let cromaSpinBase = (timeSinceGameOpened / 5) % 360
		let color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)
		drawLineSmall(x,y,z,pointBetween(x,x2,0.5),pointBetween(y,y2,0.5),pointBetween(z,z2,0.5),color.r / 255, color.g / 255, color.b / 255)
		timeSinceGameOpened+=25/4
		cromaSpinBase = (timeSinceGameOpened / 5) % 360
		color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)
		drawLineSmall(pointBetween(x,x2,0.5),pointBetween(y,y2,0.5),pointBetween(z,z2,0.5),x2,y2,z2,color.r / 255, color.g / 255, color.b / 255)
		timeSinceGameOpened+=25/4
		cromaSpinBase = (timeSinceGameOpened / 5) % 360
		color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)
		drawLineSmall(x2,y2,z2,pointBetween(x2,x3,0.5),pointBetween(y2,y3,0.5),pointBetween(z2,z3,0.5),color.r / 255, color.g / 255, color.b / 255)
		timeSinceGameOpened+=25/4
		cromaSpinBase = (timeSinceGameOpened / 5) % 360
		color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)
		drawLineSmall(pointBetween(x2,x3,0.5),pointBetween(y2,y3,0.5),pointBetween(z2,z3,0.5),x3,y3,z3,color.r / 255, color.g / 255, color.b / 255)
		
		GlStateManager.func_179121_F();
		GL11.glEnable(GL11.GL_TEXTURE_2D);
		GL11.glEnable(GL11.GL_DEPTH_TEST);
		GL11.glDepthMask(true);
		GL11.glDisable(GL11.GL_BLEND);
		return;
	}

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(2);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	let lastPos = [x, y, z]

	let loops = 10

	for (let i = 0; i < loops; i++) {

		let lineOnePositions = [
			pointBetween(x, x2, i / loops),
			pointBetween(y, y2, i / loops),
			pointBetween(z, z2, i / loops)
		]
		let lineTwoPositions = [
			pointBetween(x2, x3, i / loops),
			pointBetween(y2, y3, i / loops),
			pointBetween(z2, z3, i / loops)
		]

		let thisPos = [
			pointBetween(lineOnePositions[0], lineTwoPositions[0], i / loops),
			pointBetween(lineOnePositions[1], lineTwoPositions[1], i / loops),
			pointBetween(lineOnePositions[2], lineTwoPositions[2], i / loops)
		]
		
		timeSinceGameOpened -= 25/loops
		let cromaSpinBase = (timeSinceGameOpened / 5) % 360
		let color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)

		drawLineSmall(...lastPos, ...thisPos, color.r / 255, color.g / 255, color.b / 255)

		lastPos = thisPos
	}

	timeSinceGameOpened -= 50/loops
	let cromaSpinBase = (timeSinceGameOpened / 5) % 360
	let color = HSVtoRGB(cromaSpinBase / 360, 0.78, 0.92)

	drawLineSmall(...lastPos, x3,y3,z3, color.r / 255, color.g / 255, color.b / 255)

	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
}



let iceData = {}
let iceSolveCache = {}
let itemsHighlight = []
let itemsHighlight2 = []

let lastTickEvent = true
let lastMsTickTime = 0
let lastTickEventTime = 0

let lastTickEventEpochTimestamp = 0
register("step",()=>{
	new Thread(()=>{
		
		spiritBearName = null

		mortGui.setEnabled(settings.getSetting("Improvements","Better Mort GUI"))


		let boxesnew = []

		World.getAllEntities().forEach((entity) => {
			let entityName = entity.getName()
			if (entityName === Player.getName()) {
				return;
			}
			if (entityName === "Sheep") {
				if((Player.getX()-entity.getX() < 4 || Player.getX()-entity.getX() > -4)
				&& (Player.getY()-entity.getY() < 4 || Player.getY()-entity.getY() > -4)
				&& (Player.getZ()-entity.getZ() < 4 || Player.getZ()-entity.getZ() > -4))
				if(playerDungeonLevels?.selectedClass || "" === "mage" && Math.max(0,(explosiveShotLength-(now-lastExplosiveShotTime))) < 5 && entity.getEntity().func_70104_M()){
					lastExplosiveShotTime = new Date().getTime()

					explosiveShotLength = 30000*(lastMageCooldown || 1-((Math.floor((playerDungeonLevels?.mage + 50 || 50)/2))/100))
				}
				return;
			}
			if (entityName.includes("Spirit Bow")) {
				spiritBearName = "&d&lBow Dropped!"
				return;
			}
			if (entityName.includes("Spirit Bear") && entityName.includes("❤")) {
				spiritBearName = entityName
				return;
			}
			if (/(?:Vendetta|Crossed|Hockey|Doctor|Frog|Smile|Scream|Purple|Arcade) Livid/g.test(entityName)) {
				let lividName = entityName.replace(" Livid", "")

				if (!sayLividColors2.includes(lividName)) {
					sayLividColors2.push(lividName)
					if (sayLividColors2.length === 1) {
						//ChatLib.chat("First livid is: " + lividColor[lividName] + lividName)
						correctLividColor = lividName
					}
					if (sayLividColors2.length === 9) {
						ChatLib.chat("Correct livid is: " + lividColor[lividName] + lividName)
						correctLividColor = lividName
					}
				}
				return;
			}
			if (entityName.includes("Livid") && entityName.includes("❤")) {
				if (!sayLividColors.includes(entityName.substr(0, 5))) {
					sayLividColors.push(entityName.substr(0, 5))
					if (sayLividColors.length === 9) {
						//ChatLib.chat("Correct livid is: " + entity.getName())
						correctLividColorHP = entityName.substr(0, 5)
					}
					if (sayLividColors.length === 1) {
						//ChatLib.chat("Correct livid is: " + entity.getName())
						correctLividColorHP = entityName.substr(0, 5)
					}
				}

				if (sayLividColors.length === 1) {
					if (entityName.includes("Livid") && entityName.includes("❤")) {
						spiritBearName = entityName
					}
				} else {
					if (correctLividColorHP !== undefined) {
						if (correctLividColor === "Arcade") {
							spiritBearName = "Unknown Health (Yellow Livid)"
						} else {
							if (entityName.includes(correctLividColorHP)) {
								spiritBearName = entityName
							}
						}
					}
				}

			}

			if (settings.getSetting("Dungeons", "Put a box around bats")) {
				if (entityName === "Bat") {
					boxesnew.push([entity, 0, 255, 0, null, null]);
				}
			}
			if (settings.getSetting("Dungeons", "Show box around Spirit Bear and Spirit Bow and Correct Livid")) {
				if (entityName.includes("Spirit Bear") || entityName.includes("Spirit Bow")) {
					boxesnew.push([entity, 75, 0, 130, null, null]);
				}
				if (sayLividColors.length === 1) {
					if (entityName.includes("Livid") && entityName.includes("❤")) {
						boxesnew.push([entity, 75, 0, 130, 0.75, -2]);
					}
				} else {
					if (correctLividColor !== undefined) {
						if (entityName === correctLividColor + " Livid") {
							boxesnew.push([entity, 75, 0, 130, 0.75, 2]);
						}
					}
				}
			}

			if (settings.getSetting("Dungeons", "Put a red box around skeleton masters")) {
				if (entityName.includes("Skeleton Master") && entity.getEntity() instanceof ArmourStandClass) {
					boxesnew.push([entity, 255, 0, 0, 0.75, -2]);
				}
			}
			// if (new RegExp("&8\[&7Lv[0-9]{1,3}\&8] &[0123456789ABCDEFLMNOabcdeflmno]" + Player.getName() + "'s( [A-Z][A-z]*)+").test(entity.getName())) {
			// 	let result = entity.getName().match(new RegExp("&8\\[&7Lv([0-9]{1,3})\\&8] (&[0123456789ABCDEFLMNOabcdeflmno])Soopyboo32's (( *[A-Z][A-z]*)+)"))
			// 	let petLevel = parseInt(result[1])
			// 	let letColor = result[2]
			// 	let petName = result[3]

			// 	let petTierColor = {
			// 		"COMMON": "&f",
			// 		"UNCOMMON": "&a",
			// 		"RARE": "&9",
			// 		"EPIC": "&5",
			// 		"LEGENDARY": "&6"
			// 	}

			// }
		})

		boxes = boxesnew

	}).start()
}).setFps(1)


register("tick", () => {
	
	startFunctionPerformanceAnalize("Main tick event")

	let now = new Date().getTime()

	if(now-lastTickEventEpochTimestamp < 1000/10){
		return;
	}
	lastTickEventEpochTimestamp = now

	setLocation(settings.getSetting("Spam hider", "What corner of the screen?"),
		settings.getSetting("Spam hider", "ADVANCED: x Offset"),
		settings.getSetting("Spam hider", "ADVANCED: y Offset"))

	if (!settings.getSetting("Performance", "Enable Tick event")) { 
		if(lastTickEvent){
			lastTickEvent = false;
			ChatLib.chat("&cWARNING: TICK EVENT IS DISABLED, IT NEEDS TO BE ENABLED FOR MOST OF THE FEATURES TO WORK!")
		}
		return; 
	}else{
		if(!lastTickEvent){
			lastTickEvent = true;
		}
	}
	
	itemsHighlight = []
	itemsHighlight2 = []
	if (Player.getOpenedInventory() !== null && settings.getSetting("Dungeons", "Among us solvers")) {
		if (ChatLib.removeFormatting(Player.getOpenedInventory().getName()).startsWith("What starts with: '") && ChatLib.removeFormatting(Player.getOpenedInventory().getName()).endsWith("'?")) {
			let letter = ChatLib.removeFormatting(Player.getOpenedInventory().getName()).substr(19, 1).toLowerCase()
			let i = 0;
			Player.getOpenedInventory().getItems().forEach((item) => {
				if (ChatLib.removeFormatting(item.getName()).toLowerCase().startsWith(letter) && !item.isEnchanted()) {
					itemsHighlight.push(i)
				}
				i++
			})
		}
		if (ChatLib.removeFormatting(Player.getOpenedInventory().getName()).startsWith("Select all the ") && ChatLib.removeFormatting(Player.getOpenedInventory().getName()).endsWith(" items!")) {
			let color = ChatLib.removeFormatting(Player.getOpenedInventory().getName()).substr(15).replace(" items!", "").toLowerCase()
			let i = 0;//silver -> light grey die, white -> wool--
			Player.getOpenedInventory().getItems().forEach((item) => {
				if (ChatLib.removeFormatting(item.getName()).toLowerCase().replace("light grey die", "silver light grey die").replace("wool", "white wool").includes(color) && !item.isEnchanted()) {
					itemsHighlight.push(i)
				}
				i++
			})
		}
		if (ChatLib.removeFormatting(Player.getOpenedInventory().getName()) === "Click in order!") {
			let i = 0;//silver -> light grey die, white -> wool--
			let number = 100;
			Player.getOpenedInventory().getItems().forEach((item,i) => {
				if([...clickQueue,clickQueueDone].includes(i)){return;}
				if (parseInt(ChatLib.removeFormatting(item.getName())) < number && item.getMetadata() === 14) {
					number = parseInt(ChatLib.removeFormatting(item.getName()))
				}
				i++
			})
			i = 0
			Player.getOpenedInventory().getItems().forEach((item) => {
				if (parseInt(ChatLib.removeFormatting(item.getName())) === number) {
					itemsHighlight.push(i)
				}
				i++
			})
			i = 0
			Player.getOpenedInventory().getItems().forEach((item) => {
				if (parseInt(ChatLib.removeFormatting(item.getName())) === number + 1) {
					itemsHighlight2.push(i)
				}
				i++
			})
		}
	}
	

	//fps

	fpsDis = (fpsDis || 0) + ((1 / (msPerFrameLast / 1000)) - (fpsDis || 0)) / 50

	let hypKillsNew = 0


	hyperionKills = hyperionKills.filter((a)=>{
		if(now-a.time > 1000){
			return false;
		}else{
			hypKillsNew+=a.num
			return true;
		}
	})

	hypKills = Math.max(hypKillsNew,hypKills-1-Math.floor(hypKills/20))
	
	if(lastMsTickTime>5 && now-lastTickEventTime < 1000){
		return;
	}

	lastTickEventTime = now
	let startTime = new Date().getTime()

	if (new Date().getTime() - lastTime1 > (isSoopy ? 3000 : 10000)) {
		lastTime1 = new Date().getTime()
		loadLobbyPlayerStats()
	}



	if (new Date().getTime() - commandsQueueLastTime > 500) {
		commandsQueueLastTime = new Date().getTime()
		if (commandsQueue.length > 0) {
			let thing = commandsQueue.shift()
			if (thing !== "") {
				ChatLib.say(thing)
			}
		}
	}



	//keybind

	// if (streamGameKeyBind.isPressed()) {
	// 	newGame()
	// }

	inDungeons = false
	let dis1 = false
	let dis2 = false
	let dis3 = false
	bossSlainMessage = false
	bossSpawnedMessage = false
	dungeon80 = null
	dungeon1m = null

	Scoreboard.getLines().forEach((line) => {
		if (ChatLib.removeFormatting(line.getName()).toLowerCase().includes("dungeon")) {
			inDungeons = true
		}

		if (line.getName().includes('Boss slain!')) {
			bossSlainMessage = true
		}

		if (line.getName().includes('Slay the boss!')) {
			dis1 = true
			bossSpawnedMessage = true
		}
		if (line.getName().includes('Dungeon Cleared:')) {
			if (parseInt(line.getName().substr(19, 2)) >= 80) {
				dis2 = true
				if (now - lastDungBelow80 < 5000) {
					dungeon80 = line.getName()
				}

			}
		}

		if (line.getName().includes('Time Elapsed: ')) {
			if (line.getName().substr(16, 2) === "01") {
				dis3 = true
				if (now - lastDungbelow1m < 5000) {
					dungeon1m = line.getName()
				}
			}
		}

	})
	if (!dis1) {
		lastBossNotSpawnedTime = now
		bossSpawnedMessage = false
	}
	if (!dis2) {
		lastDungBelow80 = now
	}
	if (!dis3) {
		lastDungbelow1m = now
	}


	//other
	worldTime++

	//Puzzle solvers

	//ice walk


	let playerX = Math.floor(Player.getX())
	let playerY = Math.floor(Player.getY())
	let playerZ = Math.floor(Player.getZ())
	

	if (World.getBlockAt(playerX, playerY - 1, playerZ).getRegistryName() === "minecraft:packed_ice" || World.getBlockAt(playerX, playerY - 1, playerZ).getRegistryName() === "minecraft:ice" && settings.getSetting("Dungeons", "Ice Puzzle solver")) {
		if (!updatingIce) {
			updatingIce = true
			//ChatLib.chat("Updating")
			new Thread(() => {
				let blocks = []
				let blocksNeeded = []

				for (let x = -10; x < 10; x++) {
					blocks[x + 10] = []
					for (let y = -10; y < 10; y++) {
						if (World.getBlockAt(playerX + x, playerY - 1, playerZ + y).getRegistryName() === "minecraft:ice" && World.getBlockAt(playerX + x, playerY, playerZ + y).getRegistryName() === "minecraft:air") {
							blocks[x + 10][y + 10] = 0;
							blocksNeeded.push([x + 10, y + 10])
						} else {
							blocks[x + 10][y + 10] = 1;
						}
						if (x == 0 && y == 0) {
							blocks[x + 10][y + 10] = 2
						}
					}
				}

				let solution = [-1]
				let skipPaths = []

				//skilPaths in format [solutionId, skipId]
				//skipId 1 = skip x++ and x--

				//x++ = 0
				//x-- = 1
				//y++ = 2
				//y-- = 3
				let blockData = []
				blocks.forEach((b) => {
					blockData.push([...b])
				})
				let solved = false
				let loops = 0
				let solvX = 10;
				let solvY = 10;
				while (!solved) {
					loops++

					if(loops%1000 === 0){
						let block = World.getBlockAt(Math.floor(Player.getX()),Math.floor(Player.getY()) -1,Math.floor(Player.getZ())).getName()
						if(block !== "Ice" && block !== "Packed Ice"){
							iceData.render = false;
							break;
						}
					}

					if (solution.length === 0) {
						iceData.render = false;
						//ChatLib.chat("No solution! (Back to far)")
						break;
					}

					if (skipPaths[solution.length] == undefined) {
						skipPaths[solution.length] = -1
					}

					let skipData = skipPaths[solution.length]

					//blocks.forEach((a) => { ChatLib.chat(a.join(" ")) })

					//ChatLib.chat("Solution: " + solution.join(","))
					//ChatLib.chat("Solution: " + solution.join(",") + " (" + skipData + ")")
					//ChatLib.chat("Cache: " + iceSolveCache[blockData.map(b => b.join("")).join(",")])
					// ChatLib.chat("[" + blocks[solvX + 1][solvY + 1] + "," + blocks[solvX + 0][solvY + 1] + "," + blocks[solvX - 1][solvY + 1] + "]")
					// ChatLib.chat("[" + blocks[solvX + 1][solvY] + "," + blocks[solvX + 0][solvY] + "," + blocks[solvX - 1][solvY] + "]")
					//ChatLib.chat("[" + blocks[solvX + 1][solvY - 1] + "," + blocks[solvX + 0][solvY - 1] + "," + blocks[solvX - 1][solvY - 1] + "]")
					//if (iceSolveCache[blockData.map(b => b.join("")).join(",")] === undefined) {

					let impossible = false
					let blocksAlone = 0

					blocksNeeded.forEach((loc) => {
						if (blockData[loc[0]][loc[1]] === 0) {
							let a = 0
							try{
								if(blockData[loc[0]][loc[1] + 1] >= 1){
									a++
								}
							}catch(e){a++}
							try{
								if(blockData[loc[0]][loc[1] - 1] >= 1){
									a++
								}
							}catch(e){a++}
							try{
								if(blockData[loc[0] + 1][loc[1]] >= 1){
									a++
								}
							}catch(e){a++}
							try{
								if(blockData[loc[0] - 1][loc[1]] >= 1){
									a++
								}
							}catch(e){a++}
							if (a>=3) {
								blocksAlone++
								if(a === 4){
									blocksAlone++
								}
								if (blocksAlone >= 3) {
									impossible = true
								}
							}
						}
					})

					if(impossible){
						
						if (skipData < 3) {
							skipPaths[solution.length]++
						} else {
							//ChatLib.chat("Setting cache Impossible")
							//iceSolveCache[blockData.map(b => b.join("")).join(",")] = "impossible"
							skipPaths.pop()
							solution.pop()

							blockData = []
							blocks.forEach((b) => {
								blockData.push([...b])
							})

							solvX = 10;
							solvY = 10;
							blockData[solvX][solvY] = 2
							solution.forEach((step) => {
								blockData[solvX][solvY] = 1
								if (step === 0) {
									solvX++
								}
								if (step === 1) {
									solvX--
								}
								if (step === 2) {
									solvY++
								}
								if (step === 3) {
									solvY--
								}
								blockData[solvX][solvY] = 2
							})
						}

					}else{

					if (blockData[solvX + 1][solvY] === 0 && skipData < 0) { //block at x++ is free
						skipPaths[solution.length] = 0
						solution.push(0)
						blockData[solvX][solvY] = 1
						solvX++
						blockData[solvX][solvY] = 2
					} else {
						if (blockData[solvX - 1][solvY] === 0 && skipData < 1) { //block at x-- is free
							skipPaths[solution.length] = 1
							solution.push(1)
							blockData[solvX][solvY] = 1
							solvX--
							blockData[solvX][solvY] = 2
						} else {
							if (blockData[solvX][solvY + 1] === 0 && skipData < 2) { //block at y++ is free
								skipPaths[solution.length] = 2
								solution.push(2)
								blockData[solvX][solvY] = 1
								solvY++
								blockData[solvX][solvY] = 2
							} else {
								if (blockData[solvX][solvY - 1] === 0 && skipData < 3) { //block at y-- is free
									skipPaths[solution.length] = 3
									solution.push(3)
									blockData[solvX][solvY] = 1
									solvY--
									blockData[solvX][solvY] = 2
								} else {
									//Cant go in any direction, u need to reverse steps now lmao nub
									//unless u got it correct

									//correct checking:
									let isCorrect = true

									blockData.forEach((b) => {
										b.forEach((a) => {
											if (a === 0) {
												isCorrect = false
											}
										})
									})

									if (!isCorrect) {
										if (skipData < 3) {
											skipPaths[solution.length]++
										} else {
											//ChatLib.chat("Setting cache Impossible")
											//iceSolveCache[blockData.map(b => b.join("")).join(",")] = "impossible"
											skipPaths.pop()
											solution.pop()

											blockData = []
											blocks.forEach((b) => {
												blockData.push([...b])
											})

											solvX = 10;
											solvY = 10;
											blockData[solvX][solvY] = 2
											solution.forEach((step) => {
												blockData[solvX][solvY] = 1
												if (step === 0) {
													solvX++
												}
												if (step === 1) {
													solvX--
												}
												if (step === 2) {
													solvY++
												}
												if (step === 3) {
													solvY--
												}
												blockData[solvX][solvY] = 2
											})
										}

									} else {
										solved = true
										iceData.render = true
										//iceSolveCache[blocks.map(b => b.join("")).join(",")] = solution.join("").replace("NaN1", "").substr(2)
										// ChatLib.chat("Solved!")
										// ChatLib.chat("Setting cache Solved")

										// blockData = []
										// blocks.forEach((b) => {
										// 	blockData.push([...b])
										// })

										// solvX = 10;
										// solvY = 10;
										// blockData[solvX][solvY] = 2
										// let solutionSoFar = []
										// solution.forEach((step) => {
										// 	blockData[solvX][solvY] = 1
										// 	if (step === 0) {
										// 		solvX++
										// 	}
										// 	if (step === 1) {
										// 		solvX--
										// 	}
										// 	if (step === 2) {
										// 		solvY++
										// 	}
										// 	if (step === 3) {
										// 		solvY--
										// 	}
										// 	blockData[solvX][solvY] = 2
										// 	solutionSoFar.push(step)
										// 	iceSolveCache[blockData.map(b => b.join("")).join(",")] = solution.join("").replace(solutionSoFar.join("").replace("NaN1", "").substr(2)).replace("NaN1", "").substr(2)
										// })
									}
								}
							}
						}
					}
				}
					// } else {
					// 	if (iceSolveCache[blockData.map(b => b.join("")).join(",")] === "impossible") {

					// 		ChatLib.chat("Skipping due to impossible (cache)")

					// 		skipPaths.pop()
					// 		solution.pop()

					// 		blockData = []
					// 		blocks.forEach((b) => {
					// 			blockData.push([...b])
					// 		})

					// 		solvX = 10;
					// 		solvY = 10;
					// 		blockData[solvX][solvY] = 1
					// 		solution.forEach((step) => {
					// 			if (step === 0) {
					// 				solvX++
					// 			}
					// 			if (step === 1) {
					// 				solvX--
					// 			}
					// 			if (step === 2) {
					// 				solvY++
					// 			}
					// 			if (step === 3) {
					// 				solvY--
					// 			}
					// 			blockData[solvX][solvY] = 1
					// 		})
					// 	} else {
					// 		ChatLib.chat("Solved (cache)")
					// 		solution = [...solution.map(a => parseInt(a.toString().replace("NaN1", ""))), ...iceSolveCache[blockData.map(b => b.join("")).join(",")].replace("NaN", "").split("").map(a => (a !== -1 && parseInt(a) !== NaN ? parseInt(a) : ""))]
					// 		solution = solution.join("").replace("NaN1", "").replace("-1", "")
					// 		ChatLib.chat(solution)
					// 		solved = true
					// 		iceData.render = true
					// 		iceSolveCache[blocks.map(b => b.join("")).join(",")] = solution
					// 		solution = solution.split("")
					// 	}
					// }
				}

				iceData.solution = solution
				iceData.map = blocks
				iceData.playerX = playerX
				iceData.playerY = playerY
				iceData.playerZ = playerZ
				//ChatLib.chat("----------------------")
				updatingIce = false
			}).start()

		}
	} else {
		iceData.render = false;
	}


	if(settings.getSetting("Events","Griffin burrow waypoints") && settings.getSetting("Events","Griffin burrow waypoints Show path")){
		let startPoint = [Player.getX(),Player.getY(),Player.getZ()]

		let points = burrialData.locations.filter((a)=>{return !a.clicked}).map((a)=>{return [a.x+0.5,a.y+1.3,a.z+0.5]})


		lastPath = fastestPathThrough(startPoint,points)
		
		if(lastPath.length === 0){
			lastPath = undefined
		}
	}

	lastMsTickTime = new Date().getTime()-startTime

	
	endFunctionPerformanceAnalize("Main tick event")
})

let boxes = []
let updatingLong = false


let colorReplace = {
	"§6":Renderer.color(255,170,0,150),
	"§9":Renderer.color(85,85,255,150),
	"§d":Renderer.color(255,85,255,150),
	"§5":Renderer.color(170,0,170,150),
	"§e":Renderer.color(255,255,85,150),
	"§7":Renderer.color(170,170,170,150),
	"§c":Renderer.color(255,85,85,150),
	"§f":Renderer.color(255,255,255,150),
	"§a":Renderer.color(85,255,85,150)
}

let clickQueue = []
let clickQueueDone = undefined
let lastInventoryString = ""
let lastClickTime = 0

function getInventoryString(){
	if(Player.getOpenedInventory() === null){
		return "null"
	}

	return Player.getOpenedInventory().getItems().map((item)=>{
		return item == null || item.getID() === -1 ? "null" : (item.getRegistryName() + ";" + item.getStackSize() + ";" + item.isEnchanted() + ";" + item.getRawNBT() + ";" + item.getMetadata())
	}).join("/")
}

register("tick",()=>{
	
	startFunctionPerformanceAnalize("Terminal queue tick event")
	//console.log("------------------------")
	//console.log(0)
	let currInvStr = getInventoryString() // A string unique to the items in the inv, will get changed if anything changes with them
	if(new Date().getTime()-lastClickTime < 1000){
		//console.log(1)
		if(clickQueue.length === 0 && clickQueueDone === undefined){
			return
		}
		//console.log(2)
		
		if(currInvStr === lastInventoryString){
			return;
		}
		//console.log(3)
	}else{
		//console.log(4)
		if(clickQueueDone === undefined){
			//console.log(4.1)
			if(clickQueue.length === 0){
				//console.log(4.2)
				return;
			}else{
				//console.log(4.3)
			}
		}
		//console.log(5)
	}
	//console.log(6)
	lastInventoryString = currInvStr
	lastClickTime = new Date().getTime()
	
	//console.log(7)
	if(clickQueue.length > 0){
		//console.log(8)
		if(Player.getOpenedInventory().getSize() !== 45){
			//console.log(9)
			let slot = clickQueue.shift()
			Player.getOpenedInventory().click(slot,false,"MIDDLE")
			Player.getOpenedInventory().getStackInSlot(slot).setStackSize(0)
			clickQueueDone = slot
		}else{
			//console.log(10)
			clickQueue = []
			clickQueueDone = undefined
			lastClickTime = 0
		}
		//console.log(11)
	}else{
		//console.log(12)
		clickQueueDone = undefined
		lastClickTime = 0
	}
	//console.log(13)
	endFunctionPerformanceAnalize("Terminal queue tick event")
})


register("guiMouseClick",(mouseX,mouseY,button,gui,event)=>{

	if(!settings.getSetting("Dungeons","Better terminal clicking")){return;}
    let inventory;
    try {
        inventory = Player.getOpenedInventory();
    } catch (e) {
        return
	}
	if(itemsHighlight.length + itemsHighlight2.length > 0){
		cancel(event)
	}else{
		let names = ["correct all the panes!","navigate the maze!"]
		if(names.includes(ChatLib.removeFormatting(Player.getOpenedInventory().getName().toLowerCase()))){
			if(Player.getOpenedInventory() !== null){
				let slot = 0
				while(slot < inventory.getSize()-1){
					const x = slot % 9;
					const y = Math.floor(slot / 9);
					const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
					const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);
			
					if(mouseX>renderX-10 && mouseX < renderX+10
					&& mouseY > renderY-10 && mouseY < renderY+10){
						if(settings.getSetting("Dungeons","Queue terminal clicking") && ChatLib.removeFormatting(Player.getOpenedInventory().getName().toLowerCase()) !== "navigate the maze!"){
							if(!clickQueue.includes(slot)){
								clickQueue.push(slot)
							}
						}else{
							Player.getOpenedInventory().click(slot,false,"MIDDLE")
						}
						cancel(event)
						break;
					}

					slot++
				}
			}
		}
		return;
	}
	itemsHighlight.forEach((slot, i) => {
		if(clickQueue.includes(slot)){
			return;
		}
        const x = slot % 9;
        const y = Math.floor(slot / 9);
        const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
        const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);

		if(mouseX>renderX-8 && mouseX < renderX+8
		  && mouseY > renderY-8 && mouseY < renderY+8){
			if(settings.getSetting("Dungeons","Queue terminal clicking")){
				if(!clickQueue.includes(slot)){
					clickQueue.push(slot)
				}
			}else{  
				Player.getOpenedInventory().click(slot,false,"MIDDLE")
			}
			//Player.getOpenedInventory().click(slot,false,"MIDDLE")
		}
	})
	
})

register("itemTooltip",(lore, item, event)=>{
	if(itemsHighlight.length + itemsHighlight2.length > 0){
		cancel(event)
	}
})

register("postGuiRender", (gui, mouseX, mouseY) => {
	
	startFunctionPerformanceAnalize("Post gui render event")
	//render code from ExperimentationTable because mine wouldent work 50% of the time

    let inventory;
    try {
        inventory = Player.getOpenedInventory();
    } catch (e) {
        return;
    }
	GlStateManager.func_179094_E(); // push
	itemsHighlight.forEach((slot) => {
		if([...clickQueue,clickQueueDone].includes(slot)){return;}
        const x = slot % 9;
        const y = Math.floor(slot / 9);
        const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
        const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);

        Renderer.translate(0, 0, 260);
		Renderer.drawRect(Renderer.color(0, 255, 0, 200), renderX-8, renderY-8, 16, 16);
		
	})
	itemsHighlight2.forEach((slot) => {
        const x = slot % 9;
        const y = Math.floor(slot / 9);
        const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
        const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);

        Renderer.translate(0, 0, 260);
        Renderer.drawRect(Renderer.color(255, 255, 0, 200), renderX-8, renderY-8, 16, 16);
	})
	clickQueue.forEach((slot,i) => {
        const x = slot % 9;
        const y = Math.floor(slot / 9);
        const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
        const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);

        Renderer.translate(0, 0, 260);
		Renderer.drawRect(Renderer.color(50, 50,50, 200), renderX-8, renderY-8, 16, 16);
		Renderer.translate(0,0,100)
		Renderer.drawStringWithShadow(i+1,renderX-(Renderer.getStringWidth(i+1)/2), renderY-3.5)
	})
	
	const x = clickQueueDone % 9;
	const y = Math.floor(clickQueueDone / 9);
	const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
	const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);
	Renderer.translate(0,0,100)
	Renderer.drawStringWithShadow("0",renderX-(Renderer.getStringWidth("0")/2), renderY-3.5)

	Renderer.translate(0, 0, 260);
	Renderer.drawRect(Renderer.color(50, 50,50, 200), renderX-8, renderY-8, 16, 16);

	// if(settings.getSetting("Other","Item rarity halo")){
	// 		inventory.getItems().forEach((item, slot) =>{
	// 			try{
	// 				const x = slot % 9;
	// 				const y = Math.floor(slot / 9);
	// 				const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
	// 				const renderY = (Renderer.screen.getHeight() + 10) / 2 + ((y - inventory.getSize() / 18) * 18);

	// 				let lore = item.getNBT().getCompoundTag("tag").getCompoundTag("display").getRawNBT().func_150295_c("Lore",8) //getTagList()
	// 				let color = lore.func_150307_f(lore.func_74745_c()-1).substr(0,2) //lore.getStringTagAt(lore.tagCount()-1)

	// 				color = colorReplace[color]

	// 				if(color !== undefined){
	// 					if(settings.getSetting("Other","Item rarity halo as circle")){
	// 						Renderer.drawCircle(color,renderX, renderY+8,8,15)
	// 					}
	// 				}
	// 			}catch(e){}
	// 		})
	// }
	GlStateManager.func_179121_F(); // pop
	
	
	endFunctionPerformanceAnalize("Post gui render event")
})


//Puzzler solver

//&e[NPC] &dPuzzler&f: &r&5▶&5▶&b◀&d▲&b◀&d▲&d▲&a▼&d▲&d▲&r
//on message
//1) find puzzler
//2) block he is standing on
//3) do loop over directions

let puzzleLocaion = undefined

register("chat",(directions)=>{
	if(directions.includes("&")){
		let dirArray = directions.split("&")

		let startLoc = [181,195,135]

		dirArray.forEach((dir)=>{
			switch(dir.substr(0,1)){
				case "5":
					startLoc[0]--
				break;
				case "b":
					startLoc[0]++
				break;
				case "d":
					startLoc[2]++
				break;
				case "a":
					startLoc[2]--
				break;
			}
		})

		puzzleLocaion = startLoc
	}
	if(directions.includes("Nice!")){
		puzzleLocaion = undefined
	}
}).setChatCriteria("&e[NPC] &dPuzzler&f: &r${directions}&r")
//&e[NPC] &dPuzzler&f: &r&d▲&a▼&b◀&d▲&d▲&5▶&d▲&a▼&5▶&d▲&r

register("worldLoad",()=>{
	puzzleLocaion = undefined
	threemanLoc = undefined
	lastExplosiveShotTime = -1
	lastMageCooldown = undefined
})

let threemanLoc = undefined


function drawBoxAtBlock(x, y, z, colorR, colorG, colorB){

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(3);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	
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

	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
}

function drawBoxAtEntity(entity, colorR, colorG, colorB, width, height, partialTicks){
	let x = entity.getX() + ((entity.getX()-entity.getLastX())*partialTicks)
	let y = entity.getY() + ((entity.getY()-entity.getLastY())*partialTicks)
    let z = entity.getZ() + ((entity.getZ()-entity.getLastZ())*partialTicks)
    
    if(width === null){
        width = entity.getWidth()/2
        height = entity.getHeight()
    }else{
        width = width/2
    }
	

    GL11.glBlendFunc(770, 771);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glLineWidth(2);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GlStateManager.func_179094_E();

	
	Tessellator.begin(3).colorize(colorR, colorG, colorB);
		
	Tessellator.pos(x+width,y+height,z+width).tex(0, 0);
	Tessellator.pos(x+width,y+height,z-width).tex(0, 0);
	Tessellator.pos(x-width,y+height,z-width).tex(0, 0);
	Tessellator.pos(x-width,y+height,z+width).tex(0, 0);
	Tessellator.pos(x+width,y+height,z+width).tex(0, 0);
	Tessellator.pos(x+width,y,z+width).tex(0, 0);
	Tessellator.pos(x+width,y,z-width).tex(0, 0);
	Tessellator.pos(x-width,y,z-width).tex(0, 0);
	Tessellator.pos(x-width,y,z+width).tex(0, 0);
	Tessellator.pos(x-width,y,z-width).tex(0, 0);
	Tessellator.pos(x-width,y+height,z-width).tex(0, 0);
	Tessellator.pos(x-width,y,z-width).tex(0, 0);
	Tessellator.pos(x+width,y,z-width).tex(0, 0);
	Tessellator.pos(x+width,y+height,z-width).tex(0, 0);
	Tessellator.pos(x+width,y,z-width).tex(0, 0);
	Tessellator.pos(x+width,y,z+width).tex(0, 0);
	Tessellator.pos(x-width,y,z+width).tex(0, 0);
	Tessellator.pos(x-width,y+height,z+width).tex(0, 0);
	Tessellator.pos(x+width,y+height,z+width).tex(0, 0);

	Tessellator.draw();

	GlStateManager.func_179121_F();
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_BLEND);
}



//Explosive shot timer
let lastExplosiveShotTime = -1

let explosiveShotLength = 0
let playerDungeonLevels = {}
let lastMageCooldown = undefined

register("chat",()=>{
	lastExplosiveShotTime = new Date().getTime()

	explosiveShotLength = 50000-(Math.floor((playerDungeonLevels?.archer || 0)/5)*2000)
}).setChatCriteria("&r&aUsed &r&6Explosive Shot&r&a!&r")
register("chat",()=>{
	lastExplosiveShotTime = new Date().getTime()

	explosiveShotLength = 30000*(lastMageCooldown || 1-((Math.floor((playerDungeonLevels?.mage + 50 || 50)/2))/100))
}).setChatCriteria("&r&aUsed &r&6Guided Sheep&r&a!&r")
register("chat",(cd)=>{
	lastMageCooldown = 1-(parseInt(cd)/100)

	explosiveShotLength = 30000*(lastMageCooldown || 1-((Math.floor((playerDungeonLevels?.mage + 50 || 50)/2))/100))
}).setChatCriteria("&r&a[Mage] &r&fCooldown Reduction &r&c${*}%&r&f -> &r&a${cd}%&r")


//riddle solver

//&r&a&lPUZZLE SOLVED! &r&6Soopyboo32 &r&ewasn't fooled by &r&cLino&r&e! &r&4G&r&co&r&6o&r&ed&r&a &r&2j&r&bo&r&3b&r&5!&r


register("chat",()=>{
	threemanLoc = undefined
}).setChatCriteria("&r&a&lPUZZLE SOLVED! &r&6Soopyboo32 &r&ewasn't fooled by &r${*}&r&e! &r${*}&r")

let answers = ["&e[NPC] &c${name}&f: &rMy chest doesn't have the reward. We are all telling the truth${*}", "&e[NPC] &c${name}&f: &rThe reward isn't in any of our chests${*}", "&e[NPC] &c${name}&f: &rThe reward is not in my chest!&r", "&e[NPC] &c${name}&f: &rAt least one of them is lying, and the reward is not in ${target}'s &rchest${*}", "&e[NPC] &c${name}&f: &rBoth of them are telling the truth. Also,${target}has the reward in their chest${*}", "&e[NPC] &c${name}&f: &rMy chest has the reward and I'm telling the truth${*}"]
answers.forEach((answer)=>{
	register("chat",(name)=>{
		ChatLib.chat("&c " + name + " has the blessing!")
		World.getAllEntities().forEach((e)=>{
			if(ChatLib.removeFormatting(e.getName()) === name){
				if(World.getBlockAt(e.getX()-1,e.getY(),e.getZ()).getRegistryName() === "minecraft:chest"){
					threemanLoc = [e.getX()-1,e.getY(),e.getZ()]
				}
				if(World.getBlockAt(e.getX()+1,e.getY(),e.getZ()).getRegistryName() === "minecraft:chest"){
					threemanLoc = [e.getX()+1,e.getY(),e.getZ()]
				}
				if(World.getBlockAt(e.getX(),e.getY(),e.getZ()+1).getRegistryName() === "minecraft:chest"){
					threemanLoc = [e.getX(),e.getY(),e.getZ()+1]
				}
				if(World.getBlockAt(e.getX(),e.getY(),e.getZ()-1).getRegistryName() === "minecraft:chest"){
					threemanLoc = [e.getX(),e.getY(),e.getZ()-1]
				}
				
				threemanLoc = threemanLoc.map((a)=>{return Math.floor(a)})
			}
		})

	}).setChatCriteria(answer)
})
//&e[NPC] &cLino&f: &rThe reward isn't in any of our chests.&r
//Performance




let soopyaddonDownloads = 0;

function updateSoopyAddonsDownloads() {
	new Thread(() => {
		let resp = JSON.parse(FileLib.getUrlContent("https://www.chattriggers.com/api/modules/Soopyaddons"))
		soopyaddonDownloads = resp.downloads

		return;
	}).start()
}
updateSoopyAddonsDownloads()

function showPlayerStats(player) {
	ChatLib.chat("&cLoading...")
	try {
		let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + player.replace("_", "^")))
		let playerUUID = ""

		if (!playerData.success) {
			ChatLib.chat("&cError fetching data: " + playerData.reason)
			return;
		}
		if (!playerData.data.success) {
			ChatLib.chat("&cError fetching data")
			return;
		}

		if (playerData.data.player == null) {
			ChatLib.chat("&cError fetching data &7(Invalid player?)")
			return;
		}

		playerUUID = playerData.data.player.uuid

		try {
			let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerUUID))

			if (!skyblockData.success) {
				ChatLib.chat("&cError fetching data: " + skyblockData.reason)
				return;
			}
			if (!skyblockData.data.success) {
				ChatLib.chat("&cError fetching data")
				return;
			}
			if (skyblockData.data.profiles == null) {
				ChatLib.chat("&cPlayer has no skyblock profiles")
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
			let petText = "&cNONE";
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

					playerSkillExp += playerProf["experience_skill_" + skill];
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
				"LEGENDARY": "&6",
				"MYTHIC": "&d"
			}
			let rarityNumber = {
				"COMMON": 1,
				"UNCOMMON": 2,
				"RARE": 3,
				"EPIC": 4,
				"LEGENDARY": 5,
				"MYTHIC": 5
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
						petText = "&7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
					}

					petHover += "&7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + "\n"
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

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor(playerData.data.player.displayname + "&7's skyblock stats"))
					.setHover("show_text", ChatLib.addColor("&aPlayer skill: " + playerSkillHover))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))


			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Purse Coins: &7" + addNotation("oneLetters", playerProf.coin_purse)))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Bank Coins: &7" + (bankApiOff ? "API OFF" : addNotation("oneLetters", playerBankCoins))))
					.setHover("show_text", ChatLib.addColor(bankHover))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Skill Avg: &7" + (skillApiOff ? "API OFF" : playerSkillAvg)))
					.setHover("show_text", ChatLib.addColor(skillHover))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Total Slayer: &7" + (slayerApiOff ? "API OFF" : addNotation("oneLetters", playerTotalSlayer))))
					.setHover("show_text", ChatLib.addColor(slayerHover))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Fairy souls: &7" + numberWithCommas(fairySouls)))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.addTextComponent(
				new TextComponent(ChatLib.addColor("&3Pet: &7" + petText))
					.setHover("show_text", ChatLib.addColor(petHover))
			)
			pagemsg.addTextComponent(new TextComponent(ChatLib.addColor("\n&r")))

			pagemsg.chat()
			//book.addPage(pagemsg)

			//book.display()
		} catch (err) { ChatLib.chat(err) }
	} catch (err) { ChatLib.chat(err) }
}

let lastPersonApi = "";
let lastPersonApiMode = 0;
let lastPersonApiTime = 0;

let soopyCommand = register("command", (...args) => {
	new Thread(() => {
		if (args === undefined) {
			args = []
		}
		switch (args[0]) {

			case "player":
				if (args[1] === undefined) { ChatLib.chat("&cUsage: /soopy player [ign]"); return; }

				if (lastPersonApi === args[1] &&
					lastPersonApiMode === 0 &&
					lastPersonApiTime - 10000 > new Date().getTime()) {
					ChatLib.chat("&cCalm down there!");
					return;
				}

				lastPersonApi = args[1];
				lastPersonApiMode = 0;
				lastPersonApiTime = new Date().getTime();

				showPlayerStats(args[1])
				break;
			case "guild":
				if (args[1] === undefined) {
					ChatLib.chat("&cUsage: /soopy guild [guildName]");
					return;
				}

				let gName = [...args];
				gName.shift()
				gName = gName.join(" ")

				guildLbGuiManager.open(gName)

				break;
			case "downloads":
				ChatLib.chat("Soopyaddons curranately has " + soopyaddonDownloads + " downloads (According to chattriggers api)")
				break;
			
			case "setkey":
				let data
				try{
					data = JSON.parse(FileLib.getUrlContent("https://api.hypixel.net/key?key=" + args[1]))
				}catch(e){
					ChatLib.chat("&cInvalid api key!")
					return;
				}
				if(!data.success) {
					ChatLib.chat("&cInvalid api key!")
					return;
				}
				ChatLib.chat("&cSuccess!")
				soopySettings.setSetting("hidden", "api-key", args[1])
				soopySettings.saveSettings()
				break;

			case "clearkey":
				ChatLib.chat("&cSuccess!")
				soopySettings.setSetting("hidden", "api-key", "undefined")
				soopySettings.saveSettings()
				break;
		
			case "getkey":
				ChatLib.chat("&cYour set api key is " + soopySettings.getSetting("hidden", "api-key"))
				break;

			case "performanceanalize":
				
				ChatLib.chat("&cStarting performance analize! This will take 5 seconds to complete!")
				analisingPerformance = true
				functionPerformanceData = {}
				new Thread(()=>{
					Thread.sleep(5000)

					analisingPerformance = false
					let totalMs = 0

					ChatLib.chat("&cPerformance data:")
					Object.keys(functionPerformanceData).sort((a,b)=>{
						return functionPerformanceData[b].totalTime - functionPerformanceData[a].totalTime;
					}).forEach((key)=>{
						totalMs += functionPerformanceData[key].totalTime
						ChatLib.chat(" &7 - " + key + " took " + Math.floor(functionPerformanceData[key].totalTime) + "ms (" + functionPerformanceData[key].calls + " calls)")
					})
					ChatLib.chat("&cThis shows soopyaddons should have a " + Math.round((totalMs/5000)*1000)/10 + "% performance impact.")
					ChatLib.chat("&cSo without soopyaddons your fps should go from " + Client.getFPS() + " to " + Math.round(Client.getFPS()*(1+(totalMs/5000))))
					ChatLib.chat("&c")
				}).start()
				break;

			default:
				if (isSoopy) {
					soopySettings.open()
				} else {
					ChatLib.chat("&7Did you want to open the setting?")
					ChatLib.chat("&7If so use the command /soopyaddons")
					ChatLib.chat("&7You can also use /soopy player [ign] to check their stats")
					ChatLib.chat("&7Or /soopy guild [guildName] to check the leaderboard")
					ChatLib.chat("&7Or /soopy setkey [key] if u want to set ur api key")
				}
				break;
		}

		return;
	}).start()
}).setName("soopy");

addCustomCompletion(soopyCommand, (args) => {
	if (args.length == 0) {
		return ["player", "guild","getkey","clearkey","setkey","performanceanalize"]
	}
	if (args.length == 1) {
		return ["player", "guild","getkey","clearkey","setkey","performanceanalize"].filter((n) =>
			n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
		)
	}
	if (args.length == 2) {
		switch (args[0]) {
			case "player":
				return World.getAllPlayers()
					.filter((n) =>
						n.getPing() !== -1
					)
					.map((p) => p.getName())
					.filter((n) =>
						n.toLowerCase().startsWith(args.length ? args[1].toLowerCase() : "")
					)
					.sort();
				break;
			case "guild":
				return []
				break;
			default:
				return []
				break;
		}
	}
});

let joindungeonCommand = register("command", (...args, e) => {
	ChatLib.say("/joindungeon " + args.join(" "))
}).setName("joindungeon") 

addCustomCompletion(joindungeonCommand, (args) => {
	if (args.length == 0) {
		return ["catacombs"]
	}
	if (args.length == 1) {
		return ["catacombs"].filter((n) =>
			n.toLowerCase().startsWith(args.length ? args[0].toLowerCase() : "")
		)
	}
});


TriggerRegister.registerChat((name, playerClass, level) => { playerJoinDungeonParty(name, playerClass, level) }).setChatCriteria("&dDungeon Finder &r&f> &r${name} &r&ejoined the dungeon group! (&r${playerClass} Level ${level}&r&e)&r")

function playerJoinDungeonParty(player, playerClass, level) {

	playerClass = playerClass.toLowerCase()

	let levelNum = parseInt(level)

	if (isNaN(levelNum)) {
		ChatLib.chat("&cAn Error Occured")
		return;
	}

	if (player.slice(0, 1) === "&") {
		player = player.slice(2)
	}

	new Thread(() => {
		let playerData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=player?name=" + player))
		let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getHypixelApi.json?key=lkRFxoMYwrkgovPRn2zt&dataWanted=skyblock_profiles?uuid=" + playerData.data.player.uuid))

		let canJoin = {
			5: false,
			6: false
		}
		skyblockData.data.profiles.forEach((profile) => {
			try {
				if (profile.members[playerData.data.player.uuid].dungeons.dungeon_types.catacombs.tier_completions[4] > 0) {
					canJoin[5] = true
				}
				if (profile.members[playerData.data.player.uuid].dungeons.dungeon_types.catacombs.tier_completions[5] > 0) {
					canJoin[6] = true
				}
			} catch (e) {

			}
		})

		if (settings.getSetting("Dungeons", "Auto-kick players that are able to join a f5 dungeon")) {
			if (canJoin[5]) {
				commandsQueue.push("/p kick " + player)
				return;
			}
		}
		if (settings.getSetting("Dungeons", "Auto-kick players that are able to join a f6 dungeon")) {
			if (canJoin[6]) {
				commandsQueue.push("-/p kick " + player)
				return;
			}
		}
	}).start()

}

let fletcherMessages = {
	"yellow and see through":"20 yellow stained glass.",
	"circlular and sometimes moves":"1 compass.",
	"expensive minerals":"20 mythril.",
	"useful during celebrations":"1 firework rocket.",
	"hot and gives energy":"1 cheap coffee or decent coffee.",
	"tall and can be opened":"1 wooden door.",
	"explosive and more than usual":"1 superboom tnt.",
	"wearable and grows":"1 pumpkin.",
	"shiny and makes sparks":"1 flint and steel.",
	"red and white and you can mine it":"50 nether quartz ore.",
	"round and green, or purple":"16 ender pearl.",
	"red and soft":"50 red wool."
}

Object.keys(fletcherMessages).forEach((mess1)=>{
	[mess1,mess1.replace("and","but"),mess1.replace(" and",",")].forEach((mess)=>{
		register("chat",()=>{
			ChatLib.chat("&cFetchur wants: " + fletcherMessages[mess1])
			new Thread(()=>{
				FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/setFetchur.json?key=lkRFxoMYwrkgovPRn2zt&fetchur=" + mess1.replace(/ /g,"_"))
			}).start()
		}).setChatCriteria("&e[NPC] Fetchur&f: &rtheyre " + mess + "&r")
		register("chat",()=>{
			ChatLib.chat("&cFetchur wants: " + fletcherMessages[mess1])
			new Thread(()=>{
				FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/setFetchur.json?key=lkRFxoMYwrkgovPRn2zt&fetchur=" + mess1.replace(/ /g,"_"))
			}).start()
		}).setChatCriteria("&e[NPC] Fetchur&f: &rits " + mess + "&r")
	})
})



//Helper functions
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

var timeSince = function (date) {
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

function firstLetterCapital(string) {
	return string.substr(0, 1).toUpperCase() + string.substr(1)
}

function firstLetterWordCapital(string) {
	let retString = ""
	string.split(" ").forEach((str) => { retString += " " + firstLetterCapital(str) })
	return retString.substr(1);
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
	}
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
  };
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

function toSkillLevel(d) {
	let a = getLevelByXp(d, 0);

	return a.level + a.progress;
}

function getSlayerLevel(slayer) {
	let { claimed_levels } = slayer;

	let level = 0;

	for (let level_name in claimed_levels) {
		let _level = parseInt(level_name.split("_").pop());

		if (_level > level) level = _level;
	}

	return level;
}

let petData = []
currPet = "&7Pet: &7Loading..."
let updatingPets = false;
let lastPetUpdate = 0;
let playerTamingLevel = 0;

let playerSkillExp = {
	"combat": -1,
	"mining": -1,
	"alchemy": -1,
	"farming": -1,
	"taming": -1,
	"enchanting": -1,
	"fishing": -1,
	"foraging": -1,
	"runecrafting": -1,
	"carpentry": -1
}
let playerSkillExpNextLevel = {
	"combat": -1,
	"mining": -1,
	"alchemy": -1,
	"farming": -1,
	"taming": -1,
	"enchanting": -1,
	"fishing": -1,
	"foraging": -1,
	"runecrafting": -1,
	"carpentry": -1
}
let tierBoostChange = {
	"COMMON": "UNCOMMON",
	"UNCOMMON": "RARE",
	"RARE": "EPIC",
	"EPIC": "LEGENDARY",
	"LEGENDARY": "LEGENDARY"
}

function updatePets() {
	new Thread(() => {
		if (updatingPets) {
			return;
		}
		if (new Date().getTime() - lastPetUpdate < 60000) {
			return;
		}
		updatingPets = true
		lastPetUpdate = new Date().getTime()
		let skyblockData = JSON.parse(FileLib.getUrlContent("http://soopymc.my.to/api/soopyAddons/getPets.json?key=lkRFxoMYwrkgovPRn2zt&username=" + Player.getName() + "&uuid=" + Player.getUUID()))
		if (!skyblockData.success) {
			Thread.sleep(60000)
			updatingPets = false
			lastPetUpdate = 0
			updatePets()
			return;
		}

		let petTierColor = {
			"COMMON": "&f",
			"UNCOMMON": "&a",
			"RARE": "&9",
			"EPIC": "&5",
			"LEGENDARY": "&6",
			"MYTHIC": "&d"
		}

		petData = skyblockData.pets
		playerTamingLevel = skyblockData.taming
		playerDungeonLevels = skyblockData.dungeonLevels

		//Calculate starting exp thing
		Object.keys(skyblockData.skills).forEach((skill) => {
			skill = skill.replace("experience_skill_", "")
			let skillType = 0;
			if (skill == "runecrafting") { skillType = 1 }
			
			let levelData = getLevelByXp(skyblockData.skills["experience_skill_" + skill], skillType,50)

			playerSkillExpNextLevel[skill] = levelData.xpForNext
			playerSkillExp[skill] = levelData.xpCurrent
		})

		currPet = "&7Pet: &cNone"

		for (let i = 0; i < petData.length; i++) {
			if (petData[i].heldItem == "PET_ITEM_TIER_BOOST") {
				petData[i].tier = tierBoostChange[petData[i].tier]
			}
		}

		petData.forEach((pet) => {
			if (pet.active) {
				
				if (settings.getSetting("HUD", "Current pet more info")) {
					currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + " &r(&e" + numberWithCommas(getPetLevel(pet).xpCurrent) + "/" + numberWithCommas(getPetLevel(pet).xpForNext) + "&r)&e " + (Math.floor(getPetLevel(pet).progress * 10000) / 100) + "%"
				} else {
					currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
				}
			}
		})
		updatingPets = false;

		return;
	}).start()
}

updatePets()

register("chat", () => {
	currPet = "&7Pet: &cNone"

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {

			petData[id].active = false
		}
		id++
	})
	
}).setChatCriteria("&r&aYou despawned your &r${*}&r&a!&r")
register("worldLoad", () => {
	updatePets()
})

register("chat", (name) => {

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {

			petData[id].active = false
		}
		let petTierColor = {
			"COMMON": "&f",
			"UNCOMMON": "&a",
			"RARE": "&9",
			"EPIC": "&5",
			"LEGENDARY": "&6",
			"MYTHIC": "&d"
		}

		let simPetName = petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))

		if (name === simPetName) {
			
			petData[id].active = true
			if (settings.getSetting("HUD", "Current pet more info")) {
				currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + " &r(&e" + numberWithCommas(getPetLevel(pet).xpCurrent) + "/" + numberWithCommas(getPetLevel(pet).xpForNext) + "&r)&e " + (Math.floor(getPetLevel(pet).progress * 10000) / 100) + "%"
			} else {
				currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
			}
		}
		id++
	})
}).setChatCriteria("&r&aYou summoned your &r${name}&r&a!&r")

register("chat", () => { }).setChatCriteria("&r&aSuccessfully added &r${*} &r&ato your pet menu!&r")


register("chat", () => {
	currPet = "&7Pet: &cNone"

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {

			petData[id].active = false
		}
		id++
	})
	
}).setChatCriteria("&r&aYou despawned your &r${*} ${*}&r&a!&r")

register("chat", (name1, name2) => {
	let name = name1 + " " + name2

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {

			petData[id].active = false
		}

		let petTierColor = {
			"COMMON": "&f",
			"UNCOMMON": "&a",
			"RARE": "&9",
			"EPIC": "&5",
			"LEGENDARY": "&6",
			"MYTHIC": "&d"
		}

		let simPetName = petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))

		if (name === simPetName) {
			petData[id].active = true
			

			if (settings.getSetting("HUD", "Current pet more info")) {
				currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + " &r(&e" + numberWithCommas(getPetLevel(pet).xpCurrent) + "/" + numberWithCommas(getPetLevel(pet).xpForNext) + "&r)&e " + (Math.floor(getPetLevel(pet).progress * 10000) / 100) + "%"
			} else {
				currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
			}
		}
		id++
	})
}).setChatCriteria("&r&aYou summoned your &r${name1} ${name2}&r&a!&r")

register("chat",(pet, e)=>{
	//pet is like: &7[Lvl 47] &6Mithril Golem
	currPet = "&7Pet: " + pet

	let petName = pet.split(" ")
	petName.shift()
	petName.shift()
	petName = petName.join(" ")

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {

			petData[id].active = false
		}

		let petTierColor = {
			"COMMON": "&f",
			"UNCOMMON": "&a",
			"RARE": "&9",
			"EPIC": "&5",
			"LEGENDARY": "&6",
			"MYTHIC": "&d"
		}

		let simPetName = petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))

		if (petName === simPetName) {
			petData[id].active = true
			

			if (settings.getSetting("HUD", "Current pet more info")) {
				currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + " &r(&e" + numberWithCommas(getPetLevel(pet).xpCurrent) + "/" + numberWithCommas(getPetLevel(pet).xpForNext) + "&r)&e " + (Math.floor(getPetLevel(pet).progress * 10000) / 100) + "%"
			}
		}
		id++
	})

}).setChatCriteria("&cAutopet &eequipped your ${pet}&e! &a&lVIEW RULE&r")

register("step", () => {
	updatePets()
}).setDelay(600)



TriggerRegister.registerActionBar((type, exp, totalexp) => {

	let expGain = parseFloat(exp.replace(/,/g, "")) - playerSkillExp[type.toLowerCase()]
	if (playerSkillExp[type.toLowerCase()] === -1) { expGain = 0 }
	if (expGain < 0) {
		expGain = playerSkillExp[type.toLowerCase()] - playerSkillExpNextLevel[type.toLowerCase()]
	}
	playerSkillExp[type.toLowerCase()] = parseFloat(exp.replace(/,/g, ""))
	playerSkillExpNextLevel[type.toLowerCase()] = parseFloat(totalexp.replace(/,/g, ""))
	currPet = "&7Pet: &cNone"

	let id = 0
	petData.forEach((pet) => {
		if (pet.active) {
			try {
				let petExpGain

				let isFishOrMine = type === "Fishing" || type === "Mining"

				let expGainBuff = 1
				if (isFishOrMine) {
					expGainBuff += 0.5
				}

				expGainBuff += playerTamingLevel / 100

				if (pet.heldItem !== undefined && pet.heldItem !== null) {
					if (constants.pet_items[pet.heldItem] !== undefined) {
						if (constants.pet_items[pet.heldItem].xpBoostType === type.toLowerCase() || constants.pet_items[pet.heldItem].xpBoostType === "all") {
							expGainBuff += constants.pet_items[pet.heldItem].xpBoost
						}
					}
				}

				if (constants.pet_data[pet.type].type.toLowerCase() !== type.toLowerCase()) {
					petExpGain = (expGain / 4) * expGainBuff
				} else {
					petExpGain = expGain * expGainBuff
				}
				petData[id].exp += petExpGain
				pet.exp += petExpGain


				let petTierColor = {
					"COMMON": "&f",
					"UNCOMMON": "&a",
					"RARE": "&9",
					"EPIC": "&5",
					"LEGENDARY": "&6",
					"MYTHIC": "&d"
				}
				if (settings.getSetting("HUD", "Current pet more info")) {
					currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " ")) + " &r(&e" + numberWithCommas(getPetLevel(pet).xpCurrent) + "/" + numberWithCommas(getPetLevel(pet).xpForNext) + "&r)&e " + (Math.floor(getPetLevel(pet).progress * 10000) / 100) + "%"
				} else {
					currPet = "&7Pet: &7[Lvl" + getPetLevel(pet).level + "] " + petTierColor[pet.tier] + firstLetterWordCapital(pet.type.toLowerCase().replace("_", " "))
				}
			} catch (err) { console.log(err.message); console.log(err.stack) }
		}
		id++
	})

}).setChatCriteria("&3+${*} ${type} (${exp}/${totalexp})${*}")


//Code from dungeon addons
//I dont really understand much about it lol
const drawBox = (entity, red, green, blue, lineWidth, width, height, partialTicks) => {
	if (width === null) {
		width = entity.getWidth()
	}
	if (height === null) {
		height = entity.getHeight()
	}

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(lineWidth);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	//GL11.glDisable(GL11.GL_DEPTH_TEST);
	//GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	let positions = [
		[0.5, 0.0, 0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 0.0, -0.5],
		[-0.5, 1.0, -0.5],
		[0.5, 0.0, -0.5],
		[0.5, 1.0, -0.5],
		[-0.5, 0.0, 0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 1.0, -0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 1.0, -0.5],
		[0.5, 1.0, -0.5],
		[-0.5, 1.0, -0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 0.0, -0.5],
		[0.5, 0.0, 0.5],
		[-0.5, 0.0, 0.5],
		[0.5, 0.0, 0.5],
		[-0.5, 0.0, -0.5],
		[0.5, 0.0, -0.5],
		[-0.5, 0.0, -0.5],
		[-0.5, 0.0, 0.5]
	]

	let counter = 0;

	Tessellator.begin(3).colorize(red, green, blue);
	positions.forEach(pos => {
		Tessellator.pos(
			entity.getX() + (entity.getX() - entity.getLastX()) * partialTicks + pos[0] * width,
			entity.getY() + (entity.getY() - entity.getLastY()) * partialTicks + pos[1] * height,
			entity.getZ() + (entity.getZ() - entity.getLastZ()) * partialTicks + pos[2] * width
		).tex(0, 0);

		counter++;
		if (counter % 2 === 0) {
			Tessellator.draw();
			if (counter !== 24) {
				Tessellator.begin(3).colorize(red, green, blue);
			}
		}
	});

	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	//GL11.glEnable(GL11.GL_DEPTH_TEST);
	//GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
};

const drawBoxThroughWalls = (entity, red, green, blue, lineWidth, width, height, partialTicks) => {
	if (width === null) {
		width = entity.getWidth()
	}
	if (height === null) {
		height = entity.getHeight()
	}

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(lineWidth);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	let positions = [
		[0.5, 0.0, 0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 0.0, -0.5],
		[-0.5, 1.0, -0.5],
		[0.5, 0.0, -0.5],
		[0.5, 1.0, -0.5],
		[-0.5, 0.0, 0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 1.0, -0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 1.0, 0.5],
		[-0.5, 1.0, -0.5],
		[0.5, 1.0, -0.5],
		[-0.5, 1.0, -0.5],
		[-0.5, 1.0, 0.5],
		[0.5, 0.0, -0.5],
		[0.5, 0.0, 0.5],
		[-0.5, 0.0, 0.5],
		[0.5, 0.0, 0.5],
		[-0.5, 0.0, -0.5],
		[0.5, 0.0, -0.5],
		[-0.5, 0.0, -0.5],
		[-0.5, 0.0, 0.5]
	]

	let counter = 0;

	Tessellator.begin(3).colorize(red, green, blue);
	positions.forEach(pos => {
		Tessellator.pos(
			entity.getX() + (entity.getX() - entity.getLastX()) * partialTicks + pos[0] * width,
			entity.getY() + (entity.getY() - entity.getLastY()) * partialTicks + pos[1] * height,
			entity.getZ() + (entity.getZ() - entity.getLastZ()) * partialTicks + pos[2] * width
		).tex(0, 0);

		counter++;
		if (counter % 2 === 0) {
			Tessellator.draw();
			if (counter !== 24) {
				Tessellator.begin(3).colorize(red, green, blue);
			}
		}
	});

	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
};


register("worldLoad",()=>{
	if(settings.getSetting("Events","Griffin burrow waypoints")){
		if(soopySettings.getSetting("hidden", "api-key") !== "undefined"){
			loadBurrialApi(true)
		}
	}
})
let burrialData = {
	points: [],
	locations: []
}
function loadBurrialApi(resetLocations){

    if(resetLocations){
        burrialData.points = []
        burrialData.locations = []
    }
	new Thread(()=>{
		let data = JSON.parse(FileLib.getUrlContent("https://api.hypixel.net/skyblock/profiles?key=" + soopySettings.getSetting("hidden", "api-key") + "&uuid=" + Player.getUUID().toString().replace(/-/g,"")))

		let newLocations = []
		if(data.success){
			profileData = data.profiles[0].members[Player.getUUID().toString().replace(/-/g,"")]

			data.profiles.forEach((prof)=>{
				if((prof.members[Player.getUUID().toString().replace(/-/g,"")].last_save || 0) > (profileData.last_save || 0)){
					profileData = prof.members[Player.getUUID().toString().replace(/-/g,"")]
				}
			})
			if(resetLocations){
				burrialData.locations = profileData.griffin.burrows
			}else{
				profileData.griffin.burrows.forEach((burrow)=>{
					let pushed = false
					burrialData.locations.forEach((loc)=>{
						if(loc.x + "," + loc.y + "," + loc.z === burrow.x + "," + burrow.y + "," + burrow.z){
							newLocations.push(loc)
							pushed = true
						}
					})
					if(!pushed){
						burrow.clicked = false
						newLocations.push(burrow)
					}
				})

				burrialData.locations = newLocations
			}
		}
	}).start()
}
register("chat",()=>{
    burrialClicked()
}).setChatCriteria("&r&eYou dug out a Griffin Burrow! &r&7(${*}/4)&r")
register("chat",()=>{
}).setChatCriteria("&r&cYou died!&r")
register("chat",()=>{
    burrialClicked()
}).setChatCriteria("&r&eYou finished the Griffin burrow chain! &r&7(4/4)&r")

function burrialClicked(){
    burrialData.locations = burrialData.locations.sort((a,b)=>{return (calculateDistance([a.x,a.y,a.z],[Player.getX(),Player.getY(),Player.getZ()]) - calculateDistance([b.x,b.y,b.z],[Player.getX(),Player.getY(),Player.getZ()]))})
	if(burrialData.locations[0] === undefined) return;
	if(calculateDistance([burrialData.locations[0].x,burrialData.locations[0].y,burrialData.locations[0].z],[Player.getX(),Player.getY(),Player.getZ()]) < 10){
        burrialData.locations[0].clicked = true
    }
}

function calculateDistance(p1, p2) {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let ret = Math.sqrt(a * a + b * b + c * c)

    if(ret<0){
        ret *= -1
    }
    return ret;
}function calculateDistanceQuick(p1, p2) {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let ret = a * a + b * b + c * c

    if(ret<0){
        ret *= -1
    }
    return ret;
}


function fastestPathThrough(startPoint, points){
    let ret = []
    while(ret.length<points.length){
        ret.push(ret.length)
    }

    let retSorted = []
    let lastPos = startPoint
    let lastShortest = 0;
    let lastShortestVal = Infinity

    while(retSorted.length<points.length){
        ret.forEach((pos)=>{
            if(retSorted.includes(pos)) return;
            let val = calculateDistanceQuick(lastPos,points[pos])
            if(val < lastShortestVal){
                lastShortestVal = val
                lastShortest = pos
            }
        })
        retSorted.push(lastShortest)
        lastPos = points[lastShortest]
        
        lastShortest = 0;
        lastShortestVal = Infinity

    }

    
    return retSorted;
}

let lastPath = undefined

function drawLine(x, y, z, x2, y2, z2, r, g, b) {

	GL11.glBlendFunc(770, 771);
	GL11.glEnable(GL11.GL_BLEND);
	GL11.glLineWidth(1);
	GL11.glDisable(GL11.GL_TEXTURE_2D);
	GL11.glDisable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(false);
	GlStateManager.func_179094_E();

	Tessellator.begin(3).colorize(r, g, b);

	Tessellator.pos(x, y, z).tex(0, 0);
	Tessellator.pos(x2, y2, z2).tex(0, 0);

	Tessellator.draw();


	GlStateManager.func_179121_F();
	GL11.glEnable(GL11.GL_TEXTURE_2D);
	GL11.glEnable(GL11.GL_DEPTH_TEST);
	GL11.glDepthMask(true);
	GL11.glDisable(GL11.GL_BLEND);
}

register("chat",(key)=>{
	ChatLib.chat("&c[SOOPYADDONS] Copied api key!")
	
	soopySettings.setSetting("hidden", "api-key", key)
	soopySettings.saveSettings()
}).setChatCriteria("&aYour new API key is &r&b${key}&r")

let analisingPerformance = false
let functionPerformanceData = {}

function startFunctionPerformanceAnalize(id){
	if(!analisingPerformance) return;

	if(functionPerformanceData[id] === undefined){
		functionPerformanceData[id] = {
			calls: 0,
			totalTime: 0,
			lastPerformanceStartTimer: 0
		}
	}

	functionPerformanceData[id].lastPerformanceStartTimer = new Date().getTime() + (Instant.now().getNano() / 1000000000);
	functionPerformanceData[id].calls ++
}

function endFunctionPerformanceAnalize(id){
	if(!analisingPerformance) return;

	let currTime = new Date().getTime() + (Instant.now().getNano() / 1000000000);

	functionPerformanceData[id].totalTime += currTime-functionPerformanceData[id].lastPerformanceStartTimer
	functionPerformanceData[id].lastPerformanceStartTimer = 0;
}


class SoopyApi{
	constructor(){

	}

	getAlonNameHelp = function(player){
		let replaceThing = {
			"Skill Average": "skill-avg",
			"Catacombs": "dungeon",
			"Total Slayer": "slayer-total",
			"Soopy Skill": "skill"
		}
		let thing = replaceThing[settings.getSetting("Other", "What stat to use as 'skill'")]
		let key = player.getUUID().toString().replace(/-/g,"")
		if(playerSkills[key] === undefined){
			return ""

		}
		if (playerSkills[key].error) {
			if (playerSkills[key].nick) {
				return " &c[Nick]"
			} else {
				return " &c[Error]"
			}
		} else {
			if (playerSkills[key].approx) {

				return " &c[" + (playerSkills[key]["usesSoopyaddons"] === true ? "&d⚝&c" : "") + playerSkills[key][thing] + "]"
			} else {
				return " &2[" + (playerSkills[key]["usesSoopyaddons"] === true ? "&d⚝&2" : "") + playerSkills[key][thing] + "]"
			}
		}
	}
}

let soopyApi = new SoopyApi()

export default soopyApi