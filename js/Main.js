var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;
const MUSIC_VOLUME = 0.17; // 0=none 1=loud

var player = new playerClass();

var particleList = [];

var paused = false;

var cameraOffsetX = 0;
var cameraOffsetY = 0;

var healthBarFlashing = false;
var barColorRed = true;

// temp vars for testing NPC text pixelFont animation in drawAll() function
var npcTextAnimationExample = "Animated NPC text\nfinally $blue works! Cool.";
var npcTextAnimationStart = 0; // timestamp in ms like performance.now() would return
var npcTextAnimationEnd = 0; // how long the text should animate for in ms (1000=1sec)
// strings can be measured in pixels for centering etc
var npcTextXOffset = -1 * Math.round(pixelfont_measure(npcTextAnimationExample)/2) + 10;
var npcTextYOffset = -36; // pixels above npc

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
		//Sound.stop("mage_hook_chiptune_menu_melody");
		//Sound.play("MageHookThemeSong",true,MUSIC_VOLUME);

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
		drawInventory();
		drawInventoryItems();
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
	currentRoom.moveMagic();
	updateItems();
	updateParticles();
	updatePanel(debugPanel);
	//console.log(player.x);
	//console.log(player.y);
}

var totalXTranslation = 0;
const deadXZone = 25;
var totalYTranslation = 0;
//const deadYZone = 50;

function drawAll() {
	
	if(player.x > ((2 * deadXZone) + totalXTranslation + (canvas.width / 2))) {
		totalXTranslation += 3;
		cameraOffsetX -= 3;
	} else if(player.x > (deadXZone + totalXTranslation + (canvas.width / 2))) {
		totalXTranslation++;
		cameraOffsetX -= 1;
	} else if(player.x < ((-2 * deadXZone) + totalXTranslation + (canvas.width / 2))) {
		totalXTranslation  -= 3;		
		cameraOffsetX += 3;
	} else if(player.x < (-deadXZone + totalXTranslation + (canvas.width / 2))) {
		totalXTranslation--;		
		cameraOffsetX += 1;
	}
	
	if (totalXTranslation < 0) {
		cameraOffsetX = 0;
	} else if (totalXTranslation > ((WORLD_COLS * WORLD_W) - canvas.width)) {
		cameraOffsetX = -((WORLD_COLS * WORLD_W) - canvas.width);
	}
	
	if(player.y > (totalYTranslation + canvas.height - 32)) {
		totalYTranslation++;
		cameraOffsetY -= 1;
	} else if(player.y < (totalYTranslation + 32)) {
		totalYTranslation--;
		cameraOffsetY += 1;
	}
	if (totalYTranslation < 0) {
		cameraOffsetY = 0;
	} else if (totalYTranslation > ((WORLD_ROWS * WORLD_H) - canvas.height)) {
		cameraOffsetY = -((WORLD_ROWS * WORLD_H) - canvas.height);
	}

	canvasContext.save();
	clearCanvas();

	canvasContext.translate(cameraOffsetX, cameraOffsetY);
	
	
	//TODO: remove
	

	drawWorld();
	currentRoom.drawTraps();
	drawItems();
	//canvasContext.drawImage(sprites.Concept.background1, 0,0);
	currentRoom.drawDynamic();
	drawHealth();
	drawParticles();
	
	drawPanelWithButtons(debugPanel);	

	// pixelart spritesheet text rendering using img/UI/pixelFont.png woo hoo
	pixelfont_draw("pixelFont.js is finally working! Yay!",75,34)

	// test NPC dialog animation every three seconds
	if (npcTextAnimationEnd + 3000 < performance.now()) {
		npcTextAnimationStart = performance.now();
		npcTextAnimationEnd = npcTextAnimationStart + 3000;
	}
	
	npc_text(npcTextAnimationExample, // animate this string
		player.x+npcTextXOffset,player.y+npcTextYOffset, // here
		npcTextAnimationStart,npcTextAnimationEnd); // over this timespan

	canvasContext.restore();
}

function drawHealth() {
	var healthBarFlashTimer = 0;
	var posX = 10;
	var posY = canvas.height - posX;
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
    canvasContext.drawImage(sprites.UI.healthBarEmpty, cornerX,cornerY);
    if (barColorRed) {
    	barColor = 'red';
    } else {
    	barColor = 'white';
    }
    colorRect(cornerX,cornerY,healthBarWidth,
    		  sprites.UI.healthBarEmpty.height, barColor);
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