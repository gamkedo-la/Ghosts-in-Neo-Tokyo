// quick n dirty pixel font using a spritesheet
// made for gamkedo with love from mcfunkypants

// ascii 32-64 space ! " # $ % & ' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @
// ascii 65-96 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \ ] ^ _ `
// ascii 97-126 a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~

var pixelfont_x_margin = 0; // where the lines start
var pixelfont_overlap_x = -1; // kerning
var pixelfont_space_width = 5; // width of " " 
var pixelfont_x = 0; // where we last were
var pixelfont_y = 0; // current line
var pixelfont_line_height = 8; // pixels

// data for letter widths and sprite locations
// specific to the /img/UI/pixelFont.png image
var pixelfont_h = 8; // sprite heights
var pixelfont_w = [ // sprite widths
4,7,9,7,10,9,4,5,5,6,8,5,6,4,6,7,4,7,7,7,7,7,7,7,7,4,4,6,6,6,8,8,
7,7,7,7,7,8,7,7,4,7,7,7,9,8,7,7,8,7,7,8,7,7,9,7,8,7,5,6,5,8,6,0,
7,7,6,7,7,6,7,7,5,6,7,5,9,7,7,7,7,7,7,6,7,7,9,7,7,7,5,5,4,5,9];
var pixelfont_dx = [ // sprite coordinates for each letter sprite in the font map image
0,5,13,23,31,42,52,57,63,69,76,85,91,98,103,110,118,123,131,139,147,155,163,171,179,187,192,197,204,211,218,227,
0,8,16,24,32,40,48,56,64,69,77,85,93,103,112,120,128,137,145,153,162,170,178,188,196,205,213,219,226,232,241,-1,
0,8,16,23,31,39,46,54,62,68,75,83,89,99,107,115,123,131,139,147,154,162,170,180,188,196,204,210,216,221,227];
var pixelfont_dy = [
32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,
40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,
48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48];
// TODO: sprite coords could be calculated using pixelfont_h and w
// see untested commented-out code at bottom of file, TODO

function pixelfont_measure(str)
{
    var w = 0;
    var index = 0;
    var max = 0; // multiple lines count from 0

    // delete any "$emotes "
    str = stringWithoutEmotes(str);

    for (var c=0,len=str.length; c<len; c++)
    {
        index = str.charCodeAt(c)-32-1;
        if (pixelfont_w[index]==undefined) index = 0;
        w += pixelfont_w[index];
        if (str[c]=="\n") w = 0; // new line
        if (max<w) max = w;
    }
    return w;
}

// warning, gets called every frame that a npc chat text has an emote code in it
function handleEmote(emoteCode) {
    //console.log("handleEmote: "+emoteCode); // FIXME implement!
}

function pixelfont_draw(str,x,y)
{
    // sanity checks for globals init by the game engine
    if (!window.canvasContext) {
        console.log("pixelfont_draw: missing canvasContext");
        return;
    }
    if (!window.sprites || !window.sprites.UI || !window.sprites.UI.pixelFont) {
        console.log("pixelfont_draw: missing sprites.UI.pixelFont");
        return;
    }

    pixelfont_x_margin = x;
    pixelfont_x = x;
    pixelfont_y = y;
    var sw = 0;
    var sx = 0;
    var sy = 0;
    var index = 0;

    var insideEmote = false;
    var skipThisChar = false;
    var emoteCode = "";

    for (var c=0,len=str.length; c<len; c++)
    {
        index = str.charCodeAt(c)-32-1; 

        skipThisChar = false;
        if (insideEmote) {
            if (str[c]==" ") {
                insideEmote = false;
                skipThisChar = true; // avoid double space from where we delete the $code
                handleEmote(emoteCode);
            } else {
                emoteCode = emoteCode + str[c];
            }
        }
        else if (str[c]=="$")
        {
            insideEmote = true;
            emoteCode = "";
        }

        if (!insideEmote && !skipThisChar) {

            // linefeed?
            if (str[c]=="\n")
            {
                //console.log('TXT newline!');
                pixelfont_x = pixelfont_x_margin;
                pixelfont_y += pixelfont_line_height;
            }
            // missing character or space
            else if (pixelfont_w[index]==undefined)
            {
                pixelfont_x += pixelfont_space_width; // space
            }
            else // normal letter
            {
                sw = pixelfont_w[index];
                sx = pixelfont_dx[index];
                sy = pixelfont_dy[index];

                // debug! (ps the game starts at frame 1)
                // if (frame_count==1) console.log('txt: index:'+index+'=['+str[c]+'] '+sx+','+sy+' width='+sw)

                // draw it
                canvasContext.drawImage(sprites.UI.pixelFont, // see imgPayload.js
                    sx,
                    sy,
                    sw,
                    pixelfont_h,
                    pixelfont_x,
                    pixelfont_y,
                    sw,
                    pixelfont_h);
                    
                // move to next position
                pixelfont_x = pixelfont_x + sw + pixelfont_overlap_x;
            } // draw
        } // in not in an emote code
    } // char loop
    return sw; // returns pixel width of string
}

