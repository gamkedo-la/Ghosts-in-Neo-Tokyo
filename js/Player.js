var debugFly = false;
const startHealth = 6;
var _PLAYER_MOVE_SPEED = 4;
var _PLAYER_DASH_SPEED_SCALE = 4.0;
const DASH_TIMESPAN_MS = 250; // how long to dash for
var _MS_BETWEEN_DASHES = 1000; // minimum time between dashes
const PLAYER_MOVE_CHECKS_PER_TICK = 5;
var _STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = 0.7;
const FLASH_DURATION = 0.05;
const PARTICLES_PER_BOX = 200;
const PARTICLES_PER_TICK = 3;
const JUMP_TIME = 12;
var poisonTick = 250;
var poisonDuration = 500;
var isPoisoned = false;
var poisonTime = 0;
var noDamageForFloor = [false, true, true];

const FRICTION = 0.80;
var _WEB_FRICTION = 0.50;
const DEATH_RESPAWN_DELAY_MS = 2500; // time for playerDeathAnimation before player.reset()

const INITIAL_KNOCKBACK_SPEED = 8;

const NORTH = 1;
const SOUTH = 2;
const EAST = 3;
const WEST = 4;
const ATTACK = 5; // used in input.js for future double tap logic
const RANGED_ATTACK = 6;
const ANCHOR_ATTACK_COOLDOWN = 650
const FIRE_ATTACK_COOLDOWN = 300;
const STARTING_POSITION_X = 240;
const STARTING_POSITION_Y = 60;

const GRAVITY = -0.5;
const JUMP_POWER = -7;

