const SAVE_FILE = 'save';

var gameFile = {
    playerPositionX: null,
    playerPositionY: null,
    cameraOffsetX: null,
    cameraOffsetY: null,
    playerCurrentHealth: null,
    itemsInInventory: [],
    };

var saveMenuOpen = false;

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
    var saveFileAmount = 3;
    canvasContext.save();
    colorRect(0, 0, canvas.width,canvas.height, 'black');
    colorRect(fileBoxSpacing, fileBoxSpacing/2, headerWidth,headerHeight, 'blue');
    for (var j = 0; j < saveFileAmount; j++) {
        colorRect(fileBoxX, fileBoxY, fileBoxWidth, fileBoxHeight, 'blue');
        fileBoxY += fileBoxHeight + fileBoxSpacing;
    }
    canvasContext.restore();
    drawPixelfont("Please select save file", fileBoxSpacing + 5, fileBoxSpacing/2 + 1);
};

/*var state = load();
state.score += 10;
save(state);
*/