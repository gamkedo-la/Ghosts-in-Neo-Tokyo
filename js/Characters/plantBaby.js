function plantBaby(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 2; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.PlantBaby.idleAnimation;
	this.spriteSheetCharge = sprites.PlantBaby.runAnimation;	
	this.spriteSheetEastFrames= 4
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 10;
	this.spriteSpeed = 9;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staaates = {
		derpAround : function(){
			var willWander = Math.random() * 5;
			if(willWander > 1){
				this.setState("wander")
			} else if (willWander < 3) {
				this.setState("normal")
			} else {
				this.setState("charge")
			}
		}, 
		charge : function(){
			if(!this.ticksInState){
				this.sprite.setSprite(this.enemyData.spriteSheetCharge, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, true);
			}
			if(this.ticksInState > 1000 && mDist(this.x, this.y, player.x, player.y) > 10){
				this.setState("derpAround")
				return;
			}
			var speed = 1.75 //TODO: make charge speed a variable in newEnemy
			var angle = Math.atan2(player.y - this.y, player.x - this.x);
			velX = Math.cos(angle) * speed;
			velY = Math.sin(angle) * speed;

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			this.directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		normal : function(){		
			if(mDist(this.x, this.y, player.x, player.y) < 80){
				this.setState("charge")
				return;
			}
			if(!this.ticksInState){
				this.directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(this.enemyData.spriteSheet, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);

				// this.sprite.setSprite(sprites.Player.rangedAttack, //TODO: maybe derp emote? 
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	4, 10, true);
			}
			if (this.directionTimer <= 0 || this.directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		wander : function(){
			if(mDist(this.x, this.y, player.x, player.y) < 80){
				this.setState("charge")
				return;
			}

			if(!this.ticksInState){
				this.directionTimer = minMoveTime + Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				this.velX = Math.cos(angle) * speed;
				this.velY = Math.sin(angle) * speed;
				this.sprite.setSprite(this.enemyData.spriteSheet,
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == this.enemyData.spriteSheet && this.enemyData.spriteSheetEast){
					if(velX > 0){
						var frames = this.enemyData.spriteSheetEastFrames ? this.enemyData.spriteSheetEastFrames : this.enemyData.spriteFrames;
						this.sprite.setSprite(this.enemyData.spriteSheetEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							frames, this.enemyData.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == this.enemyData.spriteSheetEast){
					if(velX < 0){

						this.sprite.setSprite(this.enemyData.spriteSheet,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				}
			}

			if (this.directionTimer <= 0 || this.directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);
			this.directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
			//poisonGasAttack(this.x, this.y);
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'PlantBaby',
		});

		// remove from enemy list
		var foundHere = currentRoom.enemyList.indexOf(this.monsterRef);
		if (foundHere > -1) {
			currentRoom.enemyList.splice(foundHere, 1);
		}
		return;
	}
	
	return new enemyClass(this, staaates);
}