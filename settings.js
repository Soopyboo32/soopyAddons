

let gui = new Gui();
gui.registerClicked(guiClickedFunction);
gui.registerScrolled(guiScrolledFunction);
gui.registerDraw(guiRenderFunction);
const GL11 = Java.type("org.lwjgl.opengl.GL11");

let renderSquareX = 0;
let renderSquareY = 0;
let selectedModule = null;
let scrollPrev = 0;
let scrollCurrent = 0;
let scrollTarget = 0;
let hoveringBackButton = false;
let animOffBackwards = false

let ticksSinceOpen = 0
let select
let startHoverTime = 0;

let currModuleHovered;
let animOffTime = 0;

let items = {}



function guiRenderFunction(mouseX, mouseY, partialTicks) {
    let screenWidth = Renderer.screen.getWidth()
    let screenHeight = Renderer.screen.getHeight()
    let guiScale = Renderer.screen.getScale()

    scrollView = scrollPrev + ((scrollCurrent - scrollPrev) * partialTicks)

    let animOffProg = animOffTime == 0 ? 0 : Math.min(((ticksSinceOpen + partialTicks) - animOffTime) / 20, 1)//0-1
    if (animOffBackwards) {
        animOffProg = 0 - animOffProg + 1
    }
    animOffProg = Math.sin((animOffProg * 90) * Math.PI / 180)

    //Background rendering
    let renderInTime = (ticksSinceOpen + partialTicks) * 2.5 - 15
    renderInTime = Math.min(renderInTime, 100)
    let bgOcapacity = 0;
    bgOcapacity = renderInTime * 2
    bgOcapacity = Math.min(bgOcapacity, 100)
    Renderer.drawRect(Renderer.color(0, 0, 0, bgOcapacity), 0, 0, screenWidth, screenHeight);

    //Render menu
    let menuWidth = screenWidth / 1.5
    let menuHeight = screenHeight / 1.5
    let menuX = (screenWidth - menuWidth) / 2
    let menuY = (screenHeight - menuHeight) / 2

    let menuOff = renderInTime / 50 //between 0 and 1
    menuOff = Math.min(Math.max(menuOff, 0), 1)
    menuOff = Math.sin((menuOff * 90) * Math.PI / 180)

    menuOcapacity = menuOff * 175
    menuY += (-menuOff + 1) * (screenHeight / 10)

    Renderer.drawRect(Renderer.color(0, 0, 0, menuOcapacity), menuX, menuY, menuWidth, menuHeight)
    Renderer.drawRect(Renderer.color(255, 255, 255, menuOff * 200), menuX, menuY + 25, menuWidth, 2)

    //actually add settings and stuff
    Renderer.scale(2, 2)
    new Text(
        "&6Soopy&7Addons", (menuX + menuWidth / 2 - Renderer.getStringWidth("SoopyAddons") / 1) / 2, (menuY + 5) / 2
    ).setColor(Renderer.color(255, 255, 255, menuOff * 255)).draw();
    Renderer.scale(1, 1)
    currModuleHoveredNew = undefined

    if (selectedModule == null) {

        let moduleWidth = 150;
        let moduleHeight = 100;
        let gapBetweenModules = 25;

        let modulesPerRow = Math.max(1, Math.floor((menuWidth) / (moduleWidth + gapBetweenModules)))

        let totalModules = Object.keys(settings.settingsData).length

        let totalRows = Math.ceil(totalModules / modulesPerRow)

        let moduleNum = 0;

        GL11.glEnable(GL11.GL_SCISSOR_TEST);
        GL11.glScissor(menuX * guiScale, (menuY - ((-menuOff + 1) * (screenHeight / 10)) * guiScale + ((1 - menuOff) * (menuHeight - 27))) * guiScale, menuWidth * guiScale, ((menuOff) * (menuHeight - 27)) * guiScale)
        Object.keys(settings.settingsData).forEach((settingModuleKey) => {
            let settingsModuleData = settings.settingsData[settingModuleKey]

            let rowId = (moduleNum - (moduleNum % modulesPerRow)) / modulesPerRow;
            let modulesInCurrentRow = rowId == totalRows ? (totalModules % modulesPerRow) : modulesPerRow;
            let moduleIdInRow = moduleNum - rowId * modulesPerRow;
            let currGapBetweenModules = (menuWidth - (moduleWidth * modulesInCurrentRow)) / (modulesInCurrentRow + 1)

            let moduleX = menuX + currGapBetweenModules + (moduleIdInRow * (moduleWidth + currGapBetweenModules));
            let moduleY = menuY + 25 + gapBetweenModules + ((gapBetweenModules + moduleHeight) * rowId);

            let renderHeight = Math.min(moduleHeight, menuHeight + menuY - (moduleY + scrollView))
            let renderYOff = Math.max(0, menuY - (moduleY + scrollView) + 27)
            renderHeight -= renderYOff
            renderHeight = Math.max(0, renderHeight)

            if (settingsModuleData.type == Type.Toggle) {
                if (settings.settings[settingModuleKey].this) {
                    Renderer.drawRect(Renderer.color(50, 255, 50, 100 * (1 - animOffProg)), moduleX, moduleY + renderYOff + scrollView, moduleWidth, renderHeight)
                } else {
                    Renderer.drawRect(Renderer.color(255, 50, 50, 100 * (1 - animOffProg)), moduleX, moduleY + renderYOff + scrollView, moduleWidth, renderHeight)
                }
            } else {
                Renderer.drawRect(Renderer.color(255, 255, 255, 100 * (1 - animOffProg)), moduleX, moduleY + renderYOff + scrollView, moduleWidth, renderHeight)
            }

            //if ((moduleY + scrollView + 10) < menuHeight + menuY - 10 && moduleY + scrollView > menuY + 27) {
            let nameScale = 1.5;
            if (currModuleHovered == settingModuleKey) {
                nameScale += Math.min(Math.pow(((ticksSinceOpen + partialTicks) - startHoverTime) / 40, 2), 0.5)
            }
            Renderer.scale(nameScale, nameScale)

            new Text(
                settingsModuleData.name,
                (moduleX + moduleWidth / 2 - (Renderer.getStringWidth(ChatLib.removeFormatting(settingsModuleData.name)) * nameScale) / 2) / nameScale, (moduleY + scrollView + 5) / nameScale
            ).setColor(Renderer.color(255, 255, 255, (menuOff * 255) * (1 - animOffProg))).draw();
            Renderer.scale(1, 1)
            //}

            if (animOffProg !== 0) {
                //animOffTime = ticksSinceOpen
                GL11.glScissor((moduleX + moduleWidth / 2 - 16) * guiScale, (screenHeight - (moduleY + scrollView + 32)) * guiScale - 64, 64, 64 * (1 - animOffProg))

            }
            //if (moduleY + scrollView + 20 < menuHeight + menuY - 32 && moduleY + scrollView + 20 > menuY + 27) {
            items[settingsModuleData.display].draw(moduleX + moduleWidth / 2 - 16, moduleY + scrollView + 32, 2)
            //}
            if (animOffProg !== 0) {
                GL11.glScissor(menuX * guiScale, (menuY + ((1 - menuOff) * (menuHeight - 27))) * guiScale, menuWidth * guiScale, (menuHeight - 27 - ((1 - menuOff) * (menuHeight - 27))) * guiScale)
            }


            if (mouseX > moduleX && mouseX < moduleX + moduleWidth &&
                mouseY > moduleY + renderYOff + scrollView && mouseY < renderHeight + moduleY + renderYOff + scrollView) {
                if (currModuleHovered != settingModuleKey) {
                    startHoverTime = ticksSinceOpen
                }
                currModuleHoveredNew = settingModuleKey
            }

            let lineId = 0;
            let totalLines = settingsModuleData.description.length
            settingsModuleData.description.forEach((line) => {

                //if ((moduleY + scrollView + moduleHeight - 10 - (totalLines * 7) + (lineId * 7)) < menuHeight + menuY - 5 && (moduleY + scrollView + moduleHeight - 10 - (totalLines * 7) + (lineId * 7)) > menuY + 27) {
                Renderer.scale(0.75, 0.75)
                new Text(
                    line, (moduleX + moduleWidth / 2 - ((Renderer.getStringWidth(ChatLib.removeFormatting(line)) / 2) * 0.75)) / 0.75, (moduleY + scrollView + moduleHeight - 10 - (totalLines * 7) + (lineId * 7)) / 0.75
                ).setColor(Renderer.color(255, 255, 255, (menuOff * 255) * (1 - animOffProg))).draw();
                Renderer.scale(1, 1)
                //}

                lineId++
            })
            moduleNum++
        })
        GL11.glScissor(0, 0, screenWidth, screenHeight)
        GL11.glDisable(GL11.GL_SCISSOR_TEST);
        currModuleHovered = currModuleHoveredNew
    } else {
        let selectedModuleData = settings.settingsData[selectedModule]

        Renderer.drawRect(Renderer.color(0, 0, 0, 50), menuX, menuY, 40, 25)
        Renderer.drawRect(Renderer.color(255, 255, 255, 255), menuX + 40, menuY, 1, 25)
        new Text(
            "&7Back", menuX + (40 / 2) - (Renderer.getStringWidth("Back") / 2), menuY + 7.5
        ).setColor(Renderer.color(255, 255, 255, menuOff * 255)).draw();

        if (mouseX > menuX && mouseX < menuX + 40 &&
            mouseY > menuY && mouseY < menuY + 25) {
            hoveringBackButton = true;
        } else {
            hoveringBackButton = false
        }

        Renderer.scale(1.75, 1.75)
        new Text(
            selectedModuleData.name, (menuX + menuWidth / 2 - Renderer.getStringWidth(selectedModuleData.name, true) / (2 / 1.75)) / 1.75, (menuY + 30) / 1.75
        ).setColor(Renderer.color(255, 255, 255, menuOff * 255)).draw();
        Renderer.scale(1, 1)


        let itemX = menuX
        let itemY = menuY + 30
        items[selectedModuleData.display].draw(itemX * guiScale / 2, itemY * guiScale / 2, 2)
    }
}

