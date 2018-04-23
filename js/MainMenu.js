const SPLASH   = 0;
const MAINMENU = 1; 
const PLAYING  = 2; 
const PAUSED   = 3; 

var GameState_ = SPLASH; //Starting 

var mainMenuCurrentSelection = 0;  //Main Menu Index Var
const MAIN_MENU_BUTTON_COUNT = 3;

var shldDrawCredits = false;

// MAIN MENU OPTIONS
const MAINMENU_OPTION_NEWGAME  = 0;
const MAINMENU_OPTION_CONTINUE = 1;
const MAINMENU_OPTION_CREDITS  = 2;

//Playing around with tweening effects
const DEG2RAD = 0.0174533;
var logoScaleMin = 1.0;
var logoScaleMax = 2.0;
var logoScale    = 1.0;
var timeAccum = 0.0;

var mouseWasHeld = false;


// Button Helper - can add parameter for custom graphics
function ShowButton(message, x, y, width, height, selection, buttonID){
    var active = selection == buttonID;
    var magicValue = 3;
    var color = active ? 'red' : 'blue';
    colorRect(x, y, width, height, color);
    var w = Math.round(width/2) - Math.round( measurePixelfont(message) / 2  );
    drawPixelfont(message,  Math.round(x + w)+magicValue, Math.round( y + height/2)-3 ) ;


    //Mouse Bound Check 
    if( mouseCanvasY < (y + height) && mouseCanvasY > y && mouseCanvasX < (x+width) && mouseCanvasX > x) {
        mainMenuCurrentSelection = buttonID; //note(keenan): HACK BLAH!!!
    }
}

function DrawLabel(message, x, y, width, height){
    var magicValue = 3;
    var color = 'red';
    //colorRect(x, y, width, height, color);
    var w = Math.round(width/2) - Math.round( measurePixelfont(message) / 2  );
    drawPixelfont(message,  Math.round(x + w) + magicValue, Math.round( y + height/2)-3 ) ;
}

function moveMainMenu (keyName) {
    if (keyName === 'up') {
        mainMenuCurrentSelection--;
    }
    else if (keyName === 'down') {
        mainMenuCurrentSelection++;
    }

    if (mainMenuCurrentSelection >= MAIN_MENU_BUTTON_COUNT) {
        mainMenuCurrentSelection = 0;
    }
    else if (mainMenuCurrentSelection < 0) {
        mainMenuCurrentSelection = MAIN_MENU_BUTTON_COUNT - 1;
    }

};


//Checks every frame if condition is true
//If it is, set new transition
function ChangeGameStateOnCondition( condition, newState){
    if(condition){
        GameState_ = newState;
    }
}

var creditNames = [
" Project Lead, prototype, bosses, logo, world loading, art (ghast - toast - plant), player portrait, room change code, large map optimization, Kirt integration, grampaghost, Marc Silva",
"Advanced camera code, fixes (player animation & collisions), buttons, enemy/object differentiation, door locks, boss code tweaks, H Trayford",
"Wall jump code, boss portraits (3), Baron portrait, Grampaghost portrait, Avocado Ghost portrait, tile art (concrete - brick - rad - AC), dialog writing, music (Grampaghost & Baron's theme), beam sprites, addl. signs (3), Herleen Dualan",
"NPC dialog code, rain effects, logo kanji, font integration, initial chase camera, neon signs, Christer \"McFunkypants\" Kaitila",
"Inventory menu and item data integration, avocado drops, karaage sprite, background fix, Dan Dela Rosa",
"Health bar, sounds (ghost laugh - sword), save file, Terrence McDonnell",
"Sound system concept and audio code, music transition crossfade, Michael \"Misha\" Fewkes",
"Gamkedo splash screen, menu screen, level 2, level selector, gating, hitbox fixes, Keenan Cole",
"Music (witch - boss), Sound (hit - jump), ghost voices, addl. sound integration, refactoring, Klaim (A. Joel Lamotte)",
"Tenghost sprite sheet, alley background, street background variations, Rémy Lapointe",
"Initial jump controls, Gerard Moledo",
"Music (ghosts - new age - dialog), three signs, Vignesh Ramesh",
"Minor code cleanup, Fernando L. Canizo",
"Bus stop sign and potted shrub for city background, music (grandpa 2), Ryan Lewis",
"Sushi and misc. item sprites, Ezovex Dickson Goh",
"Skyscrapers backgrounds, Eric Lamarca",
"Kirt art, Nick Fewkes",
"Visagrab sprite, Asix Jin"
];

