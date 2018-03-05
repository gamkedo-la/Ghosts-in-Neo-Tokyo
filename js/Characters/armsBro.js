function armsBro(x, y) {
	this.name = "armsBro";
	this.x = x;
	this.y = y;

	this.maxHealth = 5; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = TILE_TRANSPARENT;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.ArmsBro.walkAnimation;
	this.spriteSheetEast = sprites.ArmsBro.walkAnimationEast;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 9;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;
	var staaates = { 
		charge: function(){
			this.setState("throwBone")
		},
		throwBone: function(){
			if(this.ticksInState % 30 == 0){
				var direction;//hoisted?
				if(player.x > this.x){
					direction = EAST;
					this.sprite.setSprite(sprites.ArmsBro.boneThrowRight, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);		
				} else if (player.x < this.x) {
					direction = WEST;
					this.sprite.setSprite(sprites.ArmsBro.OtherBoneThrow, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				}
				//TODO: make enmy throw bone in y direction if player is there
				boneThrow(this.x, this.y, direction);
			} 
			if(this.sprite.getSpriteSheet() == sprites.ArmsBro.boneThrowRight || this.sprite.getSpriteSheet() == sprites.ArmsBro.OtherBoneThrow){
				if(this.sprite.isDone()){
					if(player.x > this.x){
						direction = EAST;
						this.sprite.setSprite(sprites.ArmsBro.idleRight, //TODO: maybe derp emote? 
						this.enemyData.spriteWidth, this.enemyData.spriteHeight,
						4, this.enemyData.spriteSpeed, true); 
					} else if (player.x < this.x) {
						direction = WEST;
						this.sprite.setSprite(sprites.ArmsBro.idle, //TODO: maybe derp emote? 
						this.enemyData.spriteWidth, this.enemyData.spriteHeight,
						4, this.enemyData.spriteSpeed, true);  
					}		
				}
			}
			if(this.ticksInState > 28){
				this.setState("normal")
			}
			this.sprite.update();
		},
		throwBoneNS: function(){
			if(this.ticksInState % 30 == 0){
				var direction;//hoisted?
				if (player.y < this.y) {
					direction = NORTH;
					this.sprite.setSprite(sprites.ArmsBro.boneThrowRight, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				} else if (player.y > this.y) {
					direction = SOUTH;
					this.sprite.setSprite(sprites.ArmsBro.boneThrowRight, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				}
				//TODO: make enmy throw bone in y direction if player is there
				boneThrow(this.x, this.y, direction);
			} 
			if(this.sprite.getSpriteSheet() == sprites.ArmsBro.boneThrowRight || this.sprite.getSpriteSheet() == sprites.ArmsBro.OtherBoneThrow){
				if(this.sprite.isDone()){
					if (player.y < this.y) {
						direction = NORTH;
						this.sprite.setSprite(sprites.ArmsBro.idleRight, //TODO: maybe derp emote? 
						this.enemyData.spriteWidth, this.enemyData.spriteHeight,
						4, this.enemyData.spriteSpeed, true); 
					} else if (player.y > this.y) {
						direction = SOUTH;
						this.sprite.setSprite(sprites.ArmsBro.idleRight, //TODO: maybe derp emote? 
						this.enemyData.spriteWidth, this.enemyData.spriteHeight,
						4, this.enemyData.spriteSpeed, true); 
					}		
				}
			}
			if(this.ticksInState > 28){
				this.setState("normal")
			}
			this.sprite.update();
		},
		normal : function() {	
			if( Math.abs(this.x - player.x) < 8){
				this.setState("throwBoneNS");
				return;
			} else if( Math.abs(this.y - player.y) < 8){
				this.setState("throwBone");
				return;
			}
			if(!this.ticksInState){
				if(this.facing == EAST){
					this.sprite.setSprite(sprites.ArmsBro.idleRight, //TODO: maybe derp emote? 
						this.enemyData.spriteWidth, this.enemyData.spriteHeight,
						4, this.enemyData.spriteSpeed, true); 

				} else {

					this.sprite.setSprite(sprites.ArmsBro.idle, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, true); 
					
				}
			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}, 
		wander : function(){
			if( Math.abs(this.y - player.y) < 10){
				this.setState("throwBone");
				return;
			}
			if( Math.abs(this.x - player.x) < 10){
				this.setState("throwBone");
				return;
			}
			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				this.velX = Math.cos(angle) * speed;
				this.velY = Math.sin(angle) * speed;
				this.sprite.setSprite(this.enemyData.spriteSheet,
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == this.enemyData.spriteSheet && this.enemyData.spriteSheetEast){
					if(this.velX > 0){
						this.facing = EAST;
						var frames = this.enemyData.spriteSheetEastFrames ? this.enemyData.spriteSheetEastFrames : this.enemyData.spriteFrames;
						this.sprite.setSprite(this.enemyData.spriteSheetEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							frames, this.enemyData.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == this.enemyData.spriteSheetEast){
					if(this.velX < 0){
						this.facing = WEST;
						this.sprite.setSprite(this.enemyData.spriteSheet,
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
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'ArmsBro',
		});

		// remove from enemy list
		var foundHere = currentRoom.enemyList.indexOf(this.monsterRef);
		if (foundHere > -1) {
			currentRoom.enemyList.splice(foundHere, 1);
		}
		
		if (currentRoomCol == 1 && currentRoomRow == 1 && currentFloor == 1) {
			console.log("dropping keys");
			dropItem(this.x, this.y, ITEM_KEY_COMMON,2);
			dropItem(this.x, this.y, ITEM_KEY_COMMON,1);
		} else {
			return;
		}
		
		
		return;
	
	
	}
	
	return new enemyClass(this, staaates);
}