const RANGED_ATTACK_SPEED = 2;
const BLOOD_SPLATTER_SPEED = 1;
const PARTICLES_PER_ENEMY_HIT = 16;

function magicClass(magic, enemyList, objectList) {
	this.x = magic.x;
	this.y = magic.y;
	this.pastX = this.x;
	this.pastY = this.y;
	this.maxHealth = magic.maxHealth;
	this.isFacing = magic.isFacing;
	this.lifetime = magic.lifetime || false;
	this.canRaycast = magic.canRaycast;
	 
	this.collider = new boxColliderClass(this.x, this.y, 0, 0, 0, 0);
	 
	this.attackFrames = magic.attackFrames;
	this.attackDir = magic.attackDir;
	
	this.sprite = new spriteClass();
	this.sprite.setSprite(	magic.spriteSheet,
							magic.spriteWidth, magic.spriteHeight,
							magic.spriteFrames, magic.spriteSpeed, true);
	this.remove = false;
	this.onHitEnemy = magic.onHitEnemy;
	this.onHitObject = magic.onHitObject;
	this.tileHit = magic.tileHit;
	if(magic.speed == undefined){
		this.speed = RANGED_ATTACK_SPEED;
	} else {
		this.speed = magic.speed
	}
	if(!enemyList){
		this.enemyList = currentRoom.enemyList;
	} else {
		this.enemyList = enemyList;
	}
	if(!objectList){
		this.objectList = currentRoom.objectList;
	} else {
		this.objectList = objectList;
	}
	this.draw = function() {
		this.sprite.draw(this.x,this.y);
		if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.collider.draw('red');
		}
	}

	this.update = function() {
		this.pastX = this.x;
		this.pastY = this.y;
		this.doesSpellHitTile();
		if(this.sprite.isDone() || this.remove){
			var index = currentRoom.magic.indexOf(this);
			if(index !== -1) {
				currentRoom.magic.splice(index, 1);
//				console.log("attack removed")
				return;
			}
		}
		this.x += this.attackDir[0]*this.speed;
		this.y += this.attackDir[1]*this.speed;
		var frame = this.sprite.getFrame();
		if(this.attackFrames[frame]){
			this.collider.offsetX = this.attackFrames[frame].x1;
			this.collider.offsetY = this.attackFrames[frame].y1;
			this.collider.width = this.attackFrames[frame].x2;
			this.collider.height = this.attackFrames[frame].y2;
			this.hitEnemy();
		} else {
			this.collider.offsetX = 9002;
			this.collider.offsetY = 0;
			this.collider.width = 0;
			this.collider.height = 0;
		}
		this.collider.setCollider(this.x, this.y);
		this.sprite.update();
		if (typeof this.lifetime == "number") {
			this.lifetime--;
			if (this.lifetime < 0) {
				this.remove = true;
			}
		}
	}

	this.doesSpellHitTile = function() {
		if (this.canRaycast) {
			if (this.attackDir[0] < 0) { // WEST
//				console.log(Math.floor(this.pastX));
				if (this.pastX <= magic.obstacle.x) {
//					console.log("spell X <= obstacle X");
					this.remove = true;
					this.tileHit();
				}
			} else if (this.attackDir[0] > 0) { // EAST
				console.log(Math.floor(this.pastX));
				if (this.pastX >= magic.obstacle.x) {
//					console.log("spell X >= obstacle X");
					this.remove = true;
					this.tileHit();
				}
			} else if (this.attackDir[1] < 0) { // NORTH
				console.log(Math.floor(this.pastX));
				if (this.pastY <= magic.obstacle.y) {
//					console.log("spell Y <= obstacle Y");
					this.remove = true;
					this.tileHit();
				}
			} else if (this.attackDir[1] > 0) { // SOUTH
				console.log(Math.floor(this.pastX));
				if (this.pastY >= magic.obstacle.y) {
//					console.log("spell Y >= obstacle Y");
					this.remove = true;
					this.tileHit();
				}
			}
		}
	}

	this.hitEnemy = function() {
		for (var i = 0; i < this.enemyList.length; i++) {
			var enemy = this.enemyList[i];
			if (this.collider.isCollidingWith(enemy.hitbox))
				this.onHitEnemy(enemy);
		}
		
		for (var i = 0; i < this.objectList.length; i++) {
			const gameObject = this.objectList[i];
			if (this.collider.isCollidingWith(gameObject.hitbox)) {
				this.onHitObject(gameObject);
			}
		}
	}

	currentRoom.magic.push(this);
}