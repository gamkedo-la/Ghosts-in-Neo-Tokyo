function heroBoss(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 50; // how many hits till it dies 
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;
	this.initialState = "bossIntro";
	this.isAlive = true;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 12;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 26;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 26;

	this.spriteSheet = sprites.HeroBoss.walkSouth;
	this.spriteWidth = 64;
	this.spriteHeight = 64;
	this.spriteFrames = 8;
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
		bossIntro: function() {
			ga('send', {
			  hitType: 'event',
			  eventCategory: 'Boss',
			  eventAction: 'Fight',
			  eventLabel: 'HeroBoss',
			});
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
			Sound.pause("MageHookThemeSong");
			Sound.play("boss_bgm",true,MUSIC_VOLUME);
			this.setState("derpAround");
			return;
			this.sprite.update();
		}, // end of bossIntro
		normal : function(){
			if(this.maxHealth != this.currentHealth){
				if( Math.abs(this.y - player.y) < 20 ){
					this.setState("walkToMid")
					return;
				}
				if( Math.abs(this.x - player.x) < 20){
					this.setState("walkToMid")

					return;
				}
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(sprites.HeroBoss.Stand, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					1, this.enemyData.spriteSpeed, true);

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
				this.setState("dodgeRoll")
			}else if (willWander < 4){
				this.setState("praiseIt")
			}else {
				this.setState("slashAttack")
			}
		},
		dodgeRoll : function(){
			if(!this.ticksInState){
				if(Math.random() < .5){
					this.sprite.setSprite(sprites.HeroBoss.dodgeRoll, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					8, this.enemyData.spriteSpeed, false);
					this.velX = 2;
				} else {
					this.sprite.setSprite(sprites.HeroBoss.dodgeRollLeft, //TODO: maybe derp emote? 
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
		slashAttack: function(){
			if(!this.ticksInState){		
				this.sprite.setSprite(sprites.HeroBoss['aaayAttack!!'], //TODO: maybe derp emote? 
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				4, this.enemyData.spriteSpeed, false);
				this.velX = 2;
				boneThrow(this.x, this.y, SOUTH)
			}
			if(this.sprite.isDone()){
				this.setState("derpAround");
				return;
			}
			this.sprite.update();
		},
		praiseIt: function(){
			if(!this.ticksInState){		
				this.sprite.setSprite(sprites.HeroBoss.praiseIt,
				this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				4, 2, false);
				this.velX = 2;
				
			}
			if(this.ticksInState == 45){
				var nextEnemy = new plantBaby(this.x +30, this.y + 30);
				currentRoom.enemyList.push(nextEnemy);
				var nextEnemy = new plantBaby(this.x -30, this.y + 30);
				currentRoom.enemyList.push(nextEnemy);
				// var nextEnemy = new plantBaby(this.x -30, this.y - 30);
				// currentRoom.enemyList.push(nextEnemy);
				// var nextEnemy = new plantBaby(this.x +30, this.y - 30);
				// currentRoom.enemyList.push(nextEnemy);
			}
			if(this.sprite.isDone()){
				if(this.y > 60){
					this.setState("walkToMid")
				} else {
					this.setState("derpAround");
				}
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
					if(this.velX > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkEast){
						this.sprite.setSprite(sprites.HeroBoss.walkEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							8, this.enemyData.spriteSpeed, true);	
					}else if (this.velX < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkWest){						
						this.sprite.setSprite(sprites.HeroBoss.walkWest,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				} else {
					if(this.velY > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkSouth){
						this.sprite.setSprite(sprites.HeroBoss.walkSouth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}else if (this.velY < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkNorth){
						this.sprite.setSprite(sprites.HeroBoss.walkNorth,
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
		
		walkToMid : function(){
			var speed = 2 //TODO: make charge speed a variable in newEnemy
			var angle = Math.atan2(30 - this.y, 140 - this.x);
			velX = Math.cos(angle) * speed;
			velY = Math.sin(angle) * speed;
			if(Math.abs(30 - this.y) < 20 && Math.abs(140 - this.x) < 20){
				this.setState("slashAttack")
				return;
			}

			if(!this.ticksInState){
				if(Math.abs(this.velX) > Math.abs(this.velY)){
					if(this.velX > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkEast){
						this.sprite.setSprite(sprites.HeroBoss.walkEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							8, this.enemyData.spriteSpeed, true);	
					}else if (this.velX < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkWest){						
						this.sprite.setSprite(sprites.HeroBoss.walkWest,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				} else {
					if(this.velY > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkSouth){
						this.sprite.setSprite(sprites.HeroBoss.walkSouth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}else if (this.velY < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkNorth){
						this.sprite.setSprite(sprites.HeroBoss.walkNorth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
					}
				}
			}
			if(this.ticksInState > 500){
				this.setState("derpAround")
				return;
			}
			
			

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}, 
		dying: function(){
			if(!this.ticksInState){
				this.sprite.setSprite(sprites.HeroBoss.deathMoment,
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					26, 2, false);	
			}

			if(this.sprite.isDone()){
				Sound.play("MageHookThemeSong",true,MUSIC_VOLUME);
				// remove from enemy list
				var foundHere = currentRoom.enemyList.indexOf(this);
				if (foundHere > -1) {
					currentRoom.enemyList.splice(foundHere, 1);
				}

				for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var tileIndex = rowColToArrayIndex(eachCol, eachRow);
					if (worldGrid[tileIndex] == TILE_WALL) {
						worldGrid[tileIndex] = TILE_ROOM_DOOR_NORTH;
						} // end of if openDoors.indexOf
					} // end of for eachCol
				} // end of for eachRow
				}

			this.sprite.update();
		}
	}

	this.deadEvent = function() {
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;
		
		Sound.stop("boss_bgm");
		
		player.canFireBallAttack = true;
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Boss',
		  eventAction: 'Defeat',
		  eventLabel: 'HeroBoss',
		});
	} // end of dead

	return new enemyClass(this, staates);
}