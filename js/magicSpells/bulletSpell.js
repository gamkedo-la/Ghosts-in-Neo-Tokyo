function bulletMagic(x, y, isFacing) {
	if(!player.canFireBallAttack){
		return;
	}
	Sound.play("player_attack");
	var ctrl = {}
	ctrl.x = x;
	ctrl.y = y;
	ctrl.isFacing = isFacing;
	ctrl.lifetime = 100;
	
	ctrl.attackFrames = {
		0: {x1: 0, y1: 0, x2: 8, y2:8 },
		1: {x1: 0, y1: 0, x2: 8, y2:8 },
		2: {x1: 0, y1: 0, x2: 8, y2:8 },
		3: {x1: 0, y1: 0, x2: 8, y2:8 },};
		
	ctrl.spriteWidth = 16;
	ctrl.spriteHeight = 16;
	ctrl.spriteFrames = 12;
	ctrl.spriteSpeed = 6;
	
		switch(ctrl.isFacing) { //Draw attack in facing dirction
			case NORTH:
				ctrl.y -= 8;
				ctrl.attackDir = [0,-2];
				ctrl.spriteSheet = sprites.Player.bulletAttackNorth;
				break;
			case SOUTH:
				ctrl.y += 8;
				ctrl.attackDir = [0,2];
				ctrl.spriteSheet = sprites.Player.bulletAttackSouth;
				break;
			case EAST:
				ctrl.x += 8;
				ctrl.attackDir = [2,0];
				ctrl.spriteSheet = sprites.Player.bulletAttackEast;
				break;
			case WEST:
				ctrl.x -= 8;
				ctrl.attackDir = [-2,0];
				ctrl.spriteSheet = sprites.Player.bulletAttackWest;
				break;
		}

	particleFX(ctrl.x,ctrl.y,24,'rgba(255,200,80,0.33)',ctrl.attackDir[0]/8+0.001,ctrl.attackDir[1]/8+0.01,0.75,0.0,0.5);

	ctrl.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		this.remove = true;
		player.enemyHitCount++;
		enemy.getHit(1);
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-ctrl.y,enemy.x-ctrl.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	if(fireballLvl1Upgrade || fireballLvl3Upgrade) {
		var bullet1 = new magicClass(ctrl);
	}
	
		switch(ctrl.isFacing) { //Draw attack in facing dirction
			case NORTH:
				ctrl.y -= 5;
				ctrl.attackDir = [-0.5,-1.5];
				break;
			case SOUTH:
				ctrl.y += 5;
				ctrl.attackDir = [0.5,1.5];
				break;
			case EAST:
				ctrl.x += 5;
				ctrl.attackDir = [1.5,0.5];
				break;
			case WEST:
				ctrl.x -= 5;
				ctrl.attackDir = [-1.5,-0.5];
				break;
		}
	
	if(fireballLvl2Upgrade || fireballLvl3Upgrade) {
		var bullet2 = new magicClass(ctrl);
	}
	
		switch(ctrl.isFacing) { //Draw attack in facing dirction
			case NORTH:
				ctrl.y += 5;
				ctrl.attackDir = [0.5,-1.5];
				break;
			case SOUTH:
				ctrl.y -= 5;
				ctrl.attackDir = [-0.5,1.5];
				break;
			case EAST:
				ctrl.x -= 5;
				ctrl.attackDir = [1.5,-0.5];
				break;
			case WEST:
				ctrl.x += 5;
				ctrl.attackDir = [-1.5,0.5];
				break;
		}

	if(fireballLvl2Upgrade || fireballLvl3Upgrade) {
		var bullet3 = new magicClass(ctrl);
	}
}