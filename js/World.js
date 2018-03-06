const WORLD_W = 20;
const WORLD_H = 20;
const WORLD_GAP = 0;
const WORLD_COLS = 60;
const WORLD_ROWS = 34;
const WORLD_MAX_Y = WORLD_ROWS * WORLD_H; // player.die if we fall too far

//rooms are defined now in rooms.js
var worldGrid = [];

const TILE_TRANSPARENT = 0;
const TILE_EMPTY = 1;
const TILE_WALL = 2;
const TILE_AVOCADO = 3;
/*const TILE_PLAYERSTART = 2;
const TILE_SKULL = 3;*/
//const TILE_KEY_COMMON = 4;
const TILE_DOOR_COMMON = 5;
const TILE_ENEMYSTART = 6;
const TILE_TRAP = 7;
const TILE_CHAIN = 8;
const TILE_OOZE = 9;
const TILE_WEB = 10;
const TILE_BOX = 11;
const TILE_KEY_RARE = 12;
const TILE_KEY_EPIC = 13;
const TILE_DOOR_RARE = 14;
const TILE_DOOR_EPIC = 15;
const TILE_CRYSTAL = 16;
const TILE_STAIRS_UP = 17;
const TILE_WALL_SOUTH = 18;
const TILE_WALL_NORTH = 19;
const TILE_WALL_WEST = 20;
const TILE_WALL_EAST = 21;
const TILE_WALL_CORNER_SW = 22;
const TILE_WALL_CORNER_SE = 23;
const TILE_WALL_CORNER_NW = 24;
const TILE_WALL_CORNER_NE = 25;
const TILE_ROOM_DOOR_NORTH = 26;
const TILE_ROOM_DOOR_SOUTH = 27;
const TILE_ROOM_DOOR_EAST = 28;
const TILE_ROOM_DOOR_WEST = 29;
const TILE_STAIRS_DOWN = 30;
const TILE_NOTHING = 31;

const TILE_WALL_OUTCORNER_SW = 32;
const TILE_WALL_OUTCORNER_SE = 33;
const TILE_WALL_OUTCORNER_NW = 34;
const TILE_WALL_OUTCORNER_NE = 35;
const TILE_WALL_SOUTH_TORCH = 36;
const TILE_WALL_NORTH_TORCH = 37;
const TILE_WALL_WEST_TORCH = 38;
const TILE_WALL_EAST_TORCH = 39;

const TILE_SMALL_WALL_HORIZ = 40;
const TILE_SMALL_WALL_VERT = 41;
const TILE_SMALL_WALL_PILLAR = 42;
const TILE_SMALL_WALL_NE = 43;
const TILE_SMALL_WALL_NW = 44;
const TILE_SMALL_WALL_SE = 45;
const TILE_SMALL_WALL_SW = 46;
const TILE_SMALL_WALL_CAP_EAST = 47;
const TILE_SMALL_WALL_CAP_WEST = 48;
const TILE_SMALL_WALL_CAP_NORTH = 49;
const TILE_SMALL_WALL_CAP_SOUTH = 50;
const TILE_SMALL_WALL_INTO_BIG_EAST = 51;
const TILE_SMALL_WALL_INTO_BIG_WEST = 52;
const TILE_SMALL_WALL_INTO_BIG_SOUTH = 53;
const TILE_SMALL_WALL_INTO_BIG_NORTH = 54;


const TILE_HEART_CONTAINER = 55;
const TILE_ARTIFACT = 56;
const TILE_BOSSHERO = 57;

const TILE_FIREBALL_LVL2 = 58;
const TILE_FIREBALL_LVL3 = 59;

const TILE_PIT_HORIZONTAL_TOP = 60;
const TILE_TOP_LEFT_PIT_CORNER = 61;
const TILE_TOP_RIGHT_PIT_CORNER = 62;

const TILE_BOSSPJ = 63;
const TILE_SLIME = 64;
const TILE_SLUGBRO = 65;
const TILE_PLANTBABY = 66;
const TILE_ARMSBRO = 67;
const TILE_GOBO = 68;
const TILE_POTION = 69;

const TILE_DOOR_SWITCH = 70;

const HIGHEST_TILE_NUMBER = 3;

var tileArray = [];

function createTileArray() {
	for(var tileIndex = 0; tileIndex < HIGHEST_TILE_NUMBER+1; tileIndex++) {
		tileArray.push(tileIndex);
	}
}

function returnTileTypeAtColRow(col, row) {
	if(col >= 0 && col < WORLD_COLS &&
		row >= 0 && row < WORLD_ROWS) {
		 var worldIndexUnderCoord = rowColToArrayIndex(col, row);
		 return worldGrid[worldIndexUnderCoord];
	} else {
		return TILE_WALL;
	}
}

function getTileIndexAtPixelCoord(atX, atY) {
	var playerWorldCol = Math.floor(atX / WORLD_W);
	var playerWorldRow = Math.floor(atY / WORLD_H);
	var worldIndexUnderPlayer = rowColToArrayIndex(playerWorldCol, playerWorldRow);

	if(playerWorldCol >= 0 && playerWorldCol < WORLD_COLS &&
		playerWorldRow >= 0 && playerWorldRow < WORLD_ROWS) {
		return worldIndexUnderPlayer;
	} // end of valid col and row

	return undefined;
} // end of playerWorldHandling func

function rowColToArrayIndex(col, row) {
	return col + WORLD_COLS * row;
}

