var currentRoomCol = 0,currentRoomRow = 0, currentFloor = 1;
var lastValidCurrentRoomCol = 0,lastValidCurrentRoomRow = 0, lastValidCurrentFloor = 1;
var objectDictionary = {

}

function roomCoordToVar()
{
	roomName = roomCoordToString(currentRoomCol, currentRoomRow, currentFloor);
	console.log("Loading room from var named "+roomName);
	return allRoomsData[roomName];
}

function roomCoordToString(c, r,f) {
	return "room"+c + "" + String.fromCharCode(97+r) + "" + f;
}

function Room(roomLayout) {
	
	this.originalLayout = JSON.parse(JSON.stringify(roomLayout))
	this.layout = JSON.parse(JSON.stringify(this.originalLayout))
	this.enemyList = [];
	this.magic = [];
	this.itemOnGround = [];
	this.floorTraps = [];
	this.pathfindingdata = []; // 2d array of ints
	this.tempPathFindingData = []; // copy of 2d array of ints. 
	
	this.reset = function(){
		this.layout = JSON.parse(JSON.stringify(this.originalLayout))
		this.enemyList = [];
		this.itemOnGround = [];
		this.pathfindingdata = []; // a-star pathfinding grid
		this.tempPathFindingData = []; //a-star pathfinding grid with dynamic things like the player
		this.spawnItems();
		this.spawnTraps();
		this.spawnCharacters();
		this.spawnMyEnemies();
			
		if (_TEST_AI_PATHFINDING)
			this.generatePathfindingData();
				
	}

	this.spawnCharacters = function(){
		var item;

		for(var i in this.layout.layers){
			if(this.layout.layers[i].type == "objectgroup" && this.layout.layers[i].visible){
				for(var j in this.layout.layers[i].objects){
					item = this.layout.layers[i].objects[j]
					if(objectDictionary[item.gid]){
						if(!objectDictionary[item.gid].entityType){
							throw "Entity type for object " + item.gid + " not set!!"
						}
						var enemyConstructor = enemyDictionary[objectDictionary[item.gid].entityType]
						if(!enemyConstructor){
							throw "Entity constructor for object " + objectDictionary[item.gid].entityType + " not set!!"
						}
						this.enemyList.push(new enemyConstructor(item.x, item.y));
					} else {
						throw "could not find object in tileset: " + item.gid
					}
				}
			}
		}
	}

	this.spawnItems = function() {

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				var anItem = this.layout.layers[0].data[arrayIndex];//layer[0] has the data element in it
				if(anItem == TILE_AVACADO) {
					this.layout[arrayIndex] = TILE_EMPTY;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_AVACADO);
				} /*else if(anItem == TILE_KEY_RARE) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_RARE);
				} else if(anItem == TILE_KEY_EPIC) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_EPIC);
				} else if(anItem == TILE_CRYSTAL) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_CRYSTAL);
				} else if(anItem == TILE_HEART_CONTAINER) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_HEART_CONTAINER);
				} else if(anItem == TILE_ARTIFACT) {
					console.log("Adding an artifact in room()");
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_ARTIFACT);
				} else if(anItem == TILE_FIREBALL_LVL2) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_FIREBALL_LVL2);
				} else if(anItem == TILE_FIREBALL_LVL3) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_FIREBALL_LVL3);
				} else if(anItem == TILE_POTION) {
 					this.layout[arrayIndex] = TILE_GROUND;
 					var x = eachCol * WORLD_W + WORLD_W/2;
 					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_POTION);
				} // end of place item on tile*/
			} // end of col for
		} // end of row for
	} //end of spawn items

	this.generatePathfindingData = function() {
		console.log("Generating pathfinding data for the current room...");
		// the a-star pathfinding may not be able to handle
		// world arrays without same width and height?
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(var eachRow=0;eachRow<_rows;eachRow++) {
			this.pathfindingdata[eachRow] = [];
			this.tempPathFindingData[eachRow] = [];
			for(var eachCol=0;eachCol<_cols;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);				
				this.pathfindingdata[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
				this.tempPathFindingData[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
			}
		}
	}

	this.updatePathfindingData = function(){
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(var eachRow=0;eachRow<_rows;eachRow++) {			
			for(var eachCol=0;eachCol<_cols;eachCol++) {
				this.tempPathFindingData[eachRow][eachCol] = this.pathfindingdata[eachRow][eachCol]
			}
		}
		//Todo: add enemies to path data? 
		//TODO: should room.js know about player.js? 
		var playertile = getTileIndexAtPixelCoord(player.x, player.y);
		var playerrowcol = ArrayIndexToRowCol(playertile);
		this.tempPathFindingData[playerrowcol[0]][playerrowcol[1]] = 89
	}
	

	this.spawnTraps = function() {
		var nextTrap = null;
		var x, y;

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(this.layout[arrayIndex] == TILE_TRAP) {
					x = eachCol * WORLD_W + WORLD_W/2;
					y = eachRow * WORLD_H + WORLD_H/2; //monsters are currently too tall to put next to walls
					trapWasFound = true;
					nextTrap = new trap(x, y);
					this.floorTraps.push(nextTrap);
				} // end of player start if
			} // end of col for
		} // end of row for
	}

	this.spawnMyEnemies = function(){
		var nextEnemy = null;
		var x, y;
		var offsetX = -3
		var offsetY = -3;
		var enemyWasFound = false;
		do {
			enemyWasFound = false;
			for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
					x = eachCol * WORLD_W + WORLD_W/2 + offsetX;
					y = eachRow * WORLD_H + WORLD_H/2 + offsetY;

					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						 //monsters are currently too tall to put next to walls
						var enemyType = Math.random() * 4;
						if (enemyType > 2 && enemyType < 3){
							nextEnemy = new plantBaby(x, y);
						}else if (enemyType > 1 && enemyType < 2){
							nextEnemy = new slugMonster(x, y);
						} else if (enemyType > 3 && enemyType < 4){
							nextEnemy = new armsBro(x, y)
						} else {
							nextEnemy = new slimeMonster(x, y);
						}
						this.enemyList.push(nextEnemy);
						enemyWasFound = true;
						break;
					} else {
						switch (this.layout[arrayIndex]){
							case TILE_BOSSHERO:
								this.layout[arrayIndex] = TILE_GROUND;
					            nextEnemy = new heroBoss(x, y);
					            this.enemyList.push(nextEnemy);
								enemyWasFound = true;
					            break;
						}
					}
					
				} // end of col for
			}
		} while (enemyWasFound)
	}
	this.drawMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].draw();
		}
	}

	this.drawMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].draw();
		}
	}

	this.drawTraps = function() {
		for (var i = 0; i < this.floorTraps.length; i++) {
			var trap = this.floorTraps[i];
			trap.update();
			trap.draw();
		}
	}

	this.drawDynamic = function() {
		var objects = [];
		for(var i = 0; i<this.enemyList.length; i++){
			objects.push({"y":this.enemyList[i].y , "object": this.enemyList[i]});
		}
		for(var i = 0; i<this.magic.length; i++){
			objects.push({"y":this.magic[i].y , "object": this.magic[i]});
		}
		objects.push({"y":player.y, "object": player});

		objects.sort(function(a, b) {
			return a.y-b.y;
		});

		for(var i = 0; i<objects.length; i++){
			objects[i].object.draw();
		}
	}

	this.moveMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].update();
		}
	}

	this.moveMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].update();
		}
	}
	this.considerRoomChange = function () {

		// if (player.x < 8) {
		// 	currentRoomCol--;
		// 	//Sound.play("room_change",false,0.05);
		// 	loadLevel();
		// 	player.x += (canvas.width-40);
		// }
		// else if (player.x > canvas.width - 8){
		// 	currentRoomCol++;
		// 	//Sound.play("room_change",false,0.05);
		// 	loadLevel();
		// 	player.x -= (canvas.width-40);
		// }
		// if (player.y < 8){
		// 	currentRoomRow--;
		// 	//Sound.play("room_change",false,0.05);
		// 	loadLevel();
		// 	player.y += (canvas.height-40);
		// }
		// else if (player.y > canvas.height - 8){
		// 	currentRoomRow++;
		// 	//Sound.play("room_change",false,0.05);
		// 	loadLevel();
		// 	player.y -= (canvas.height-40);
		// }
		
		if (lastValidCurrentFloor != currentFloor) {
			console.log("considerRoomChange just noticed a floor change...")
			if ((currentFloor-lastValidCurrentFloor) == 1) { //Going up
				player.x += 30; //Offset for stairs
			} else if 
				((currentFloor-lastValidCurrentFloor) == -1 &&
				worldGrid[getTileIndexAtPixelCoord(player.x, player.y) - 1] == TILE_STAIRS_DOWN) 
				{ //Going down
				player.x -= 30; //Offset for stairs
			}
			//Sound.play("room_change",false,0.1);
			loadLevel();
		}
	}
};

