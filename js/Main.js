var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;
const MUSIC_VOLUME = 0.17; // 0=none 1=loud

var player = new playerClass();

var particleList = [];

var paused = false;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');
	loadImages();
}

function imageLoadingDoneSoStartGame() {
	
	runThatGame();
}

function runThatGame(){
	setInterval(updateAll, 1000/FRAMES_PER_SECOND);
	
	if (MUSIC_VOLUME>0) // should we loop some music quietly?
		Sound.stop("mage_hook_chiptune_menu_melody");
		Sound.play("MageHookThemeSong",true,MUSIC_VOLUME);

	setupInput();
	backupRoomData(); // should do before any numbers are replaced and load level etc.
	initRoomData()
	loadLevel();
	resetAllRooms();
	createTileArray();
}

//this should prob be in Room.js
function loadLevel() {
	console.log("loading level");

	var nextRoom = roomCoordToVar();
	if(nextRoom==undefined) {
		console.log("NO SUCH ROOM IS DEFINED, undoing room change");
		currentRoomCol = lastValidCurrentRoomCol;
		currentRoomRow = lastValidCurrentRoomRow;
		currentFloor = lastValidCurrentFloor;
		return;
	}
	lastValidCurrentRoomCol = currentRoomCol;
	lastValidCurrentRoomRow = currentRoomRow;
	lastValidCurrentFloor = currentFloor;
	currentRoom = nextRoom;
	worldGrid = currentRoom.layout.layers[0].data
	for(var i in currentRoom.layout.tilesets){		
		if(currentRoom.layout.tilesets[i].tileproperties){
			for(var j in currentRoom.layout.tilesets[i].tileproperties){
				objectDictionary[parseInt(currentRoom.layout.tilesets[i].firstgid) + parseInt(j)] = currentRoom.layout.tilesets[i].tileproperties[j]
			}
		}
	}
	// if(currentRoom.layers && currentRoom.layers.length && currentRoom.layers.data){
		
	// } else {
	// 	worldGrid = []
	// }

	
	if (!noDamageForFloor[currentFloor - 1]) {
		removeAllItemsOfTypeInRoom(ITEM_ARTIFACT); 
	}
	player.reset("Untitled Player");
	
}

function updateAll() {
	
	if (_TEST_AI_PATHFINDING)
		currentRoom.updatePathfindingData()
	
	if(paused){
		return;
	}

	moveAll();
	scrollCamera();
	drawAll();
	if (_DEBUG_ENABLE_TILE_EDITOR == true) {
    roomTileCoordinate();
  	}
	updateScreenshake();
	currentRoom.considerRoomChange();
}

function moveAll() {
	

	player.move();
	player.poisoned();
	currentRoom.moveMyEnemies();
	currentRoom.moveMagic();
	updateItems();
	updateParticles();
	updatePanel(debugPanel);
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	//TODO: remove
	

	drawWorld();
	currentRoom.drawTraps();
	drawItems();
	//canvasContext.drawImage(sprites.Concept.background1, 0,0);
	currentRoom.drawDynamic();
	drawParticles();
	
	drawPanelWithButtons(debugPanel);
}

function raycastingForPlayer() {
	var nextTileX = player.x;
	var nextTileY = player.y;
	var isGround = true;
	while (isGround) {
		if (player.facingDirection() == NORTH) {
			nextTileY -= 20; 
		} else if (player.facingDirection() == SOUTH) {
			nextTileY += 20;	
		} else if (player.facingDirection() == EAST) {
			nextTileX += 20;	
		} else if (player.facingDirection()  == WEST) {
			nextTileX -= 20;	
		}
		tileIndex = getTileIndexAtPixelCoord(nextTileX, nextTileY);
		if (worldGrid[tileIndex] != TILE_GROUND) {
			return tileIndex;
			break; // FIXME: this never fires
		}
	}
}