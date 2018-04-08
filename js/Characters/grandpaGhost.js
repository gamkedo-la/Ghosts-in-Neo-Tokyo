function grandpaGhost(x, y) {

	this.x = x + 22;
	this.y = y - 16; //y offset
	this.initialState = "normal";
	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 2;
	this.hitboxHeight = 2;
	this.hitboxOffsetX = -1;
	this.hitboxOffsetY = -1;

	this.spriteSheet = sprites.GrandpaGhost.idle;
	this.spriteWidth = 32;
	this.spriteHeight = 55;
	this.spriteFrames = 4;
	this.spriteSpeed = 3;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	this.name = "Grandpa";
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {

		normal : function(){
			
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		recoil: function(){
			//do checks and stuff for dialoge
			this.sprite.update();
			this.tileBehaviorHandler();
		}/*,
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
		}*/
	}



	this.deadEvent = function() {
		ga('send', {
		  hitType: 'event',
		  eventCategory: 'Monster',
		  eventAction: 'Defeat',
		  eventLabel: 'grandpaGhost',
		});
		this.monsterRef.setState("dying")
		this.monsterRef.isDying = true;		
	} // end of dead

	var newGrandpaGhost = new enemyClass(this, staates);
	//remove hitbox so they don't get damaged
	newGrandpaGhost.hitbox = null;

	return newGrandpaGhost;
}
enemyDictionary["GrandpaGhost"] = grandpaGhost