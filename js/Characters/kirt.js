function kirt(x, y) {

	this.x = x + 22;
	this.y = y - 16; //y offset
	this.initialState = "normal";
	this.maxHealth = 9; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 4;
	this.tileColliderHeight = 2;
	this.tileColliderOffsetX = -0.5;
	this.tileColliderOffsetY = 10.5;

	this.hitboxWidth = 9;
	this.hitboxHeight = 22;
	this.hitboxOffsetX = -0.5;
	this.hitboxOffsetY = 0.5;

	this.spriteSheet = sprites.Kirt.idleRight;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 3;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	this.name = "it's Kirt";
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {
/*		munch : function(){
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

		},*/

		normal : function(){
			
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		recoil: function(){
			//do checks and stuff for dialoge
		},
		dying: function(){
			// remove from enemy list
			var foundHere = currentRoom.enemyList.indexOf(this);
			if (foundHere > -1) {
				currentRoom.enemyList.splice(foundHere, 1);
			}
				
			this.sprite.update();
		}
	}

	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'Kirt',
		});
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;		
	} // end of dead
	
	return new enemyClass(this, staates);
}
enemyDictionary["Kirt"] = kirt