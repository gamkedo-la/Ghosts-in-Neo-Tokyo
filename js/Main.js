var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;
const MUSIC_VOLUME = 0.17; // 0=none 1=loud
const deadXZone = 15;//horizontal area where camera does not move
const deadYZone = 25;//vertical area where camera does not move

var player = new playerClass();

var particleList = [];

var paused = false;

var cameraOffsetX = 0;
var cameraOffsetY = 0;

var healthBarFlashing = false;
var barColorRed = true;


// test only: the NPC dialogue fottoer bar at bottom of screen:
var testNPCFooterStartTime = 0;

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
	
	if (MUSIC_VOLUME>0) // should we loop some music quietly?
		//Sound.stop("mage_hook_chiptune_menu_melody");
		//Sound.play("MageHookThemeSong",true,MUSIC_VOLUME);

	setupInput();
	backupRoomData(); // should do before any numbers are replaced and load level etc.
	initRoomData()
	loadLevel();
	resetAllRooms();
	createTileArray();
	
	// placed last just in case the above takes < 1/60 sec
	setInterval(updateAll, 1000/FRAMES_PER_SECOND); 

	// test only - trigger
	testNPCFooterStartTime = performance.now();
}

//this should prob be in Room.js
function loadLevel(DatRoomYO) {
	console.log("loading level");
	if(DatRoomYO){
		currentRoom = allRoomsData[DatRoomYO];
		worldGrid = currentRoom.layout.layers[0].data
		for(var i in currentRoom.layout.tilesets){		
			if(currentRoom.layout.tilesets[i].tileproperties){
				for(var j in currentRoom.layout.tilesets[i].tileproperties){
					objectDictionary[parseInt(currentRoom.layout.tilesets[i].firstgid) + parseInt(j)] = currentRoom.layout.tilesets[i].tileproperties[j]
				}
			}
		}		
		WORLD_COLS = currentRoom.layout.width
		WORLD_ROWS = currentRoom.layout.height

		var nextRoom = allRoomsData[DatRoomYO];
	} else {
		var nextRoom = roomCoordToVar();	
	}

	
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

	/*if (!noDamageForFloor[currentFloor - 1]) {
		removeAllItemsOfTypeInRoom(ITEM_ARTIFACT); 
	}*/
	
	player.reset("Untitled Player");
	
}

function updateAll() {
	
	if (_TEST_AI_PATHFINDING)
		currentRoom.updatePathfindingData()
	
	if(paused) {
		drawInventory();
		drawInventoryItems();
		return;
	}

	if (saveMenuOpen) {
		drawSaveMenu();
		return;
	}

	moveAll();
	drawAll();
	AudioEventManager.updateEvents();
	updateScreenshake();
	currentRoom.considerRoomChange();
}

function moveAll() {
	
	player.move();
	player.poisoned();
    player.handleWallJump();
	currentRoom.moveMyEnemies();
	currentRoom.moveMyObjects();
	currentRoom.moveMagic();
	updateItems();
	updateParticles();
	updatePanel(debugPanel);
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	
	updateCameraPosition();
	
	//TODO: remove
	
	canvasContext.drawImage(sprites.Background.skyscrapers, 0,20);
	canvasContext.drawImage(sprites.TenGhost.move, 25,50);
	drawWorld();
	currentRoom.drawTraps();
	drawItems();
	currentRoom.drawDynamic();
	currentRoom.drawMyObjects();
	drawHealth();
	drawParticles();
	drawPanelWithButtons(debugPanel);	
	drawWorldLabels();
	canvasContext.restore();
	drawHeader();
	npcGUI.drawFooter();
	
}

