function desecrate(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	this.canRaycast = true;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.Desecrate.Ball;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 200;
	this.spriteSpeed = 13;
	this.speed = 3

	this.raycasting = function() {
	var nextTileX = this.x;
	var nextTileY = this.y;
	isGround = true;
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
			this.y -= 16;
			this.attackDir = [0,-1];
			this.obstacle = this.raycasting();
			this.obstacle.y -= WORLD_H;
			console.log(obstacle);
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			this.obstacle = this.raycasting();
			console.log(obstacle);
			break;
		case EAST:
			this.x += 13;
			this.attackDir = [2,0];
			this.obstacle = this.raycasting();
			console.log(obstacle);
			break;
		case WEST:
			this.x -= 25;
			this.attackDir = [-2,0];
			this.obstacle = this.raycasting();
			this.obstacle.x += WORLD_W;
			console.log(obstacle);		
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
		if (enemy.currentHealth <= 0) {
			isPoisoned = false;
			enemy.reset("Untitled Player");
			resetAllRooms();
			Sound.play("player_die");
		}
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	this.lifetime = 200
	var spell = new magicClass(this, [player]);

	spell.update = function() {
		this.pastX = this.x;
		this.pastY = this.y;
		this.doesSpellHitTile();
		if( this.remove){
			var index = currentRoom.magic.indexOf(this);
			if(index !== -1) {
				currentRoom.magic.splice(index, 1);
				console.log("attack removed")
				return;
			}
		}
		this.x += this.attackDir[0]*this.speed;
		this.y += this.attackDir[1]*this.speed;
		var frame = this.sprite.getFrame();
		if(this.attackFrames[frame]){
			this.collider.offsetX = this.attackFrames[frame].x1;
			this.collider.offsetY = this.attackFrames[frame].y1;
			this.collider.width = this.attackFrames[frame].x2;
			this.collider.height = this.attackFrames[frame].y2;
			this.hitEnemy();
		} else {
			this.collider.offsetX = 0;
			this.collider.offsetY = 0;
			this.collider.width = 0;
			this.collider.height = 0;
		}
		this.collider.setCollider(this.x, this.y);
		this.sprite.update();
		if (typeof this.lifetime == "number") {
			this.lifetime--;
			if (this.lifetime == 180) {
				this.sprite.setSprite(sprites.Desecrate.Splash,
					32, 32,
					4, 9, true);
				this.speed = 0;
			}
			if(this.lifetime == 160){
				this.sprite.setSprite(sprites.Desecrate.Spill,
					32, 32,
					4, 9, true);
			}
			if (this.lifetime < 0) {
				this.remove = true;
			}
		}
	}

	return spell;
}