register("tick", () => {
    if (gui.isOpen()) {
        ticksSinceOpen++
        scrollPrev = scrollCurrent
        scrollCurrent += (scrollTarget - scrollCurrent) / 5
        scrollView = scrollCurrent
    }
})

function guiScrolledFunction(mouseX, mouseY, direction) {
    switch (direction) {
        case 1:
            animOffProg = animOffTime == 0 ? 0 : Math.min((((ticksSinceOpen) - animOffTime)) / 20, 1)
            if (animOffProg !== 0) { return }


            scrollTarget += 50
            scrollTarget = Math.min(scrollTarget, 0)
            break;

        case -1:
            animOffProg = animOffTime == 0 ? 0 : Math.min((((ticksSinceOpen) - animOffTime)) / 20, 1)
            if (animOffProg !== 0) { return }

            let screenHeight = Renderer.screen.getHeight()
            let screenWidth = Renderer.screen.getWidth()
            let menuWidth = screenWidth / 1.5
            let menuHeight = screenHeight / 1.5
            let moduleWidth = 150;
            let moduleHeight = 100;
            let gapBetweenModules = 25;

            let modulesPerRow = Math.max(1, Math.floor((menuWidth) / (moduleWidth + gapBetweenModules)))

            let totalModules = Object.keys(settings.settingsData).length

            let totalRows = Math.ceil(totalModules / modulesPerRow)


            scrollTarget -= 50
            scrollTarget = Math.max(scrollTarget, -Math.max(0, (totalRows * (gapBetweenModules + moduleHeight) - menuHeight + gapBetweenModules * 2)))
            break;
    }
}

