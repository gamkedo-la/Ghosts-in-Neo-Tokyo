const SAVE_FILE = 'save';

var gameFile = {
    playerPositionX: null,
    playerPositionY: null,
    cameraOffsetX: null,
    cameraOffsetY: null,
    totalXTranslation: null,
    totalYTranslation: null,
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

/*var state = load();
state.score += 10;
save(state);
*/