var currentRoomCol = 0,currentRoomRow = 0, currentFloor = 1;
var lastValidCurrentRoomCol = 0,lastValidCurrentRoomRow = 0, lastValidCurrentFloor = 1;
const objectDictionary = {};

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
	this.objectList = [];
	this.magic = [];
	this.itemOnGround = [];
	this.floorTraps = [];
	this.pathfindingdata = []; // 2d array of ints
	this.tempPathFindingData = []; // copy of 2d array of ints.

	this.reset = function() {
		this.layout = JSON.parse(JSON.stringify(this.originalLayout))
		this.enemyList = [];
		this.objectList = [];
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

	this.spawnCharacters = function() {
		var item;

		for(let i in this.layout.layers) {
			if(this.layout.layers[i].type == "objectgroup" && this.layout.layers[i].visible) {
				for(let j in this.layout.layers[i].objects) {
					item = this.layout.layers[i].objects[j]
					if(objectDictionary[item.gid]) {
						if(!objectDictionary[item.gid].entityType) {
							throw "Entity type for object " + item.gid + " not set!!"
						}
						const aType = objectDictionary[item.gid].entityType;
						var enemyConstructor = enemyDictionary[aType];
						if(!enemyConstructor) {
							throw "Entity constructor for object " + objectDictionary[item.gid].entityType + " not set!!"
						}

						if((aType == "fButton") || (aType == "Door")) {
							var newEnemy = new enemyConstructor(item.x, item.y)
							newEnemy.mapData = item.properties
							newEnemy.type = aType;
							newEnemy.name = item.name;
							this.objectList.push(newEnemy);
						} else {
							this.enemyList.push(new enemyConstructor(item.x, item.y));
						}
					} else if(item.gid == 101) {
						//yo this is just a placement object for the player
					} else {
						throw "could not find object in tileset: " + item.gid
					}
				}
			}
		}
	}

	this.spawnItems = function() {
		for(let eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(let eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				var anItem = this.layout.layers[0].data[arrayIndex];//layer[0] has the data element in it

				if (anItem == TILE_AVOCADO && !inventoryItems[ITEM_AVOCADO].itemObtained) {
					this.layout.layers[0].data[arrayIndex] = TILE_TRANSPARENT;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_AVOCADO);

				} else if (anItem == TILE_AVOCADO && inventoryItems[ITEM_AVOCADO].itemObtained) {
					this.layout.layers[0].data[arrayIndex] = TILE_TRANSPARENT;
				}
      }
		}
	}

	this.generatePathfindingData = function() {
		console.log("Generating pathfinding data for the current room...");
		// the a-star pathfinding may not be able to handle
		// world arrays without same width and height?
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(let eachRow=0;eachRow<_rows;eachRow++) {
			this.pathfindingdata[eachRow] = [];
			this.tempPathFindingData[eachRow] = [];
			for(let eachCol=0;eachCol<_cols;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				this.pathfindingdata[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
				this.tempPathFindingData[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
			}
		}
	}

	this.updatePathfindingData = function() {
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(var eachRow=0;eachRow<_rows;eachRow++) {
			for(let eachCol=0;eachCol<_cols;eachCol++) {
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
		return;
	}

	this.spawnMyEnemies = function() {
		var nextEnemy = null;
		var x, y;
		var offsetX = -3
		var offsetY = -3;
		var enemyWasFound = false;
		do {
			enemyWasFound = false;
			for(let eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(let eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
					x = eachCol * WORLD_W + WORLD_W/2 + offsetX;
					y = eachRow * WORLD_H + WORLD_H/2 + offsetY;

					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						 //monsters are currently too tall to put next to walls
						var enemyType = Math.random() * 4;
						if (enemyType > 2 && enemyType < 3) {
							nextEnemy = new plantBaby(x, y);
						} else if (enemyType > 1 && enemyType < 2) {
							nextEnemy = new slugMonster(x, y);
						} else if (enemyType > 3 && enemyType < 4) {
							nextEnemy = new armsBro(x, y)
						} else {
							nextEnemy = new slimeMonster(x, y);
						}
						this.enemyList.push(nextEnemy);
						enemyWasFound = true;
						break;
					} else {
						switch (this.layout[arrayIndex]) {
							case TILE_BOSSHERO:
								this.layout[arrayIndex] = TILE_GROUND;
					            nextEnemy = new heroBoss(x, y);
					            this.enemyList.push(nextEnemy);
								enemyWasFound = true;
					            break;
						}
					}

				}
			}
		} while (enemyWasFound)
	}

	this.drawMyObjects = function() {
		for(let i = 0; i < this.objectList.length; i++) {
			this.objectList[i].draw();
		}
	}

	this.drawMagic = function() {
		for(let i = 0; i < this.magic.length; i++) {
			this.magic[i].draw();
		}
	}

	this.drawTraps = function() {
		for (let i = 0; i < this.floorTraps.length; i++) {
			var trap = this.floorTraps[i];
			trap.update();
			trap.draw();
		}
	}

	this.drawDynamic = function() {
		const objects = [];
		for(let i = 0; i < this.enemyList.length; i++) {
			objects.push({"y": this.enemyList[i].y , "object": this.enemyList[i]});
		}
		for(let i = 0; i < this.magic.length; i++) {
			objects.push({"y": this.magic[i].y , "object": this.magic[i]});
		}
		objects.push({"y": player.y, "object": player});

		objects.sort(function(a, b) {
			return a.y-b.y;
		});

    	for(var i = 0; i<objects.length; i++){
			objects[i].object.draw();
		}
	}

	this.moveMyEnemies = function() {
		for(let i = 0; i < this.enemyList.length; i++) {
			this.enemyList[i].update();
		}
	}

	this.moveMyObjects = function() {
		for(let i = 0; i < currentRoom.objectList.length; i++) {
			if(currentRoom.objectList[i].update != null) {
				currentRoom.objectList[i].update();
			}
		}
	}

	this.moveMagic = function() {
    this.magic.forEach(m => m.update());
	}

	this.considerRoomChange = function () {
		if (lastValidCurrentFloor != currentFloor) {
			console.log("considerRoomChange just noticed a floor change...")

			if ((currentFloor - lastValidCurrentFloor) == 1) { //Going up
				player.x += 30; //Offset for stairs
			} else if (
        (currentFloor-lastValidCurrentFloor) == -1 &&
				worldGrid[getTileIndexAtPixelCoord(player.x, player.y) - 1] == TILE_STAIRS_DOWN) { //Going down

				player.x -= 30; //Offset for stairs
			}
			//Sound.play("room_change",false,0.1);
			loadLevel();
		}
	}
};

//TODO: get initRoomData to work off TiledMaps[] instead of allRooms[]
var room0a1 = TileMaps['Level1'];
var room1a1 = TileMaps['Level2'];
var room2a1 = TileMaps['level3'];

//iff adding new rooms, remember to add to all rooms
const allRooms = [
	room0a1,
  room1a1,
  room2a1
];
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

function initRoomData() {
	for (let c = 0; c < roomCols; c++) {
		for (let r = 0; r < roomRows; r++) {
			for (let f = 0; f < roomFloors; f++) {
				var eachRoom = roomCoordToString(c,r,f);
				if (window[eachRoom] != undefined) {
					console.log("room found");
					allRoomsData[eachRoom] = new Room (window[eachRoom]);
				}
			}
		}
	}

	for(let i in TileMaps) {
		if (TileMaps[i] != undefined) {
			console.log("TileMaps room found");
			allRoomsData[i] = new Room (TileMaps[i]);
		}
	}
}

function resetAllRooms() {
	allRoomsData = {};
	for (let c = 0; c < roomCols; c++) {
		for (let r = 0; r < roomRows; r++) {
			for (let f = 0; f < roomFloors; f++) {
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

	for(let i in TileMaps) {
		if (TileMaps[i] != undefined) {
			console.log("TileMaps room found");
			var tempRoom = new Room (TileMaps[i]);
			tempRoom.reset();
			allRoomsData[i] = tempRoom;
		}
	}
	console.log("Rooms is reloading the level");
	loadLevel();
}