function updateCameraPosition() {
	//Position the camera horizontally, leaving a dead zone in the center of the screen
	if(player.x > canvas.width - cameraOffsetX + canvas.width / 2) {//teleport right to the player's position
		cameraOffsetX = -(player.x + (1.5 * canvas.width));
	} else if(player.x > 1.5 * deadXZone - cameraOffsetX + canvas.width / 2) {//player is far right of center -> move quickly
		cameraOffsetX -= 3;
	} else if(player.x > deadXZone - cameraOffsetX + canvas.width / 2) {//player is slightly right of center -> move slowly
		cameraOffsetX -= 1;
	} else if(player.x < -canvas.width - cameraOffsetX + canvas.width / 2) {//teleport left to the player's position
		cameraOffsetX = player.x - (1.5 * canvas.width);//no idea why it is 1.5 * width
	} else if(player.x < -1.5 * deadXZone - cameraOffsetX + canvas.width / 2) {//player is far left of center -> move quickly	
		cameraOffsetX += 3;
	} else if(player.x < -deadXZone - cameraOffsetX + canvas.width / 2) {//player is far left of center -> move slowly
		cameraOffsetX += 1;
	}
	
	//Do not move the camera so far right or left that areas outside of the world are visible
	if (cameraOffsetX > 0) {
		cameraOffsetX = 0;
	} else if (cameraOffsetX < -((WORLD_COLS * WORLD_W) - canvas.width)) {
		cameraOffsetX = -((WORLD_COLS * WORLD_W) - canvas.width);
	}
	
	//Position the camera vertically, leaving a dead zone in the center of the screen
	if(player.y > (canvas.height - cameraOffsetY)) {//player has fallen below the visible area -> move very quickly
		cameraOffsetY -= 10;
	} else if(player.y > (canvas.height - deadYZone - cameraOffsetY)) {//player is approaching the bottom of the visible area -> move quickly
		cameraOffsetY -= 5;
	} else if(player.y > (canvas.height - 3 * deadYZone - cameraOffsetY)) {//player is below the dead zone -> move slowly
		cameraOffsetY -= 2;
	} else if(player.y < -cameraOffsetY) {//player has exited visible area upward -> move very quickly
		cameraOffsetY += 10;
	} else if(player.y < (2 * deadYZone - cameraOffsetY)) {//player is above the dead zone -> move slowly
		cameraOffsetY += 2;
	}
	
	//Do not move the camera so far up or down that the areas outside of the world are visible
	if (cameraOffsetY > 0) {
		cameraOffsetY = 0;
	} else if (-cameraOffsetY > ((WORLD_ROWS * WORLD_H) - canvas.height)) {
		cameraOffsetY = -((WORLD_ROWS * WORLD_H) - canvas.height);
	}

	canvasContext.save();
	clearCanvas();

	canvasContext.translate(cameraOffsetX, cameraOffsetY);
}

function drawHeader() {	// fun little gui header logo bar
	canvasContext.drawImage(sprites.UI.logoKanji, Math.round(canvas.width/2)-34,-2);
	canvasContext.globalAlpha=0.5;
	drawPixelfontCentered("Ghosts in",Math.round(canvas.width/2),1); 
	drawPixelfontCentered("Neo Tokyo",Math.round(canvas.width/2),12); 
	canvasContext.globalAlpha=1.0;
}

function drawWorldLabels() { // street signs, etc
	
	// pixelart spritesheet text rendering anywhere in the world using img/UI/pixelFont.png woo hoo
	// can be used for door labels, wall grafitti, street signs, etc.
	drawPixelfont("<-- Trap Door",355,128);
	drawPixelfont("Do Not\nPress!",108,128);
	drawPixelfont("Edge of the world -->",508,167);

}

function drawHealth() {
	var healthBarFlashTimer = 0;
	var posX = 18;
	var posY = canvas.height - NPC_FOOTER_HEIGHT - 7;
	var cornerX = posX - cameraOffsetX;
	var cornerY = posY - cameraOffsetY;
    var playerMaxHealth = player.maxHealth;
    var playerHP = player.currentHealth;
    var barColor;
    var healthBarWidth = (playerHP/playerMaxHealth) * sprites.UI.healthBarEmpty.width;
    if (player.isInvincible) {
			if (healthBarFlashTimer <= 0 || healthBarFlashTimer == undefined) {
				healthBarFlashTimer = FLASH_DURATION;
				barColorRed = !barColorRed;
			}
			healthBarFlashTimer -= TIME_PER_TICK;
			if (player.invincibleTimer <= 0) {
				barColorRed = true;
			}
		}
	
	canvasContext.globalAlpha=0.5
	canvasContext.drawImage(sprites.UI.healthBarEmpty, cornerX,cornerY);
    if (barColorRed) {
    	barColor = 'red';
    } else {
    	barColor = 'white';
    }
    colorRect(cornerX,cornerY,
    		  sprites.UI.healthBarEmpty.width,
			  sprites.UI.healthBarEmpty.height, 'grey');
    colorRect(cornerX,cornerY,healthBarWidth,
			  sprites.UI.healthBarEmpty.height, barColor);
  
	drawPixelfont("HP:",cornerX-17,cornerY-1); 
	canvasContext.globalAlpha=1.0;

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