function floorButton(x, y) {

	this.x = x;
	this.y = y - 16; //y offset
	this.initialState = "normal";
	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 17;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 0;
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
		normal : function(){
			if(this.thingsToSay.length > 0) {this.thingsToSay = [];}
			
			if((this.mapData.state == "set") && ((this.sprite.getFrame() == 1) || (this.sprite.getFrame() == 2))) {
				if(this.mapData.setTime != undefined && this.ticksInState >= this.mapData.setTime) {
				   this.setState("released");
				}
			} else if(((this.mapData.state == "released") && (this.sprite.getFrame() == 0)) || (this.mapData.state == "normal")) {
				this.sprite.update();
				this.tileBehaviorHandler();
			} else if(this.mapData.state == "set") {
				this.setState("set");
			} else if(this.mapData.state == "released") {
				this.setState("released");
			}
		},
		set: function() {
			if(this.sprite.getFrame() == 0) {
				this.sprite.setFrame(1);
			} else if(this.sprite.getFrame() == 1) {
				if(this.ticksInState > 5) {
					this.setState("normal");
					this.sprite.setFrame(2);
				}
				return;
			} else {
				return;//if frame is already = 2, the switch is already set and we don't need to set it again
			}
			
			if(!this.mapData){
				throw "yo, you need to set properties in the tmx file for this level";
			}
			if(!this.mapData.targetName ){
				throw "yo, you need to set properties in the tmx file for this level \n Set custom property targetName to a door name in this level so the door knows to unlock \n ";
			}
			
			this.mapData.state = "set";
			
			var targets = this.mapData.targetName.split(",");
			for(var j in targets) {
				for(var i in currentRoom.layout.layers[1].objects){
					if(currentRoom.layout.layers[1].objects[i].properties && currentRoom.layout.layers[1].objects[i].name == targets[j]){
						const targetType = currentRoom.layout.layers[1].objects[i].type;
						if (targetType == "Door") {
							currentRoom.layout.layers[1].objects[i].properties.isLocked = false;						
						} else if (targetType == "fButton") {
							currentRoom.layout.layers[1].objects[i].properties.state = "released";
						}
					}
				}
			}
		},
		released: function() {
			if(!this.mapData){
				throw "yo, you need to set properties in the tmx file for this level";
			}
			if(!this.mapData.targetName ){
				throw "yo, you need to set properties in the tmx file for this level \n Set custom property targetName to a door name in this level so the door knows to unlock";
			}
			
			this.mapData.state = "released";
			
			const targets = this.mapData.targetName.split(",");
			for(var j in targets) {
				for(var i in currentRoom.layout.layers[1].objects){
					if(currentRoom.layout.layers[1].objects[i].properties && currentRoom.layout.layers[1].objects[i].properties.name == targets[j] ){
						const targetType = currentRoom.layout.layers[1].objects[i].type;
						if (targetType == "Door") {
							currentRoom.layout.layers[1].objects[i].properties.isLocked = true;						
						} else if (targetType == "fButton") {
							currentRoom.layout.layers[1].objects[i].properties.state = "set";
						}
					}
				}		
			}
			
			this.setState("normal");
			this.sprite.setFrame(0);		
		},
		gotHit: function() {
			this.setState("set");
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