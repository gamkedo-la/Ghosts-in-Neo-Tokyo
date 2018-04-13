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

  //  console.log(mouseCanvasY);
};


//Checks every frame if condition is true
//If it is, set new transition
function ChangeGameStateOnCondition( condition, newState){
    if(condition){
        GameState_ = newState;
    }
}

var creditNames = ["Project Lead: ClayTaeto ", 
                   "RainMaker: McFunkyPants",
                   "Cool Guy : Chris Deleon",
                   "More To Come"
                   ];
var scrollY = 0;
function drawCredits(){
    var startY = 200;// 60;
    var spaceBetween = 20;
    var scrollSpeed = 10;
    scrollY -= scrollSpeed * TIME_PER_TICK;

    for (var i = 0; i < creditNames.length; i++) {
        DrawLabel(creditNames[i], canvas.width/2-50, startY+ spaceBetween*i + scrollY ,  100, 25); 
    }

    // DrawLabel("Project Lead: ClayTaeto ", canvas.width/2-50, startY+20 + scrollY ,  100, 25); 
    //    // DrawLabel("ClayTaeto ", canvas.width/2-50, startY+25 + scrollY ,  100, 25); 

    // DrawLabel("RainMaker: McFunkyPants", canvas.width/2-50, startY+40 + scrollY ,  100, 25); 
    // DrawLabel("Cool Guy : Chris Deleon", canvas.width/2-50, startY+60 + scrollY ,  100, 25); 
    // DrawLabel("More To Come", canvas.width/2-50, startY+80 + scrollY ,  100, 25); 

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

