function floorButton(x, y) {

	this.x = x;
	this.y = y - 16; //y offset
	this.initialState = "normalDoorLikeBehavior";
	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 17;
	this.hitboxHeight = 9;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 10;

	this.spriteSheet = sprites.FloorButton.idle;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 1;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {
		munch : function(){
			if(!this.ticksInState){
				this.sprite.setSprite(sprites.Slime.munch, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				
			}

			if(this.ticksInState == 9){
				muunch(this.x, this.y);
			}

			if(this.sprite.isDone() && this.sprite.getSpriteSheet() != sprites.Slime.idleAnimation){
				this.sprite.setSprite(sprites.Slime.idleAnimation, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, true);
			}

			this.sprite.update();
			if(this.ticksInState > 100){
				this.setState("normal")
			}

		},
		normalDoorLikeBehavior : function(){
		},
		normal : function(){
			
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		dying: function(){
			if(!this.ticksInState){
				// this.sprite.setSprite(sprites.Slime.death,
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	10, 15, false);	
			}
			
			// if(this.sprite.isDone()){
				
				// remove from enemy list
				var foundHere = currentRoom.enemyList.indexOf(this);
				if (foundHere > -1) {
					currentRoom.enemyList.splice(foundHere, 1);
				}
				
			// }
			this.sprite.update();
		},
		recoil: function() {
			console.log("touched a button");
			this.setState("normal");
			this.sprite.setFrame(2);
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'Button',
		});
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;		
	} // end of dead
	
	return new enemyClass(this, staates);
}
enemyDictionary["fButton"] = floorButton