const BONE_SPLATTER_SPEED = 0.5;

function pew(x, y, isFacing) {
	// Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	this.canRaycast = true;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.pew.pewpew
	this.spriteWidth = 20;
	this.spriteHeight = 20;
	this.spriteFrames = 12;
	this.spriteSpeed = 13;
	this.speed = 2;
	this.attackDir = [0,0];

	this.raycasting = function() {
	var nextTileX = this.x;
	var nextTileY = this.y;
	var isGround = true;
	var tileSearchSpeed = 1;
		while (isGround) {
			if (this.attackDir[1] < 0) { // NORTH
				nextTileY -= tileSearchSpeed; 
			} else if (this.attackDir[1] > 0) { // SOUTH
				nextTileY += tileSearchSpeed;
			} else if (this.attackDir[0] > 0) { // EAST
				nextTileX += tileSearchSpeed;
			} else if (this.attackDir[0] < 0) { // WEST
				nextTileX -= tileSearchSpeed;
			}
			var obstacleTiles = [TILE_WALL,TILE_DOOR_COMMON,TILE_BOX,TILE_DOOR_RARE,
								 TILE_DOOR_EPIC,TILE_STAIRS_UP,TILE_WALL_SOUTH,TILE_WALL_NORTH,
								 TILE_WALL_WEST,TILE_WALL_EAST,TILE_WALL_CORNER_SW,TILE_WALL_CORNER_SE,
								 TILE_WALL_CORNER_NW,TILE_WALL_CORNER_NE,TILE_ROOM_DOOR_NORTH,
								 TILE_ROOM_DOOR_SOUTH,TILE_ROOM_DOOR_EAST,TILE_ROOM_DOOR_WEST,
								 TILE_NOTHING,TILE_WALL_OUTCORNER_SW,TILE_WALL_OUTCORNER_SE,
								 TILE_WALL_OUTCORNER_NW,TILE_WALL_OUTCORNER_NE,TILE_WALL_SOUTH_TORCH,
								 TILE_WALL_NORTH_TORCH,TILE_WALL_WEST_TORCH,TILE_WALL_EAST_TORCH,
								 TILE_SMALL_WALL_HORIZ,TILE_SMALL_WALL_VERT,TILE_SMALL_WALL_PILLAR,
								 TILE_SMALL_WALL_NE,TILE_SMALL_WALL_NW,TILE_SMALL_WALL_SE,
								 TILE_SMALL_WALL_SW,TILE_SMALL_WALL_CAP_EAST,TILE_SMALL_WALL_CAP_WEST,
								 TILE_SMALL_WALL_CAP_NORTH,TILE_SMALL_WALL_CAP_SOUTH,TILE_SMALL_WALL_INTO_BIG_EAST,
								 TILE_SMALL_WALL_INTO_BIG_WEST,TILE_SMALL_WALL_INTO_BIG_SOUTH,
								 TILE_SMALL_WALL_INTO_BIG_NORTH];
			tileIndex = getTileIndexAtPixelCoord(nextTileX, nextTileY);
			if ((obstacleTiles.indexOf(worldGrid[tileIndex])) > -1) {
				return calculateTopLeftCoordOfTileIndex(tileIndex);
				break;
			}
		}
	}

	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.x -= 6;
			this.y -= 6;
			this.attackDir = [0,-1];
			this.obstacle = this.raycasting();
			this.obstacle.y += WORLD_H;
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			this.obstacle = this.raycasting();
			break;
		case EAST:
			this.x += 30;
			this.attackDir = [2,0];
			this.obstacle = this.raycasting();
			break;
		case WEST:
			this.x -= 10;
			this.attackDir = [-2,0];
			this.obstacle = this.raycasting();
			this.obstacle.x += WORLD_W;		
			break;
	}

	this.tileHit = function() {
		var angle = Math.atan2(this.y,this.x);					
		var vx = Math.cos(angle) * BONE_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BONE_SPLATTER_SPEED;
						
		particleFX(this.x,this.y,PARTICLES_PER_ENEMY_HIT,'white',vx,vy,0.5,0,1);
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		this.remove = true;
		enemy.getHit(1);
		//Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this, [player]);
}