function guiClickedFunction(mouseX, mouseY, button) {
    switch (button) {
        case 0:
            let animOffProg = animOffTime == 0 ? 0 : Math.min(((ticksSinceOpen + partialTicks) - animOffTime) / 20, 1)//0-1
            if (animOffBackwards) {
                animOffProg = 0 - animOffProg + 1
            }
            animOffProg = Math.sin((animOffProg * 90) * Math.PI / 180)
            if (animOffProg !== 0) { return }

            if (selectedModule == null) {
                if (currModuleHovered !== undefined) {

                    animOffTime = ticksSinceOpen
                    animOffBackwards = false

                    setTimeout(() => {
                        selectedModule = currModuleHovered
                        scrollPrev = 0;
                        scrollCurrent = 0;
                        animOffTime = 0
                    }, 1000)
                }
            } else {
                if (hoveringBackButton) {
                    selectedModule = null
                    scrollPrev = 0;
                    scrollCurrent = 0;
                    animOffTime = ticksSinceOpen
                    animOffBackwards = true
                    setTimeout(() => {
                        animOffBackwards = false
                    }, 1000)
                }
            }
            break;
    }
}

Type = {
    "Button": 0,
    "Toggle": 1,
    "Info": 2,
    "RingSelect": 3,
    "Slider": 4
}

