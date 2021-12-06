import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, @SelectorProperty} from 'Vigilance';

@Vigilant("SoopyAddons")
class Settings {
    @SwitchProperty({
        name: "Better line break",
        description: "Makes the ---- look better in friend requests, ect",
        category: "Improvements"
    })
    betterLineBreak = true
    @SwitchProperty({
        name: "Better mort gui",
        description: "Changes the look of the mort dungeons gui",
        category: "Improvements",
        subcategory: "Mort gui"
    })
    betterMortGuiEnabled = true
    @SwitchProperty({
        name: "Show slayer exp in chat",
        description: "Shows your current slayer exp in the chat whenever you kill a boss",
        category: "Improvements"
    })
    slayerInChat = true
    @SwitchProperty({
        name: "Enable spam hider",
        description: "The spam hider will either remove annoying messages from chat or will move it to a more convient place on your screen",
        category: "Spam hider"
    })
    spamHiderEnabled = true
    @SwitchProperty({
        name: "Just remove some annoying messages",
        description: "Hide some messages that have no point and are just annoying",
        category: "Spam hider"
    })
    spamHiderRemoveAnnoying = true
    @SwitchProperty({
        name: "Move some messages from main chat",
        description: "Move some messages that are less annoying and maby have a point but still spam your chat to a different location on the screen so you can still see them but they wont clutter your chat",
        category: "Spam hider"
    })
    spamHiderMoveEnabled = true
    @SwitchProperty({
        name: "Block the messages instead of just moving them",
        description: "Basicly just takes the whole move messages array and adds it to the block messages array",
        category: "Spam hider"
    })
    spamHiderBlockAllEnabled = true
    @SelectorProperty({
        name: "What corner of the screen for the messages to show at",
        description: "Will change the align, animation in and location of the spam hider to whatever corner of the screen you select",
        category: "Spam hider",
        options: [
            "Top left",
            "Top Right",
            "Bottom Right"
        ]
    })
    spamHiderLocation = 1

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "shows... cool stuff :)")
        this.setSubcategoryDescription("General", "Category", "Shows off some nifty property examples.")
    }
}

export default new Settings;