function ArrayIndexToRowCol(index) { // is this correct? FIXME
	return [Math.floor(index / WORLD_ROWS), index % WORLD_COLS];
}

function ArrayIndexToColRow(index) { // is this correct? FIXME
	return [index % WORLD_COLS,Math.floor(index / WORLD_COLS)];
}

function canWalk(tileType){
	var returnValue = 1;
	switch(tileType){
		case TILE_KEY_COMMON:
		case TILE_ENEMYSTART:
		case TILE_CHAIN:
		case TILE_OOZE:
		case TILE_WEB:
		case TILE_KEY_RARE:
		case TILE_KEY_EPIC:
		case TILE_CRYSTAL:
		case TILE_FIREBALL_LVL2:
		case TILE_FIREBALL_LVL3:
		case TILE_GROUND:
		case TILE_POTION:
		case TILE_SKULL:
		case TILE_AVOCADO:
			returnValue = 0;
			break
		default: 
    		// Default case
    		returnValue = tileType;
    		break;
	}
	//not immediately returning because might include path speeds in this value later
	return returnValue;
}
function tileTypeHasTransparency(checkTileType) {
	return (
			checkTileType == TILE_DOOR_COMMON ||
			checkTileType == TILE_ENEMYSTART ||
			checkTileType == TILE_CHAIN ||
			checkTileType == TILE_OOZE ||
			checkTileType == TILE_WEB ||
			checkTileType == TILE_KEY_RARE ||
			checkTileType == TILE_KEY_EPIC ||
			checkTileType == TILE_CRYSTAL ||
			checkTileType == TILE_STAIRS_UP ||
			checkTileType == TILE_STAIRS_DOWN ||
			checkTileType == TILE_BOX ||
			checkTileType == TILE_DOOR_EPIC ||
			checkTileType == TILE_DOOR_RARE ||
			checkTileType == TILE_ROOM_DOOR_NORTH ||
			checkTileType == TILE_ROOM_DOOR_SOUTH ||
			checkTileType == TILE_ROOM_DOOR_EAST ||
			checkTileType == TILE_ROOM_DOOR_WEST ||
			checkTileType == TILE_WALL_OUTCORNER_SW ||
			checkTileType == TILE_WALL_OUTCORNER_SE ||
			checkTileType == TILE_WALL_OUTCORNER_NW ||
			checkTileType == TILE_WALL_OUTCORNER_NE ||
			checkTileType == TILE_SMALL_WALL_PILLAR ||
			checkTileType == TILE_SMALL_WALL_NE ||
			checkTileType == TILE_SMALL_WALL_NW ||
			checkTileType == TILE_SMALL_WALL_SE ||
			checkTileType == TILE_SMALL_WALL_SW ||
			checkTileType == TILE_SMALL_WALL_CAP_EAST ||
			checkTileType == TILE_SMALL_WALL_CAP_WEST ||
			checkTileType == TILE_SMALL_WALL_CAP_NORTH ||
			checkTileType == TILE_SMALL_WALL_CAP_SOUTH ||
			checkTileType == TILE_HEART_CONTAINER ||
			checkTileType == TILE_ARTIFACT || 
			checkTileType == TILE_BOSSHERO ||
			checkTileType == TILE_BOSSPJ ||
			checkTileType == TILE_FIREBALL_LVL2 ||
			checkTileType == TILE_FIREBALL_LVL3 ||
			checkTileType == TILE_POTION ||
			checkTileType == TILE_SLIME ||
			checkTileType == TILE_SLUGBRO ||
			checkTileType == TILE_PLANTBABY ||
			checkTileType == TILE_ARMSBRO ||
			checkTileType == TILE_GOBO ||
			checkTileType == TILE_AVOCADO
					);
}

function drawWorld() {

	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;
	for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
			var tileKindHere = worldGrid[arrayIndex];
			var useImg = worldPics[tileKindHere];

			if( tileTypeHasTransparency(tileKindHere) ) {
				canvasContext.drawImage(worldPics[TILE_EMPTY],drawTileX,drawTileY);
			}

			canvasContext.drawImage(useImg,drawTileX,drawTileY);
			// colorText(arrayIndex, drawTileX, drawTileY+12, 'white');

			// add world tile effects for torches etc
			if (tileKindHere==TILE_WALL_NORTH_TORCH)
				particle.push(new particleClass(drawTileX+11,drawTileY+10,'rgba(255,255,0,0.5)',Math.random()*1-0.5,Math.random()*-1,0.25,0));
			if (tileKindHere==TILE_WALL_SOUTH_TORCH)
				particle.push(new particleClass(drawTileX+9,drawTileY+10,'rgba(255,255,0,0.5)',Math.random()*1-0.5,Math.random()*1,0.25,0));
			if (tileKindHere==TILE_WALL_EAST_TORCH)
				particle.push(new particleClass(drawTileX+10,drawTileY+11,'rgba(255,255,0,0.5)',Math.random()*1,Math.random()*1-0.5,0.25,0));
			if (tileKindHere==TILE_WALL_WEST_TORCH)
				particle.push(new particleClass(drawTileX+10,drawTileY+9,'rgba(255,255,0,0.5)',Math.random()*-1,Math.random()*1-0.5,0.25,0));
			
			drawTileX += WORLD_W;
			arrayIndex++;
		} // end of for each col
		drawTileY += WORLD_H;
		drawTileX = 0;
	} // end of for each row
} // end of drawWorld func
