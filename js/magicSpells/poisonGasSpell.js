function poisonGasAttack(x, y) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.lifetime = 100;
	this.canRaycast = false;
	
	this.attackFrames = {
		
		0: {x1: 0, y1: 6, x2: 28, y2:18 },
		1: {x1: 0, y1: 6, x2: 28, y2:18 },
		2: {x1: 0, y1: 6, x2: 28, y2:18 }};

	this.spriteSheet = sprites.PlantBaby.poisonCloud;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 12;
	this.spriteSpeed = 6;
	this.speed = 0;
	this.attackDir = [0,-1];

	console.log("cloud made");

	this.raycasting = function() {
		return;
	}

	this.onHitEnemy = function (enemy) {
		this.remove = false;
		isPoisoned = true;
		//Sound.play("enemy_hit"); //maybe?
	}
	return new magicClass(this, [player]);
}