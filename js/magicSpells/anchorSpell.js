function anchorMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		4: {x1: 5, y1: 8, x2: 20, y2:10 },
		5: {x1: 5, y1: 8, x2: 20, y2:10 },
		6: {x1: 5, y1: 8, x2: 20, y2:10 }};
		
	this.spriteSheet = sprites.Player.anchorAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 18;
	
	this.attackDir = [0,0];

	var particleVX = 0;
	var particleVY = 0;
	
	switch(this.isFacing) { //Draw attack in facing dirction
			case NORTH:
				this.x -= 6;
				this.y -= 16;
				particleVX = 0.001;
				particleVY = -2;
				break;
			case SOUTH:
				this.x -= 6;
				this.y += 16;
				particleVX = -0.001;
				particleVY = 2;
				break;
			case EAST:
				this.x += 13;
				particleVX = 2;
				particleVY = 0.001;
				break;
			case WEST:
				this.x -= 25;
				particleVX = -2;
				particleVY = -0.001;
				break;
		}
	
	// blue sparks placed with offset for facing dir so it starts close to player
	particleFX(x,y,24,'rgba(0,240,255,0.33)',particleVX,particleVY,0.4,0.0,1.0);
	

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