var scrollY = 0;
function drawCredits(){
    var startY = 200;// 60;B
    var spaceBetween = 12;
    var spaceBetweenJobs = 9

    var scrollSpeed = 25;
    scrollY -= scrollSpeed * TIME_PER_TICK;
    var textPosition = startY;
    for (var i = 0; i < creditNames.length; i++) {
        var jobEntries = creditNames[i].split(","); //Put each job on its own row
        
        for(var j in jobEntries) {
            textPosition += spaceBetweenJobs;

            //Use a double dash to delinate the person's name
            var royalChar = "";
            if(j == jobEntries.length-1) {
                royalChar = " -- "; 
            } 
            DrawLabel(royalChar +   jobEntries[j] + royalChar , canvas.width/2-50,  Math.round(scrollY + textPosition),  100, 25); 
        } 

        textPosition += spaceBetween;

        // If the last credit is off the screen, reset scrollY and loop again
        if(i == creditNames.length - 1 && (scrollY + textPosition) < -1  ){
            scrollY = 50;
            console.log("Reset Credits");
        }
    }
}

function DrawMainMenu(){
        //trying to do some cool effects 
        canvasContext.save();
        //timeAccum += TIME_PER_TICK * .5;
        //logoScale = logoScaleMin + Math.abs(Math.cos(timeAccum) * logoScaleMax);
        // canvasContext.translate(-,-2);
        canvasContext.scale(2, 2);
        canvasContext.drawImage(sprites.UI.logoKanji, Math.round(canvas.width/2)-112, 10);

        canvasContext.restore();

        DrawLabel(mouseCanvasY,  canvas.width/2-50, 60+30,  100, 25 ); 

        if(!shldDrawCredits) {
            var startY = 60;
            ShowButton("New Game",  canvas.width/2-50, startY+30,  100, 25 , mainMenuCurrentSelection, 0); 
            ShowButton("Continue",  canvas.width/2-50, startY+60,  100, 25 , mainMenuCurrentSelection, 1);
            ShowButton("Credits",   canvas.width/2-50, startY+90,  100, 25 , mainMenuCurrentSelection, 2);
        }
        else
        {
            drawCredits();
        }

        //Handle Mouse Events
        if(mouseHeld && mouseWasHeld == false){
            mainMenu_OnEnter();
            mouseWasHeld = true;
        }
        else
        {
            mouseWasHeld = mouseHeld;
        }
}

// Draws Gamkedo Logo
// Image variables can be found in imgPayload.js
// NOTE(keenan): Uncertain how the scaling is working at the moment
function DrawSplashLogo(){
    canvasContext.drawImage(sprites.UI.splashLogo,  Math.round(canvas.width/2 - 566/4) , 50, 566/2, 104/2);
}

// When Enter Button is Pressed During Main Menu
function mainMenu_OnEnter(){

    if(shldDrawCredits){
        shldDrawCredits = false;
        return;
    }

  //  console.log("MainMenu On Enter");
    if(mainMenuCurrentSelection == MAINMENU_OPTION_NEWGAME) {
        GameState_ = PLAYING;
        updateCurrentTracks();
    }
    else if(mainMenuCurrentSelection == MAINMENU_OPTION_CONTINUE) {
        saveMenuContext(false, true);
        GameState_ = PLAYING;
        saveMenuOpen = !saveMenuOpen;
        updateCurrentTracks()
        //console.log("Continue game");
    }
    else if(mainMenuCurrentSelection == MAINMENU_OPTION_CREDITS){
        shldDrawCredits = true;
    }
}

