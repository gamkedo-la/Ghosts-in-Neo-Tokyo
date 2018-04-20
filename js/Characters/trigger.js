function trigger(x, y) {

	this.x = x + 10;
	this.y = y - 10; //y offset
	this.initialState = "normalTriggerLikeBehavior";
	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 0;
	this.tileColliderHeight = 0;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 0 ;

	this.hitboxWidth = 20;
	this.hitboxHeight = 20;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 0;

	this.spriteSheet = sprites.Trigger.idle;
	this.spriteWidth = 20;
	this.spriteHeight = 20;
	this.spriteFrames = 1;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	this.name = "it's a trigger yo"
	this.isTriggered = false;

	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	function triggerActivate(mapData){
		var targets = mapData.ID_Name.split(",");
		console.log("Trigger Activated");
			for(var j in targets) {
				console.log("Target: " + targets[j] );
				for(var i in currentRoom.objectList){
					
					var anObject = currentRoom.objectList[i];
					//console.log(anObject);
					if(anObject.mapData != undefined && anObject.mapData.name == targets[j] )
					{
						console.log(currentRoom.layout.layers[1].objects[i].type);
						const targetType = anObject.type;
						console.log(anObject.mapData.type);
						 if (targetType == "blocker")
						 {
							console.log("Found blocker");
							//anObject.die(); //enemyData.deadEvent(); //setState("deadEvent");
							anObject.isAlive = false;
							anObject.enemyData.isBlocking = false;
							
						}
					}
				}
			}
	}

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
		onTriggerEnter : function() {
			if(this.mapData != undefined) {
				if(this.isTriggered != true)
				{
					console.log("The trigger is set! Needs: ");

					console.log( this.mapData.ItemNeeded);
					console.log("Does the inventory have it: " + hasItem(this.mapData.ItemNeeded) );
					if(hasItem(String( this.mapData.ItemNeeded)) ) {
						this.isTriggered = true;
						triggerActivate(this.mapData);
						//this.setState("dying");
						this.isAlive = false; //deadEvent();
					}
				}
				this.setState("normalTriggerLikeBehavior");
			}
		},
		normalTriggerLikeBehavior : function(){
		},
		normal : function(){
			
			//this.sprite.update();
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
enemyDictionary["trigger"] = trigger