const SAVE_FILE = 'save';

var gameFile = {
    playerPositionX: null,
    playerPositionY: null,
    cameraOffsetX: null,
    cameraOffsetY: null,
    playerCurrentHealth: null,
    itemsInInventory: [],
    };

const SAVE_FILE_AMOUNT = 3;

var saveMenuOpen = false;
var currentFileIndex = 0;

function saveGame(state) {
    localStorage.setItem(SAVE_FILE, JSON.stringify(state));
    console.log("gameFile saved");
};

function loadGame() {
    return JSON.parse(localStorage.getItem(SAVE_FILE));
    console.log("gameFile loaded")
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

function updateStateWithGameFile() {
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
        if (j == currentFileIndex) {
            colorRect(fileBoxX, fileBoxY, fileBoxWidth, fileBoxHeight, 'yellow');
        } else {
            colorRect(fileBoxX, fileBoxY, fileBoxWidth, fileBoxHeight, 'blue');
        }

        drawPixelfontCentered("EMPTY FILE", fileBoxX + fileBoxWidth/2 + fileBoxSpacing, 
                              fileBoxY + fileBoxHeight/2 - fileBoxSpacing/2);

        fileBoxY += fileBoxHeight + fileBoxSpacing;


    }
    drawPixelfont("Please select save file", fileBoxSpacing + 5, fileBoxSpacing/2 + 1);

    canvasContext.drawImage(worldPics[TILE_AVOCADO], 30,
                            32.5 + ((currentFileIndex) * (fileBoxHeight + fileBoxSpacing)));
};

function moveSaveMenu(keyName) {
    if (keyName === 'up') {
        currentFileIndex--;
    }
    else if (keyName === 'down') {
        currentFileIndex++;
    }

    if (currentFileIndex >= SAVE_FILE_AMOUNT) {
        currentFileIndex = 0;
    }
    else if (currentFileIndex < 0) {
        currentFileIndex = SAVE_FILE_AMOUNT - 1;
    }
};

/*var state = load();
state.score += 10;
save(state);
*/