function missileMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.Player.rangedAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 13;
	
	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.x -= 6;
			this.y -= 16;
			this.attackDir = [0,-1];
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			break;
		case EAST:
			this.x += 13;
			this.attackDir = [2,0];
			break;
		case WEST:
			this.x -= 25;
			this.attackDir = [-2,0];
			break;
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.getHit(1);
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this);
}