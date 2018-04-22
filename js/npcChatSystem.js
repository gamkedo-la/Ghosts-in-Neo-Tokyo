// A simple NPC dialogue system
// made for gamkedo with love from mcfunkypants
// uses pixelFont.js

// an object you can stick in your player or enemy class

// for example
// this.chat = new npcChatSystem();
// this.chat.say("Hello World");

// run this every frame:
// this.chat.draw(this.x,this.y);

function npcChatSystem(defaultFaceImage) {

    // public vars you can tweak per object in realtime
    this.timespan = 4000; // bubble disappears after this many MS
    this.animLength = 1500; // how long it animates in MS
    this.offsetX = 0; // how many px to the left of centered we draw
    this.offsetY = -40; // how many px above the npc we draw

    // private vars for internal use
    var chatTime = 0; // timestamp of last message
    var chat = ""; // current full string
    var wordBubbleMode = true; // if false, use "footer" instead
    var faceImage = defaultFaceImage; // used in footer
    this.textNode = null;
    this.textNodeIndex = null;
    // start a fresh animated word bubble
    this.sayBubble = function (str) {
        chat = str;
        wordBubbleMode = true;
        chatTime = performance.now();
    }

    this.sayFooter = function (str, newFaceImage) {
        if (str == chat) return; // don't fire again if called repeatedly
        master_bgm.switchTo(1,1); // Switch to dialog music
        sceneInProgress = true;
        chat = str;
        // we may need extra time for long texts
        this.animLength = 50 * str.length;
        this.timespan = 2000 + this.animLength;
        wordBubbleMode = false;
        chatTime = performance.now();
        if (newFaceImage)
            this.faceImage = newFaceImage;
    }
    this.startScene = function(textNodeId){
        this.textNode =  textNodes[textNodeId]
        this.textNodeIndex = -1
        this.nextLine();
    }

    this.nextLine = function(){
        if(this.textNodeIndex < this.textNode.length - 1 ){
            this.textNodeIndex += 1;
            var id = Object.getOwnPropertyNames(grampaIntro[this.textNodeIndex])

            this.sayFooter(this.textNode[this.textNodeIndex][id], sprites[id]["portrait"])
        } else {
            this.textNode = null
            this.textNodeIndex = null
        }
    }

    // render a footer if required
    this.drawFooter = function () {
        if(this.textNode){
            if (performance.now() < chatTime + this.timespan) {
                npcTextFooter(chat, this.faceImage, chatTime, chatTime + this.animLength);
            } else {
                this.nextLine()
            }
        }
        if (chat == '') {
            return;
        }
        if (wordBubbleMode) return;
        // only draw for a while
        if (performance.now() < chatTime + this.timespan) {
            npcTextFooter(chat, this.faceImage, chatTime, chatTime + this.animLength);
        }
        else {
            chat = '';
            master_bgm.switchTo(0,1); // Switch back to level music
            sceneInProgress = false;
        }
    }

    // render a word bubble if required
    this.drawBubble = function (x, y) {
        if (chat == '') return;
        if (!wordBubbleMode) return;
        // only draw for a while
        if (performance.now() < chatTime + this.timespan) {
            npcWordBubble(chat, x + this.offsetX, y + this.offsetY, chatTime, chatTime + this.animLength);
        }
        else {
            chat = '';
        }
    }

}

// the NPC dialogue "footer bar" cannot be rendered
// during enemy.draw (due to camera offset)
// and we only want a single chat GUI at a time
var npcGUI = new npcChatSystem(); // not used for word bubbles




var grampaIntro = [
    {"GrandpaGhost": "Oh, Ichiro, is that you?"},
    {"Player": "? Me?"},
    {"GrandpaGhost": "Oh, it is you! It's been a while hasn't it?"},
    {"Player": "..."},
    {"GrandpaGhost": "My boy, why don't you try some of my karaage? \n It's been a while since I've had a happy,\n smiling customer."},
    {"GrandpaGhost": "Hold on a moment while I get these burners\n running..."},
    {"GrandpaGhost": "..."},
    {"GrandpaGhost": "To tell you the truth, business hasn't been \n going too well. \nNo matter how much I call out, no one seems\n to notice I'm here."},
    {"GrandpaGhost": "My voice must not be as loud as it used to be."}, 
     {"Player": "Sorry but I -"},
    {"GrandpaGhost": "Here we go! All done. \nAh, and looks like there'll be extras."},
    {"GrandpaGhost": "Why don't you share some with your friends?"},
    {"Player": "... Sure, why not."},
]
var textNodes = {
    "grampaIntro":grampaIntro
}
