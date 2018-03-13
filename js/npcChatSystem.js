// A simple NPC dialogue system
// made for gamkedo with love from mcfunkypants
// uses pixelFont.js

// an object you can stick in your player or enemy class

// for example
// this.chat = new npcChatSystem();
// this.chat.say("Hello World");

// run this every frame:
// this.chat.draw(this.x,this.y);

function npcChatSystem() {

    // public vars you can tweak per object in realtime
    this.timespan = 4000; // bubble disappears after this many MS
    this.animLength = 1500; // how long it animates in MS
    this.offsetX = 0; // how many px to the left of centered we draw
    this.offsetY = -40; // how many px above the npc we draw

    // private vars for internal use
    var chatTime = 0; // timestamp of last message
    var chat = ""; // current full string

    // start a fresh animated word bubble
    this.say = function (str) {

        chat = str;
        chatTime = performance.now();

        // console.log('npcChatSystem: '+chat);

    }

    // render a word bubble if required
    this.draw = function (x, y) {

        if (chat=='') return;

        // only draw for a while
        if (performance.now() < chatTime + this.timespan) {
            npcTextCentered(chat, x + this.offsetX, y + this.offsetY, chatTime, chatTime + this.animLength);
        }
        else {
            chat = '';
        }

    }

}