const WALL_JUMP_MAX_TIME = 10;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = SOUTH;
	var wasFacing = isFacing;
	var isAttacking = false;
	var wasAttacking = false;
	var playerFriction = FRICTION;

	var playerAtStartingPosition = true;
	this.x = STARTING_POSITION_X;
	this.y = STARTING_POSITION_Y;
	this.vy = 0;

	this.name = "Untitled Player";
	this.maxHealth = startHealth;
	this.enemyHitCount = 0;
	this.currentHealth = this.maxHealth;
	this.inventory = {};
	this.inventory.keysCommon = 0;
	this.inventory.keysRare = 0;
	this.inventory.keysEpic = 0;
	this.isStunned = false;
	this.isInvincible = false;
	this.motionState = "Falling";
	this.jumpTime = 0;
	var stunTimer;
	var invincibleTimer;
	var flashTimer;
	var attackTimer;
	var drawPlayer = true;
	var knockbackAngle;
	var knockbackSpeed;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;
	this.keyHeld_Jump = false;
	this.keyHeld_Attack = false;
	this.keyHeld_Dash = false;
	this.lastDashTime = 0;
	this.lastAnchorAttack = 0;
	this.lastFireAttack = 0;
	this.keyHeld_Ranged_Attack = false;
	this.canFireBallAttack = true;
	//this.dashPending = []; // eg player.dashPending[NORTH] = true;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;
	this.controlKeyAttack;
	this.controlKeyDash;
	this.controlKeyRangeAttack;
	this.controlKeyJump;

	var tileColliderWidth = 4;
	var tileColliderHeight = 2;
	var tileColliderOffsetX = -0.5;
	var tileColliderOffsetY = 10.5;
	this.tileCollider = new boxColliderClass(this.x, this.y,
		tileColliderWidth, tileColliderHeight,
		tileColliderOffsetX, tileColliderOffsetY);
	var hitboxWidth = 8;
	var hitboxHeight = 10;
	var hitboxOffsetX = -0.5;
	var hitboxOffsetY = 6.5;
	this.hitbox = new boxColliderClass(this.x, this.y,
		hitboxWidth, hitboxHeight,
		hitboxOffsetX, hitboxOffsetY);

	var sprite = new spriteClass();

	// handles word bubble / footer chat
	this.chat = new npcChatSystem();

	this.facingDirection = function () {
		return isFacing;
	}

	this.setupInput = function (upKey, rightKey, downKey, leftKey, attackKey, dashKey, rangedAttackKey, jumpKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;

		this.controlKeyUpALT = KEY_W;
		this.controlKeyRightALT = KEY_D;
		this.controlKeyDownALT = KEY_S;
		this.controlKeyLeftALT = KEY_A;

		this.controlKeyJump = jumpKey;
		this.controlKeyAttack = attackKey;
		this.controlKeyDash = dashKey;
		this.controlKeyRangeAttack = rangedAttackKey;
	}

	this.die = function () { // called immediately if we die
		//this.reset();
		if (this.currentlyDying) return; // debounce multiple frames
		this.currentlyDying = true;
		ga('send', {
			hitType: 'event',
			eventCategory: 'Player',
			eventAction: 'Death',
			eventLabel: 'Unknown',
		});
		//Sound.stop("boss_bgm");
		//Sound.stop("MageHookThemeSong");
		//Sound.play("player_die");
		console.log("Starting player death animation!");
		sprite.setSprite(sprites.Player.deathAnimation, 32, 32, 16, 8, false);
		//setTimeout(player.respawn,DEATH_RESPAWN_DELAY_MS); // bug: thrashes "this"
		this.pendingRespawnTimestamp = performance.now() + DEATH_RESPAWN_DELAY_MS;
		console.log("pendingRespawnTimestamp=" + this.pendingRespawnTimestamp);
		isPoisoned = false;
		this.isInvincible = false;
		poisonTime = 0;
	}

	this.respawn = function () { // called after a delay when you die
		console.log("Death animation complete. Respawning...");
		resetAllRooms();
		// TODO: save the high score?
		this.enemyHitCount = 0;
		this.currentlyDying = false
		// FIXME: "this" seems to be a problem here, use .apply() or .call()??
		// reason: function calls during a setTimeout lose the this reference
		//player.enemyHitCount = 0; 
		this.enemyHitCount = 0;
		fireballLvl1Upgrade = true;
		fireballLvl2Upgrade = fireballLvl3Upgrade = false;
		//player.currentlyDying = false;
		//player.reset("Untitled Player");
		this.currentlyDying = false;
		this.currentHealth = -999; // FIXME: hack to force player respawn back at starting position - is this wrong? can we respawn NOT after dying but for another reason?
		this.reset("Untitled Player");
		//Sound.play("MageHookThemeSong",true,MUSIC_VOLUME);
		this.chat.sayBubble("I just respawned!",sprites.Player.defaultFaceImage);
	}

	this.reset = function (playerName) {
		console.log("Player reset: " + playerName);

		this.chat.sayFooter("This is an example of the NPC\ndialogue footer! Lovely!",);

		this.name = playerName;
		if (this.currentHealth <= 0) {
			this.inventory.keysCommon = 0;
			this.inventory.keysRare = 0;
			this.inventory.keysEpic = 0;
			this.maxHealth = startHealth;
			this.currentHealth = this.maxHealth;
			currentRoomCol = 0;
			currentRoomRow = 0;
			currentFloor = 1;
			lastValidCurrentRoomCol = 1;
			lastValidCurrentRoomRow = 1;
			lastValidCurrentFloor = 1;
			loadLevel();
			this.x = STARTING_POSITION_X;
			this.y = STARTING_POSITION_Y;
			this.vx = 0;
			this.vy = 0;
			playerAtStartingPosition = true;
			// instantly snap the camera which may be extremely far away from the respawn area
			cameraOffsetX = cameraOffsetY = 0; // these globals are from Main.js
		}


		this.isFacing = SOUTH; // FIXME possible bug? this.?
		this.isMoving = false;

		if (playerAtStartingPosition) {
			sprite.setSprite(sprites.Player.stand, 32, 32, 1, 0, true);
			playerAtStartingPosition = false;
		}
		/*this.updateKeyReadout();*/

		/*for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(worldGrid[arrayIndex] == TILE_PLAYERSTART) {
					worldGrid[arrayIndex] = TILE_GROUND;
					this.x = eachCol * WORLD_W + WORLD_W/2;
					this.y = eachRow * WORLD_H + WORLD_H/2;
					return;
				} // end of player start if
			} // end of col for
		} // end of row for*/
	} // end of playerReset func

	/*this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + player.inventory.keysCommon;
	}*/

	this.startJump = function () {
		if (this.motionState == "Grounded" || this.motionState == "Walking") {
			this.motionState = "Jumping"
			//this.jumpTime = JUMP_TIME
			this.vy = JUMP_POWER;

			player_jump_SFX.play();
		}
	}


	this.applyGravity = function (target) {
		if(!debugFly){
			this.vy -= GRAVITY;
			target.y += this.vy;
		}

		return target;
	}

	this.wallJumpTime = 0;
	this.wallJumped = false;


	this.handleWallJump = function () {
		if (this.wallJumpTime > 0) {
			if (this.keyHeld_East || this.keyHeld_West) { // still holding on
				this.wallJumpTime--; // but losing grip
			} else { // released the wall
				this.wallJumpTime = 0;
			}
			if (this.keyHeld_Jump && (this.motionState == "Falling" || this.keyHeld_Jump && this.motionState == "Jumping")) { // jumps off wall
				this.wallJumpTime = 0;
				this.motionState = "Jumping";
				this.vy = JUMP_POWER;
				this.wallJumped = true;
			}
		}
		if (this.motionState == "Grounded" || this.motionState == "Walking") {
			this.wallJumped = false;
		}
	}


	this.move = function () {

		if (this.pendingRespawnTimestamp && this.pendingRespawnTimestamp <= performance.now()) {
			console.log("Pending respawn timestamp reached!");
			this.pendingRespawnTimestamp = 0;
			this.respawn();
			return;
		}

		// don't do anything during the death anim
		if (this.currentlyDying) {
			sprite.update();
			return;
		}

		// Movement optimizations based on feedback from Christer
		target = { x: this.x, y: this.y };

		if (this.keyHeld_West) {
			isFacing = WEST;
			target.x -= _PLAYER_MOVE_SPEED;
			this.handleWallJump();
		}
		if (this.keyHeld_East) {
			isFacing = EAST;
			target.x += _PLAYER_MOVE_SPEED;
			this.handleWallJump();
		}
		if (this.keyHeld_North) {
			isFacing = NORTH;
			if(debugFly)
				target.y -= _PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_South) {
			isFacing = SOUTH;
			if(debugFly)
				target.y += _PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_Jump) {
			this.startJump();
			this.handleWallJump();
		}

		//apply gravity to modify
		target = this.applyGravity(target);

		if ((target.x != this.x || target.y != this.y)
			&& this.motionState != "Grounded"
		) {
			isMoving = true;
		}


		var xDir = Math.sign(target.x - this.x);
		var velX = xDir * _PLAYER_MOVE_SPEED * playerFriction;

		if(debugFly){
			var yDir = Math.sign(target.y - this.y);
			var velY = yDir * _PLAYER_MOVE_SPEED * playerFriction;
		}

		if (isMoving) {
			// "footsteps" = very faint dust particles while we are walking
			particleFX(this.x, this.y + 10, 2, 'rgba(200,200,200,0.2)', 0.01, 0.02, 1.0, 0.0, 0.2);

			if (this.keyHeld_Dash) {
				//console.log("keyHeld_Dash while moving!");
				if ((performance.now() - this.lastDashTime) > _MS_BETWEEN_DASHES) {
					console.log("DASH STARTING!");
					this.lastDashTime = performance.now();
				}
			}

			// we may dash for several frames
			if (this.lastDashTime + DASH_TIMESPAN_MS > performance.now()) {
				//anchorMagic(this.x, this.y, isFacing);
				//console.log('still dashing!');
				velX *= _PLAYER_DASH_SPEED_SCALE;
				velY *= _PLAYER_DASH_SPEED_SCALE;
			}
		}

		this.tileCollider.moveOnAxis(this, velX, X_AXIS);
		
		if(debugFly){
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			//var collisionY = this.tileCollider.moveOnAxis(this, velY, Y_AXIS);	
		} else {
			var collisionY = this.tileCollider.moveOnAxis(this, this.vy, Y_AXIS);	
		}
		
		// State maching switch: so that we know when to change from a state to another:
		// (also avoids confusions dues to switching state all the time)
		switch (this.motionState) {
			case "Falling":
				{
					if (collisionY) { // We hit the ground

						player_hit_ground_SFX.play();

						if (velX != 0) {
							this.motionState = "Walking";
						} else {
							this.motionState = "Grounded";
						}

					}
					break;
				}
			case "Walking":
				{
					this.vy = 0.5;
					if (collisionY) {
						if (velX == 0) {
							this.motionState = "Grounded";
						}
					}
					else {
						this.motionState = "Falling";
						this.vy = 0;
					}
					break;
				}
			case "Grounded":
				{
					this.vy = 0.5;
					if (collisionY) {
						if (velX != 0) {
							this.motionState = "Walking";
						}
					}
					else {
						this.motionState = "Falling";
					}

					break;
				}
			case "Jumping":
				{
					if (this.vy > 0) {
						this.motionState = "Falling";
					}
					break;
				}
			default:
				{
					console.log("UNKNOWN STATE! " + this.motionState);
				}
		}

		// Useful to debug the state switching.
		// console.log("PLAYER STATE MOVINGSTATE: " + this.motionState
		// 	+ "VY = "+ this.vy + ",  CollisionY: " + collisionY
		// 	);

		pickUpItems(this.hitbox);

		isAttacking = this.keyHeld_Attack;

		if (this.lastAnchorAttack + ANCHOR_ATTACK_COOLDOWN < performance.now() && isAttacking && !wasAttacking) // only trigger once
		{
			this.lastAnchorAttack = performance.now()
			anchorMagic(this.x, this.y, isFacing);
		}

		isUsingRangedAttack = this.keyHeld_Ranged_Attack;
		if (this.lastFireAttack + FIRE_ATTACK_COOLDOWN < performance.now() && isUsingRangedAttack && !wasAttacking)	//either melee attack or ranged attack
		{
			this.lastFireAttack = performance.now()
			bulletMagic(this.x, this.y, isFacing);
		}

		if (this.isCollidingWithEnemy() && !this.isInvincible) {
			if (this.currentHealth <= 0) {
				isPoisoned = false;
				this.die();
			} else {
				player_hit_SFX.play();
				this.isStunned = true;
				this.isInvincible = true;
				stunTimer = _STUN_DURATION;
				invincibleTimer = INVINCIBLE_DURATION;
				return;
			}
		}
		
		if(this.isCollidingWithObject() && !this.isInvincible) {
			this.isStunned = true;
			this.isInvincible = true;
			stunTimer = _STUN_DURATION;
			invincibleTimer = INVINCIBLE_DURATION;
	
			return;
		}

		choosePlayerAnimation();
		wasMoving = isMoving;
		wasFacing = isFacing;
		wasAttacking = isAttacking | isUsingRangedAttack;

		// stuns player when hit by enemies
		if (this.isStunned) {
			stunTimer -= TIME_PER_TICK;
			if (stunTimer <= 0) {
				this.isStunned = false;
			} else {
				var velX = Math.cos(knockbackAngle) * knockbackSpeed;
				var velY = Math.sin(knockbackAngle) * knockbackSpeed;
				this.tileCollider.moveOnAxis(this, velX, X_AXIS);
				this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
				knockbackSpeed *= FRICTION;
			}
		} else {
			sprite.update();
		}

		// Prevents player from colliding with enemeies
		if (this.isInvincible) {
			var healthBarFlashing = true;
			if (flashTimer <= 0 || flashTimer == undefined) {
				flashTimer = FLASH_DURATION;
				drawPlayer = !drawPlayer;
			}
			flashTimer -= TIME_PER_TICK;
			invincibleTimer -= TIME_PER_TICK;
			if (invincibleTimer <= 0) {
				this.isInvincible = false;
				drawPlayer = true;
			}
		}

		this.updateColliders();
		this.tileBehaviorHandler();

		// have we fallen outside the world?
		if (!this.currentlyDying && this.y > WORLD_MAX_Y) {
			console.log("Player fell out of the world. this.y=" + this.y);
			this.die(); // FIXME: buggy routine
		}

		//Do not go above the world
		if (this.y < 0) {
			this.y = 0;
		}

		//Do not allow the player to pass beyond left or right edges of the world
		//If this is activated, the player experiences an "invisible wall"
		if (this.x > (WORLD_W * WORLD_COLS) - hitboxWidth) {
			this.x = (WORLD_W * WORLD_COLS) - hitboxWidth;
		} else if (this.x < 0) {
			this.x = 0;
		}


		isMoving = false;
	}  // end of this.update()

	this.draw = function () {
		if (drawPlayer) {
			sprite.draw(this.x, this.y);
		}
		if (_DEBUG_DRAW_TILE_COLLIDERS) {
			this.tileCollider.draw('lime');
		}
		if (_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.hitbox.draw('red');
		}
	}

	function choosePlayerAnimation() {
		if (wasMoving != isMoving ||
			wasFacing != isFacing) {
			var playerPic;

			if (isMoving) {
				if (isFacing == SOUTH) {
					playerPic = sprites.Player.walkSouth;

				} else if (isFacing == EAST) {
					playerPic = sprites.Player.walkEast;

				} else if (isFacing == NORTH) {
					playerPic = sprites.Player.walkSouth;

				} else if (isFacing == WEST) {
					playerPic = sprites.Player.walkWest;
				}

				sprite.setSprite(playerPic, 32, 32, 7, 12, true);

			} else {
				playerPic = sprites.Player.stand;
				sprite.setSprite(playerPic, 32, 32, 1, 0, false);
			}
		}
	}

	this.poisoned = function () {
		if (isPoisoned) {
			poisonTime++;
			sprite.tintPlayer(0, 90, 0, 0);
			console.log("posionTime");
			if (poisonTime % poisonTick == 0 && poisonTime > 0) {
				this.currentHealth--;
				noDamageForFloor[currentFloor] = false;
				console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);
				this.isInvincible = true;
				invincibleTimer = INVINCIBLE_DURATION;
				player_hit_SFX.play();
				console.log("Health lost to poison");
			} else if (poisonTime > poisonDuration) {
				poisonTime = 0;
				isPoisoned = false;
				this.isInvincible = false;
				drawPlayer = true;
				console.log("poison over");
				return;
			}
			if (this.currentHealth <= 0) {
				this.die();
			}

		}
	}


	this.canHitEnemy = function (collider) { // used for attacks, returns the enemy

		//console.log('Detecting attacking collisions near ' + this.attackhitbox.x+','+this.attackhitbox.y);
		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		var hitAnEnemy = null;

		for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
			if (collider.isCollidingWith(enemy.hitbox)) {
				enemy.recoil = true;
				hitAnEnemy = enemy; //TODO: make this a list so we can hit more than one enemy
				for (var i = 0; i < PARTICLES_PER_ATTACK; i++) {
					var tempParticle = new particleClass(enemy.hitbox.x, enemy.hitbox.y, 'red');
					particle.push(tempParticle);
				}
			}
		}
		return hitAnEnemy;
	}
	this.getHit = function getHit(amount) {
		if (this.isInvincible) {
			return;
		}
		this.isInvincible = true;
		invincibleTimer = 0.5;
		this.currentHealth -= amount;
		noDamageForFloor[currentFloor] = false;
		console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);

		screenShake(5);
		player_hit_SFX.play();
		if (this.currentHealth < 1) {
			this.die()
		}
	}
	this.isCollidingWithEnemy = function () {
		var hitByEnemy = false;

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
			if (this.hitbox.isCollidingWith(enemy.hitbox)) {
				if (!this.isInvincible) {
					this.currentHealth--;
					noDamageForFloor[currentFloor] = false;
				}
				screenShake(5);
				knockbackAngle = calculateAngleFrom(enemy.hitbox, this.hitbox);
				knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				enemy.setState("recoil");
				hitByEnemy = true;
			}
		}
		return hitByEnemy;
	}
	this.isCollidingWithObject = function() {
		var colliding = false;

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		for (var i = 0; i < currentRoom.objectList.length; i++) {
			var anObject = currentRoom.objectList[i];
			if (this.hitbox.isCollidingWith(anObject.hitbox)) {
				knockbackAngle = calculateAngleFrom(anObject.hitbox, this.hitbox);
				knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				if(anObject.type == "Door") {
					knockbackSpeed = 0;
					anObject.setState("recoil");
				} else if((knockbackAngle < -0.5) && (knockbackAngle > -2)) {
					anObject.setState("recoil");
				}
				colliding = true;
			}
		}
		return colliding;
	}

	this.updateColliders = function () {
		this.hitbox.update(this.x, this.y);
		this.tileCollider.update(this.x, this.y);
	}

	this.tileBehaviorHandler = function () {
		// default behaviors go here
		playerFriction = FRICTION;
		sprite.setSpeed(12);

		var types = this.tileCollider.checkTileTypes();
		for (var i = 0; i < types.length; i++) {
			switch (types[i]) {
				case TILE_OOZE:

					//Sound.playUnlessAlreadyPlaying('hit_poison',false,0.5);

					if (!this.isInvincible) {
						isPoisoned = true;
					}

					if (isMoving) {
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lime');
							particle.push(tempParticle);
						}
					}
					break;
				case TILE_TRAP:
					if (this.currentHealth <= 0) {
						isPoisoned = false;
						this.die();
					}
					if (!this.isInvincible) {
						this.currentHealth--;
						noDamageForFloor[currentFloor] = false;
						console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);
						player_hit_SFX.play();
						this.isInvincible = true;
						invincibleTimer = 0.5;
					}
					screenShake(5);
					hitByEnemy = true;
					break;
				case TILE_WEB:
					playerFriction = _WEB_FRICTION;
					sprite.setSpeed(6)
					if (isMoving) {
						//Sound.playUnlessAlreadyPlaying('hit_web',false,0.2);
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lightGrey');
							particle.push(tempParticle);
						}
					}
					break;
				default:
					break;
			} // end of cases
		} // end of for tiles loop
	} // end of tile behavior

	this.doorParticles = function (thistileIndex) {
		// "dust" from a door opening - for more juice / player feedback
		// a straight line of upward moving fog...
		var pos = calculateCenterCoordOfTileIndex(thistileIndex);
		particleFX(pos.x - 6, pos.y + 12, 3, 'rgba(155,155,155,0.6)', 0.001, -0.1, 3.0, 0.0, 0.1);
		particleFX(pos.x - 3, pos.y + 12, 3, 'rgba(155,155,155,0.6)', 0.001, -0.1, 3.0, 0.0, 0.1);
		particleFX(pos.x, pos.y + 12, 3, 'rgba(155,155,155,0.6)', 0.001, -0.1, 3.0, 0.0, 0.1);
		particleFX(pos.x + 3, pos.y + 12, 3, 'rgba(155,155,155,0.6)', 0.001, -0.1, 3.0, 0.0, 0.1);
		particleFX(pos.x + 6, pos.y + 12, 3, 'rgba(155,155,155,0.6)', 0.001, -0.1, 3.0, 0.0, 0.1);
	}

	this.collisionHandler = function (tileIndex) {
		var collisionDetected = true;
		var tileType = worldGrid[tileIndex];

		switch (tileType) {
			case TILE_BOX:
				if (this.inventory.keysEpic > 0 && !this.isStunned) {
					this.inventory.keysEpic--; // one less key
					//Sound.play("enemy_die");
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					var result = calculateCenterCoordOfTileIndex(tileIndex);
					for (var i = 0; i < PARTICLES_PER_BOX; i++) {
						var tempParticle = new particleClass(result.x, result.y, 'gold');
						particle.push(tempParticle);
					}
					var totalItems = rollItemQuantity(10, 100, 2.5);
					for (var i = 0; i < totalItems; i++) {
						var dropType = Math.random() * 100;
						//in order of most common to least common
						if (dropType <= ITEM_CRYSTAL_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_CRYSTAL);
						else
							dropType -= ITEM_CRYSTAL_DROP_PERCENT;

						if (dropType <= ITEM_POTION_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_POTION);
						else
							dropType -= ITEM_POTION_DROP_PERCENT;

						if (dropType <= ITEM_KEY_COMMON_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_COMMON);
						else
							dropType -= ITEM_KEY_COMMON_DROP_PERCENT;

						if (dropType <= ITEM_KEY_RARE_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_RARE);
						else
							dropType -= ITEM_KEY_RARE_DROP_PERCENT;

						if (dropType <= ITEM_KEY_EPIC_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_EPIC);
						else
							dropType -= ITEM_KEY_EPIC_DROP_PERCENT;
					}
				}
				break;
			case TILE_DOOR_COMMON:
				if (this.inventory.keysCommon > 0 && !this.isStunned) {
					//Sound.play("door_open");
					this.inventory.keysCommon--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					this.doorParticles(tileIndex);
				}
				break;
			case TILE_DOOR_RARE:
				if (this.inventory.keysRare > 0 && !this.isStunned) {
					//Sound.play("door_open");
					this.inventory.keysRare--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					this.doorParticles(tileIndex);
				}
				break;
			case TILE_DOOR_EPIC:
				if (this.inventory.keysEpic > 0 && !this.isStunned) {
					//Sound.play("door_open");
					this.inventory.keysEpic--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					this.doorParticles(tileIndex);
				}
				break;
			case TILE_STAIRS_UP:
				if (!this.isStunned && isFacing == EAST) { // possible other conditions to do before stairs can be used?
					currentFloor++;
				}
				break;
			case TILE_STAIRS_DOWN:
				if (!this.isStunned && isFacing == WEST) { // possible other conditions to do before stairs can be used?
					currentFloor--;
				}
				break;
			case TILE_PIT_HORIZONTAL_TOP:
				currentFloor--;
				break;
			case TILE_TOP_LEFT_PIT_CORNER:
				currentFloor--;
				break;
			case TILE_TOP_RIGHT_PIT_CORNER:
				currentFloor--;
				break;
			case TILE_WALL:
			case TILE_WALL_NORTH:
			case TILE_WALL_SOUTH:
			case TILE_WALL_WEST:
			case TILE_WALL_EAST:
				if ((this.motionState == "Jumping" ||
					this.motionState == "Falling") && this.wallJumped == false) {
					this.wallJumpTime = WALL_JUMP_MAX_TIME;
					this.wallJumped = true;
				}
				break;
			case TILE_WALL_CORNER_NE:
			case TILE_WALL_CORNER_NW:
			case TILE_WALL_CORNER_SE:
			case TILE_WALL_CORNER_SW:
			case TILE_WALL_OUTCORNER_SW:
			case TILE_WALL_OUTCORNER_SE:
			case TILE_WALL_OUTCORNER_NW:
			case TILE_WALL_OUTCORNER_NE:
			case TILE_WALL_NORTH_TORCH:
			case TILE_WALL_SOUTH_TORCH:
			case TILE_WALL_WEST_TORCH:
			case TILE_WALL_EAST_TORCH:
			case TILE_SMALL_WALL_HORIZ:
			case TILE_SMALL_WALL_VERT:
			case TILE_SMALL_WALL_PILLAR:
			case TILE_SMALL_WALL_NE:
			case TILE_SMALL_WALL_NW:
			case TILE_SMALL_WALL_SE:
			case TILE_SMALL_WALL_SW:
			case TILE_SMALL_WALL_CAP_EAST:
			case TILE_SMALL_WALL_CAP_WEST:
			case TILE_SMALL_WALL_CAP_NORTH:
			case TILE_SMALL_WALL_CAP_SOUTH:
			case TILE_SMALL_WALL_INTO_BIG_EAST:
			case TILE_SMALL_WALL_INTO_BIG_WEST:
			case TILE_SMALL_WALL_INTO_BIG_NORTH:
			case TILE_SMALL_WALL_INTO_BIG_SOUTH:
				break;
			default:
				collisionDetected = false;
				break;
		}
		return collisionDetected;
	}
}
