const SAVE_FILE = 'save';

var gameFile = {
    playerPositionX: null,
    playerPositionY: null,
    cameraOffsetX: null,
    cameraOffsetY: null,
    playerCurrentHealth: null,
    itemsInInventory: [],
    };

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


/*var state = load();
state.score += 10;
save(state);
*/