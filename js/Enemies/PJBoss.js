function PJBoss(x, y) {

	this.x = x;
	this.y = y;
	this.initialState = "bossIntro";
	this.maxHealth = 80; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.PJDemon.WalkSouth;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = 1;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {
		normal : function(){
			if(this.maxHealth != this.currentHealth){
				if( Math.abs(this.y - player.y) < 20 ){
					//this.setState("munch")
					return;
				}
				if( Math.abs(this.x - player.x) < 20){
					//this.setState("munch")
					return;
				}
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(sprites.PJDemon.Idle, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, true);

			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		derpAround : function(){

			var willWander = Math.random() * 7;
			if(willWander < 1){
				this.setState("wander")
			} else if (willWander < 2) {
				this.setState("normal")
			}else if (willWander < 3) {
				this.setState("fireBall")
			}else if (willWander < 4 && currentRoom.enemyList.length < 9){
				this.setState("summon")
			}else {
				this.setState("desecrate")
			}
		},
		teleport : function(){
			if(!this.ticksInState){
				if(Math.random() < .5){
					this.sprite.setSprite(sprites.PJDemon.dodgeRoll, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					8, this.enemyData.spriteSpeed, false);
					this.velX = 2;
				} else {
					this.sprite.setSprite(sprites.PJDemon.dodgeRollLeft, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					8, this.enemyData.spriteSpeed, false);
					this.velX = -2;
				}
				
				this.velY = 0;
			}
			if(this.sprite.isDone()){
				this.setState("derpAround");
				return;
			}
			//maaake the boss invincible for a biit
			if(this.ticksInState == 400){
				this.setState("derpAround");
				return;
			}
			
			this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		fireBall: function(){
			if(!this.ticksInState){		
				this.sprite.setSprite(sprites.PJDemon["Hearts on Fire"], //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				8, 9, true);
				
				
			}
			if(this.ticksInState == 45){
				this.sprite.setSprite(sprites.PJDemon["Throw magic"], //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				8, 9, true);
				
			}
			
			if(this.ticksInState > 45 && this.ticksInState % 10 == 0){
				this.velX = 2;
				boneThrow(this.x, this.y, SOUTH)
			}


			if(this.ticksInState == 150){
				this.setState("derpAround");
				return;
			}
			this.sprite.update();
		},
		summon: function(){			
			if(!this.ticksInState){		
				this.sprite.setSprite(sprites.PJDemon.Chant, //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				8, 9, true);
				this.velX = 2;
				
			}
			if(this.ticksInState == 45){
				this.sprite.setSprite(sprites.PJDemon.Summon, //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				8, 9, true);
				
			}
			if(this.ticksInState == 55){
				var nextEnemy = new armsBro(this.x +30, this.y + 30);
				currentRoom.enemyList.push(nextEnemy);
				var nextEnemy = new armsBro(this.x -30, this.y + 30);
				currentRoom.enemyList.push(nextEnemy);
				// var nextEnemy = new armsBro(this.x -30, this.y - 30);
				// currentRoom.enemyList.push(nextEnemy);
				// var nextEnemy = new armsBro(this.x +30, this.y - 30);
				// currentRoom.enemyList.push(nextEnemy);
			}
			if(this.sprite.getSpriteSheet() == sprites.PJDemon.Summon && this.sprite.isDone()){
				this.setState("wander");
				return;
			}
			this.sprite.update();
		},
		desecrate: function(){
			if(!this.ticksInState){		
				this.sprite.setSprite(sprites.PJDemon.Alchemist, //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				8, 6, false);
				this.velX = 2;
				
			}
			
			if(this.sprite.isDone()){
				this.setState("derpAround");
				this.velX = 2;
				desecrate(this.x, this.y, SOUTH)
				return;
			}
			this.sprite.update();
		},
		wander : function(){

			if(!this.ticksInState){
				directionTimer = minMoveTime //+ Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				this.velX = Math.cos(angle) * speed;
				this.velY = Math.sin(angle) * speed;
				// this.sprite.setSprite(this.enemyData.spriteSheet,
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(Math.abs(this.velX) > Math.abs(this.velY)){
					if(this.velX > 0 && this.sprite.getSpriteSheet() != sprites.PJDemon.WalkRight){
						this.sprite.setSprite(sprites.PJDemon.WalkRight,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							8, this.enemyData.spriteSpeed, true);	
					}else if (this.velX < 0 && this.sprite.getSpriteSheet() != sprites.PJDemon.WalkLeft){						
						this.sprite.setSprite(sprites.PJDemon.WalkLeft,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				} else {
					if(this.velY > 0 && this.sprite.getSpriteSheet() != sprites.PJDemon.WalkSouth){
						this.sprite.setSprite(sprites.PJDemon.WalkSouth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}else if (this.velY < 0 && this.sprite.getSpriteSheet() != sprites.PJDemon.WalkNorth){
						this.sprite.setSprite(sprites.PJDemon.WalkNorth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		
		},
		bossIntro: function(){
			if(!this.ticksInState){	
				this.sprite.setSprite(sprites.PJDemon.entrance, //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				16, 9, false);
				Sound.stop("MageHookThemeSong");
				Sound.play("boss_bgm",true,MUSIC_VOLUME);
				ga('send', {
				  hitType: 'event',
				  eventCategory: 'Boss',
				  eventAction: 'Fight',
				  eventLabel: 'PJBoss',
				});
			}
			if(this.ticksInState > 36) {
				this.velX = 0;
				this.velY = .5;
				this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
				this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);				
				this.tileBehaviorHandler();
			}
			for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var openDoors = [TILE_ROOM_DOOR_NORTH, TILE_ROOM_DOOR_SOUTH, 
									 TILE_ROOM_DOOR_EAST, TILE_ROOM_DOOR_WEST];
					var tileIndex = rowColToArrayIndex(eachCol, eachRow);
					var doorTile = worldGrid[tileIndex];
					if ((openDoors.indexOf(doorTile) > -1)) {
						worldGrid[tileIndex] = TILE_WALL; //TODO: Make new tile;
					} // end of if openDoors.indexOf
				} // end of for eachCol
			} // end of for eachRow
			if(this.sprite.isDone()){
				this.setState("summon");
				return;
			}
			this.sprite.update();
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Boss',
		  eventAction: 'Defeat',
		  eventLabel: 'PJBoss',
		});

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var tileIndex = rowColToArrayIndex(eachCol, eachRow);
				if (worldGrid[tileIndex] == TILE_WALL) {
					worldGrid[tileIndex] = TILE_ROOM_DOOR_NORTH;
				} // end of if openDoors.indexOf
			} // end of for eachCol
		} // end of for eachRow
		Sound.stop("boss_bgm");
		Sound.play("mage_hook_chiptune_menu_melody",true,MUSIC_VOLUME);
		ending();

		
		// remove from enemy list
		var foundHere = currentRoom.enemyList.indexOf(this.monsterRef);
		if (foundHere > -1) {
			currentRoom.enemyList.splice(foundHere, 1);
		}
		
	} // end of deadEvent

	return new enemyClass(this, staates);
}