var room0a1 = TileMaps['example'];

var allRooms = [
	room0a1, ];
var roomCols = 4; //maximum col of rooms
var roomRows = 6; // maximum row of rooms
var roomFloors = 4; // maximum floor of rooms
var allRoomsData = {};
var allRoomsBackup = [];
var currentRoom = null;

function backupRoomData () {
	console.log("calling backupRoomData")
	allRoomsBackup = JSON.parse(JSON.stringify(allRooms));
}

function restoreRoomDataBackup() {
	console.log("calling restoreRoomDataBackup")
	allRooms = JSON.parse(JSON.stringify(allRoomsBackup));
	resetAllRooms();
	console.log("room reset");
}
function initRoomData(){
	for (var c = 0; c<roomCols; c++) {
		for ( var r =0; r<roomRows; r++) {
			for (var f=0; f<roomFloors; f++) {
				var eachRoom = roomCoordToString(c,r,f);
				if (window[eachRoom] != undefined) {
					console.log("room found");
					var tempRoom = new Room (window[eachRoom]);					
					allRoomsData[eachRoom] = tempRoom;
				}
			}
		}
	}
}
function resetAllRooms(){
	allRoomsData = {};
	for (var c = 0; c<roomCols; c++) {
		for ( var r =0; r<roomRows; r++) {
			for (var f=0; f<roomFloors; f++) {
				var eachRoom = roomCoordToString(c,r,f);
				if (window[eachRoom] != undefined) {
					console.log("room found");
					var tempRoom = new Room (window[eachRoom]);
					tempRoom.reset();
					allRoomsData[eachRoom] = tempRoom;
				}
			}
		}
	}
	loadLevel();
}
