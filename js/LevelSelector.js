

var levelSelectedIndex = 0;  //Main Menu Index Var
//const MAIN_MENU_BUTTON_COUNT = 3;

var isLevelSelectorOpen = false;

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
        levelSelectedIndex = buttonID; //note(keenan): HACK BLAH!!!
    }
}

function DrawLabel(message, x, y, width, height){
    var magicValue = 3;
    var color = 'red';
    //colorRect(x, y, width, height, color);
    var w = Math.round(width/2) - Math.round( measurePixelfont(message) / 2  );
    drawPixelfont(message,  Math.round(x + w) + magicValue, Math.round( y + height/2)-3 ) ;
}

function moveLevelSelectIndex (keyName) {
    if (keyName === 'up') {
        levelSelectedIndex--;
    }
    else if (keyName === 'down') {
        levelSelectedIndex++;
    }

    if (levelSelectedIndex >= allRooms.length) {
        levelSelectedIndex = 0;
    }
    else if (levelSelectedIndex < 0) {
        levelSelectedIndex = allRooms.length - 1;
    }

  //  console.log(mouseCanvasY);
};

// var scrollY = 0;
// function drawCredits(){
//     var startY = 200;// 60;
//     var spaceBetween = 20;
//     var scrollSpeed = 10;
//     scrollY -= scrollSpeed * TIME_PER_TICK;

//     for (var i = 0; i < creditNames.length; i++) {
//         DrawLabel(creditNames[i], canvas.width/2-50, startY+ spaceBetween*i + scrollY ,  100, 25); 
//     }

//     // DrawLabel("Project Lead: ClayTaeto ", canvas.width/2-50, startY+20 + scrollY ,  100, 25); 
//     //    // DrawLabel("ClayTaeto ", canvas.width/2-50, startY+25 + scrollY ,  100, 25); 

//     // DrawLabel("RainMaker: McFunkyPants", canvas.width/2-50, startY+40 + scrollY ,  100, 25); 
//     // DrawLabel("Cool Guy : Chris Deleon", canvas.width/2-50, startY+60 + scrollY ,  100, 25); 
//     // DrawLabel("More To Come", canvas.width/2-50, startY+80 + scrollY ,  100, 25); 

// }
var levelNames = [ "example", "Level2", "Level3"]

function drawLevelSelector(){
    var spaceBetween = 30;
    var scrollSpeed = 10;
    var startY = 60;

    for (var i = 0; i < levelNames.length; i++) {
    this.ShowButton(levelNames[i],  canvas.width/2-50, startY+ spaceBetween*i ,  100, 25 , levelSelectedIndex, i); 
    }
  
    //Handle Mouse Events
    if(mouseHeld && this.mouseWasHeld == false){
        levelSelector_OnEnter();
        this.mouseWasHeld = true;
    }
    else
    {
        this.mouseWasHeld = mouseHeld;
    }
}


// When Enter Button is Pressed During Main Menu
function levelSelector_OnEnter(){
    loadLevel(levelNames[levelSelectedIndex] ); 
    isLevelSelectorOpen = false;
    GameState_ = PLAYING;
}