// count the chars in a string but ignore any word starting with $
function stringLengthWithoutEmotes(str) {
    return stringWithoutEmotes(str).length;
}

// strip out anything like "$code " from a string
function stringWithoutEmotes(str) {
    var insideEmote = false;
    var output = "";
    var insideEmote = false;
    var skipThisChar = false;
    var emoteCode = "";

    for (var c=0; c<str.length; c++) {

        skipThisChar = false;
        if (insideEmote) {
            if ((str[c]==" ")) {
                insideEmote = false;
                skipThisChar = true;
            }
        }
        else if (str[c]=="$")
        {
            insideEmote = true;
            emoteCode = "";
        }
        
        if (!insideEmote && !skipThisChar) 
        {
            output = output + str[c];
        }
    }

    //console.log('stringWithoutEmotes='+output);
    return output;
}

// animate the letters of a string if now is within range
function npc_text(message,x,y,starttime,endtime) {

    if (!message || !message.length) return; // sanity
    x = Math.round(x);
    y = Math.round(y);
    var now = performance.now(); // timestamp
    var count = 0; // how many characters to draw this frame
    var percent = 1; // where are we in the animation
    var bubbleWidth = pixelfont_measure(message);
    
    if (now<starttime) {
        count = 0; // draw nothing and wait to start
    } 
    else if (now>endtime) {
        count = message.length; // done animating, draw it all
    }
    else if (now>=starttime && now<=endtime) // partway done
    {
        percent = (now-starttime) / (endtime-starttime);
        count = Math.floor(message.length * percent); 
    }
    
    // now render however many chars we want
    message = message.substring(0, count); // FIXME: we need to SKIP (include all the) $emote chars
    
    // draw the word bubble left side
    canvasContext.drawImage(sprites.UI.pixelFont, // see imgPayload.js
        0, // sx
        0, // sy
        bubbleWidth, // sw
        32, // sh
        x-6, // dx
        y-6, // dy
        bubbleWidth, // dw
        32); // dh
    
    // draw the word bubble right side (for liquid layout to fit text)
    canvasContext.drawImage(sprites.UI.pixelFont, // see imgPayload.js
        252, // sx
        0, // sy
        4, // sw
        32, // sh
        x-6+bubbleWidth, // dx
        y-6, // dy
        4, // dw
        32); // dh

    //console.log("npc_text:["+message+"] pos:"+x+","+y+" "+~~starttime+" to "+~~endtime+" now="+~~now+" percent:"+~~percent*100);
    pixelfont_draw(message,x,y);
}





























/*
    // untested WIP code to calculate pixel locations of sprites based on width - buggy a bit maybe +1?
    console.log('var pixelfont_dx = [');
    var sum = 0;
    for (var x=0; x<32; x++)
    {
        sum += pixelfont_w[x];
        console.log(sum+',');
    }
    var sum = 0;
    for (var x=35; x<64; x++)
    {
        sum += pixelfont_w[x];
        console.log(sum+',');
    }
    var sum = 0;
    for (var x=65; x<96; x++)
    {
        sum += pixelfont_w[x];
        console.log(sum+',');
    }
    console.log('];');
*/
