function door(x, y) {

	this.x = x + 22;
	this.y = y - 22; //y offset
	this.initialState = "normalDoorLikeBehavior";
	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 30;
	this.hitboxHeight = 40;
	this.hitboxOffsetX = -1;
	this.hitboxOffsetY = 1;

	this.spriteSheet = sprites.Door.idle;
	this.spriteWidth = 44;
	this.spriteHeight = 44;
	this.spriteFrames = 1;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	this.name = "it's a door yo"
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
				this.setState("normal");
			}

		},
		normalDoorLikeBehavior : function(){
		},
		normal : function(){
			
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		recoil: function(){
			if(!this.mapData){
				throw "yo, you need to set properties in the tmx file for this level";
			}
			if(!this.mapData.toDoor ){
				throw "yo, you need to set properties in the tmx file for this level \n Set custom property toDoor to a door in the next level so the character knows where to spawn";
			}
			if(!this.mapData.toLevel ){
				throw "yo, you need to set properties in the tmx file for this level\n Set custom property toName to a door so the game knows which level to load";
			}
			if(!this.mapData.name){
				throw "yo, you need to set properties in the tmx file for this level\n Set custom property name to a door so other doors can spawn the player here.";
			}
			
			if(this.mapData.isLocked) {
				this.setState("normal");
				return;
			}

			console.log("Door recoil!!!!!!!!!!");
			var hasRoom = allRoomsData[this.mapData.toLevel];
			if(!hasRoom){
				throw "yo, the property toLevel in this door is not matching up with a loaded level!";
			}
			loadLevel(this.mapData.toLevel);

			for(var i in currentRoom.layout.layers[1].objects){
				if(currentRoom.layout.layers[1].objects[i].properties && currentRoom.layout.layers[1].objects[i].properties.name == this.mapData.toDoor ){
					console.log("Found dooor!!, moving player")
					player.x = currentRoom.layout.layers[1].objects[i].x + 60;
					player.y = currentRoom.layout.layers[1].objects[i].y - 16;
					this.setState("normal");
				}
			}
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
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'Door',
		});
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;		
	} // end of dead
	
	return new enemyClass(this, staates);
}
enemyDictionary["Door"] = door