class Settings {
    constructor() {
        this.settings = {
            improvements: {
                "this": true
            },
            spamHider: {
                "this": true
            },
            performance: {
                "this": true
            },
            dungeon: {
                "this": true
            },
            hud: {
                "this": true
            },
            sbg: {
                "this": true
            },
            guild: {
                "this": true
            },
            hidden: {
                version: "v" + JSON.parse(FileLib.read("soopyAddons", "metadata.json")).version,
                versionId: -1,
                "api-key": "undefined",
                cakeData: {}
            }
        }

        this.settingsData = {
            improvements: {
                name: "Improvements",
                description: [
                    "Just some random improvements"
                ],
                display: "map",
                type: Type.Toggle,
                settings: {
                    betterLineBreak: {
                        name: "Better line break",
                        type: Type.Toggle
                    }
                }
            },
            spamHider: {
                name: "Spam Hider",
                description: [
                    "Moves some un-needed spam",
                    "messages to a corner of the screen,",
                    "to stop chat from being clogged up"
                ],
                display: "sign",
                type: Type.Toggle,
                settings: {
                    hideMessages: {
                        name: "Block some useless messages",
                        type: Type.Toggle
                    },
                    moveMessages: {
                        name: "Move some messages from main chat and to the corner of the screen",
                        type: Type.Toggle
                    },
                    hideMessagesInsteadOfBlock: {
                        name: "Just block the messages from showing instead of moving them",
                        type: Type.Toggle
                    },
                    testMessageButton: {
                        name: "Click to send a test message",
                        type: Type.Button
                    },
                    messageLocation: {
                        name: "What corner of the screen should the messages be moved to?",
                        type: Type.RingSelect
                    },
                    advancedSettingsInfo: {
                        name: "&cWARNING &rThe following settings are for ADVANCED users only!",
                        type: Type.Info
                    },
                    xOffset: {
                        name: "The x offset of the moved messages",
                        type: Type.Slider
                    },
                    yOffset: {
                        name: "The y offset of the moved messages",
                        type: Type.Slider
                    },
                    editMessageEditsButton: {
                        name: "Click to edit what messages are moved or hidden",
                        type: Type.Button
                    }
                }
            },
            performance: {
                name: "Performance",
                description: [
                    "A bunch of settings that should",
                    "improve your performance"
                ],
                display: "redstone",
                type: Type.Toggle,
                settings: {
                    performanceInfo: {
                        name: "It is recomended to leave these at default values",
                        type: Type.Info
                    },
                    disableAmourStandRender: {
                        name: "Disable rendering armourstands",
                        type: Type.Toggle
                    },
                    armourStandRenderDistance: {
                        name: "Enable the armourstand render distance",
                        type: Type.Toggle
                    },
                    armourStandRenderDistance: {
                        name: "Armourstand render distance",
                        type: Type.Slider
                    },
                    playerRenderDistance: {
                        name: "Enable player render distance (if more than 25 players online)",
                        type: Type.Toggle
                    },
                    splashEntityDisable: {
                        name: "Disable rendering close entitys during a splash",
                        type: Type.Toggle
                    }
                }
            },
            dungeon: {
                name: "Dungeon",
                description: [
                    "Some QOL features for when",
                    "you are in a dungeon"
                ],
                display: "end_portal_frame",
                type: Type.Toggle,
                settings: {
                    watcherFinishedAlert: {
                        name: "Watcher finished spawning mobs alert",
                        type: Type.Toggle
                    },
                    spiritBearHitbox: {
                        name: "Show a hitbox around the spirit bear and spirit bow to help them stand out",
                        type: Type.Toggle
                    },
                    partyKickerInfo1: {
                        name: "Auto party kicker",
                        type: Type.Info
                    },
                    partyKickerInfo2: {
                        name: "&7This will kick people from the party that join and dont meed reqs",
                        type: Type.Info
                    },
                    partyKickerMinClassLevel: {
                        name: "Minimum class level for players to join",
                        type: Type.Slider
                    },
                    partyKickerAllowHealer: {
                        name: "Allow Healers to join the party",
                        type: Type.Toggle
                    },
                    partyKickerAllowMage: {
                        name: "Allow Mages to join the party",
                        type: Type.Toggle
                    },
                    partyKickerAllowTank: {
                        name: "Allow Tanks to join the party",
                        type: Type.Toggle
                    },
                    partyKickerAllowBeserker: {
                        name: "Allow Beserkers to join the party",
                        type: Type.Toggle
                    },
                    partyKickerAllowArcher: {
                        name: "Allow Archers to join the party",
                        type: Type.Toggle
                    }
                }
            },
            hud: {
                name: "HUD",
                description: [
                    "Some basic HUD features"
                ],
                display: "painting",
                type: Type.Toggle,
                settings: {
                    showFpsCps: {
                        name: "Show Fps and Cps",
                        type: Type.Toggle
                    },
                    showCurrentPet: {
                        name: "Show the current pet in use",
                        type: Type.Toggle
                    },
                    petDisplayX: {
                        name: "The x posistion of the current pet",
                        type: Type.Slider
                    },
                    petDisplayY: {
                        name: "The y posistion of the current pet",
                        type: Type.Slider
                    }
                }
            },
            sbg: {
                name: "SBG",
                description: [
                    "Some SBG (Hypixel guild) features",
                    "This wont affect you if you arent in",
                    "the guild"
                ],
                display: "lapis_block",
                type: Type.Toggle,
                settings: {
                    reminderTitle: {
                        name: "Show reminders as Title",
                        type: Type.Toggle
                    },
                    reminderTy: {
                        name: "Say TY in guild chat after a reminder",
                        type: Type.Toggle
                    }
                }
            },
            guild: {
                name: "Guild",
                description: [
                    "Some Hypixel Guild features"
                ],
                display: "double_plant",
                type: Type.Toggle,
                settings: {
                    autoWelcome: {
                        name: "Automaticly welcome new players into the guild",
                        type: Type.Toggle
                    },
                    showSBStatsOnReqJoin: {
                        name: "Show a player's skyblock stats when they send a Guild Join Request",
                        type: Type.Toggle
                    }
                }
            }
        }

        let oldSettingsData = null

        try {
            oldSettingsData = JSON.parse(FileLib.read("soopyAddonsData", "settings.json"));
        } catch (e) { }

        this.loadSettings(oldSettingsData)
    }

