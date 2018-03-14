const SAVES = 'saves';

var gameFile = {
    playerPositionX: null,
    playerPositionY: null,
    cameraOffsetX: null,
    cameraOffsetY: null,
    playerCurrentHealth: null,
    itemsInInventory: [],
    };

const SAVE_FILE_AMOUNT = 3;
var saveFileTextContext = "";

var saveMenuOpen = false;
var gameSaveSlots = [null,null,null];
var gameSaveSlotsIndex = 0;
var gameFile1;
var gameFile2;
var gameFile3;

function saveGame(saveArray) {
    localStorage.setItem(SAVES, JSON.stringify(saveArray));
    console.log("gameFile saved");
};

function loadGame(stateFromArray) {
    return JSON.parse(localStorage.getItem(stateFromArray));
};

function updateGameFile() {
    gameFile = {
        playerPositionX: player.x,
        playerPositionY: player.y,
        cameraOffsetX: cameraOffsetX,
        cameraOffsetY: cameraOffsetY,
        playerCurrentHealth: player.currentHealth,
        itemsInInventory: [],
    };

    for (var i = 0; i < inventoryItems.length; i++) {
        gameFile.itemsInInventory.push(inventoryItems[i].itemObtained);
    };
}

function updateStateWithGameFile(gameFile) {
    player.x = gameFile.playerPositionX;
    player.y = gameFile.playerPositionY;
    cameraOffsetX = gameFile.cameraOffsetX;
    cameraOffsetY = gameFile.cameraOffsetY;
    player.currentHealth = gameFile.playerCurrentHealth;

    for (var i = 0; i < gameFile.itemsInInventory.length; i++) {
        inventoryItems[i].itemObtained = gameFile.itemsInInventory[i];
    };
}

function drawSaveMenu() {
    var fileBoxX = 80;
    var fileBoxY = 17.5;
    var fileBoxWidth = 235;
    var fileBoxHeight = 50;
    var fileBoxSpacing = 5;
    var headerWidth = 310;
    var headerHeight = 11;
    colorRect(0, 0, canvas.width,canvas.height, 'black');
    colorRect(fileBoxSpacing, fileBoxSpacing/2, headerWidth,headerHeight, 'blue');
    for (var j = 0; j < SAVE_FILE_AMOUNT; j++) {
        if (j == gameSaveSlotsIndex) {
            gameSaveSlotsIndex = j;
            colorRect(fileBoxX, fileBoxY, fileBoxWidth, fileBoxHeight, 'yellow');
        } else {
            colorRect(fileBoxX, fileBoxY, fileBoxWidth, fileBoxHeight, 'blue');
        }

        drawPixelfontCentered("EMPTY FILE", fileBoxX + fileBoxWidth/2 + fileBoxSpacing, 
                              fileBoxY + fileBoxHeight/2 - fileBoxSpacing/2);

        fileBoxY += fileBoxHeight + fileBoxSpacing;


    }
    drawPixelfont("Please select file to " + saveFileTextContext, fileBoxSpacing + 5, fileBoxSpacing/2 + 1);

    canvasContext.drawImage(worldPics[TILE_AVOCADO], 30,
                            32.5 + ((gameSaveSlotsIndex) * (fileBoxHeight + fileBoxSpacing)));
};

function saveMenuContext(saving, loading) {
    var savingGame = saving;
    var loadingGame = loading;
    if (savingGame) {
        saveFileTextContext = "save";
    } else if (loadingGame) {
        saveFileTextContext = "load";
    }
}

function moveSaveMenu(keyName) {
    if (keyName === 'up') {
        gameSaveSlotsIndex--;
    }
    else if (keyName === 'down') {
        gameSaveSlotsIndex++;
    }

    if (gameSaveSlotsIndex >= SAVE_FILE_AMOUNT) {
        gameSaveSlotsIndex = 0;
    }
    else if (gameSaveSlotsIndex < 0) {
        gameSaveSlotsIndex = SAVE_FILE_AMOUNT - 1;
    }
};

/*var state = load();
state.score += 10;
save(state);*/