    loadSettings(oldSettings) {
        if (oldSettings == null) {
            oldSettings = {}
        }

        Object.keys(oldSettings).forEach((CategoryKey) => {
            let category = oldSettings[CategoryKey]

            Object.keys(category).forEach((SettingKey) => {
                let setting = category[SettingKey]

                let changeSetting = true;

                try {
                    if (typeof (setting) == undefined) { changeSetting = false }
                    if (typeof (setting) != typeof (this.settings[CategoryKey][SettingKey])) { changeSetting = false }
                } catch (e) {
                    changeSetting = false
                }

                if (changeSetting) {
                    this.settings[CategoryKey][SettingKey] = setting
                }
            })
        })

        this.saveSettings()
    }

    saveSettings() {
        new Thread(() => {
            FileLib.write("soopyAddonsData", "settings.json", JSON.stringify(this.settings));
        }).start()
    }

    open() {
        ticksSinceOpen = 0;
        animOffTime = 0;
        scrollPrev = 0;
        scrollCurrent = 0;
        selectedModule = null;
        gui.open();
    }

    close() {
        gui.close();
    }

    getSetting(category, setting) {
        return this.settings[category][setting]
    }

    setSetting(category, setting, settingVal) {
        this.settings[category][setting] = settingVal
        this.saveSettings()
    }
}


settings = new Settings();

Object.keys(settings.settingsData).forEach((settingModuleKey) => {
    let item = settings.settingsData[settingModuleKey].display

    items[item] = new Item("minecraft:" + item)
    if (items[item] == undefined) {
        items[item] = new Item("minecraft:stone")
    }
})

export default settings;