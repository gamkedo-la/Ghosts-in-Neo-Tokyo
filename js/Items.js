const MIN_ITEM_SPEED = 2;
const MAX_ITEM_SPEED = 4;
const UNTANGLE_SPEED = .5;
const WALL_PUSH_SPEED = 5;
const UNTANGLE_TIME_LIMIT = 0;
const ITEM_FRICTION = .94;
const ITEM_WEB_FRICTION = .40;

const ITEM_KARAAGE_ONE = 0;
const ITEM_KARAAGE_TWO = 1;
const ITEM_KARAAGE_THREE = 2;
const ITEM_KARAAGE_FOUR = 3;
const ITEM_AVOCADO = 4;
const ITEM_TOAST = 5;
const ITEM_SOIL = 6;
const ITEM_PLANT_SEED = 7;
const ITEM_WATERBUCKET = 8;
const ITEM_UNDEFINED_10 = 9;
const ITEM_UNDEFINED_11 = 10;
const ITEM_UNDEFINED_12 = 11;
const ITEM_POTION = 12;
/*const ITEM_HEART_CONTAINER = 6;
const ITEM_ARTIFACT = 7;
const ITEM_FIREBALL_LVL2 = 8;
const ITEM_FIREBALL_LVL3 = 9;*/

const ITEM_SUCCESS_CHANCE = .70; // affects item drop rate
const ITEM_CRYSTAL_DROP_PERCENT = 80; //all item drop rates should add up to 100
const ITEM_POTION_DROP_PERCENT = 2;
const ITEM_KEY_COMMON_DROP_PERCENT = 0;
const ITEM_KEY_RARE_DROP_PERCENT = 0;
const ITEM_KEY_EPIC_DROP_PERCENT = 0;

const PARTICLES_PER_PICKUP = 32;

var attackBuff = 0;
var fireballLvl1Upgrade = true;
var fireballLvl2Upgrade = false;
var fireballLvl3Upgrade = false;

function itemClass(posX, posY, speed, type, angle) {
    this.x = posX;
    this.y = posY;
    this.type = type;
    this.canBePickedUp = false;
    var untangleTimer = UNTANGLE_TIME_LIMIT;
    var speed = speed;
    
    if (angle==undefined)
        angle = Math.random() * Math.PI * 2; // random direction
    //else
    //    console.log("Item spawning with an angle of " + angle); // angle of attacker

    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();
	switch (type){
		case(ITEM_AVOCADO):
            this.sprite.setSprite(worldPics[TILE_AVOCADO], 20, 20, 1, 0, true);
            var colliderWidth = 20;
            var colliderHeight = 20;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		
	}

	this.collider = new boxColliderClass(this.x, this.y,
								         colliderWidth, colliderHeight,
						                 colliderOffsetX, colliderOffsetY);

    this.update = function() {
        this.sprite.update();

        if (this.collider.moveOnAxis(this, velX, X_AXIS)) {
            velX = -velX;
        }
        if (this.collider.moveOnAxis(this, velY, Y_AXIS)) {
            velY = -velY;
        }

        velX *= ITEM_FRICTION;
        velY *= ITEM_FRICTION;

        if (untangleTimer > 0) {

            for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
                var item = currentRoom.itemOnGround[i];

                if (this != item && this.collider.isCollidingWith(item.collider)) {
                    var angle = calculateAngleFrom(item.collider, this.collider);
                    var untangleX = Math.cos(angle) * UNTANGLE_SPEED;
                    var untangleY = Math.sin(angle) * UNTANGLE_SPEED;

                    if (this.collider.moveOnAxis(this, untangleX, X_AXIS)) {
                        velX = -velX;
                    }

                    if (this.collider.moveOnAxis(this, untangleY, Y_AXIS)) {
                        velY = -velY;
                    }
                }
                this.tileBehaviorHandler();
            }

            untangleTimer -= TIME_PER_TICK;

        } else {
            velX = 0;
            velY = 0;
            this.canBePickedUp = true;
        }
    }

    this.draw = function() {
        this.sprite.draw(this.x, this.y);
        if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
            this.collider.draw('lime');
        }
    }

    this.updateColliders = function() {
        this.collider.update(this.x, this.y);
    }

    this.collisionHandler = function(tileIndex) {
        var collisionDetected = true;
        var tileType = worldGrid[tileIndex];
        switch(tileType) {
			case TILE_WALL:
			case TILE_WALL_NORTH:
			case TILE_WALL_SOUTH:
			case TILE_WALL_WEST:
			case TILE_WALL_EAST:
            case TILE_DOOR_COMMON:
            case TILE_DOOR_RARE:
            case TILE_DOOR_EPIC:
            case TILE_STAIRS_UP:
            case TILE_STAIRS_DOWN:
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
            case TILE_PIT_HORIZONTAL_TOP:
            case TILE_TOP_LEFT_PIT_CORNER:
            case TILE_TOP_RIGHT_PIT_CORNER:
                break;
            default:
                collisionDetected = false;
                break;
        }
        return collisionDetected;
    }

    this.tileBehaviorHandler = function() {

        var types = this.collider.checkTileTypes();
        for (var i = 0; i < types.length; i++) {
            switch (types[i]) {
                case TILE_WEB:
                    velX *= ITEM_WEB_FRICTION;
                    velY *= ITEM_WEB_FRICTION;
                    break;
                default:
                    break;
            }
        }
    }
}

function rollItemQuantity(baseItemAmount, capItemAmount, adjustQuantityByPercentage) {
    var totalItems = baseItemAmount;
    while (Math.random() < ITEM_SUCCESS_CHANCE) {
        totalItems++;
    }
    totalItems *= adjustQuantityByPercentage;
    if (totalItems > capItemAmount) {
        totalItems = capItemAmount;
    }
	console.log(totalItems + " Items Dropped");
    return Math.floor(totalItems);
}

function dropItem(x, y, type, angle) {
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var tempItem = new itemClass(x, y, speed, type, angle);
    currentRoom.itemOnGround.push(tempItem);
}

function placeItem(x, y, room, type) {
    var speed = 0;
    var tempItem = new itemClass(x, y, speed, type);
    room.itemOnGround.push(tempItem);
}

function removeAllItemsOfTypeInRoom(item_type)
{
    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        if (currentRoom.itemOnGround[i].type == item_type)
        {
            currentRoom.itemOnGround[i].remove = true;
        }
    }
}

function updateItems() {
    for (var i = currentRoom.itemOnGround.length -1; i >= 0; i--) {
        if (currentRoom.itemOnGround[i].remove) {
            currentRoom.itemOnGround.splice(i, 1);
        } else {
            currentRoom.itemOnGround[i].update();
        }
    }
}

function drawItems() {
    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        currentRoom.itemOnGround[i].draw();
    }
}

function pickUpItems(collider) {
    if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        var item = currentRoom.itemOnGround[i];
        if (item.canBePickedUp && collider.isCollidingWith(item.collider)) {
            item.remove = true;

            switch(item.type) {
                case ITEM_AVOCADO:
                	inventoryItems[4].itemObtained = true;
                    // this.updateKeyReadout();
                    //Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, 'green');
					break;
				/*case ITEM_KEY_RARE:
                	player.inventory.keysRare++; // one more key
                    // this.updateKeyReadout();
                    //Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, '#949494');
					break;*/
				/*case ITEM_KEY_EPIC:
                	player.inventory.keysEpic++; // one more key
                    // this.updateKeyReadout();
                    //Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, '#d8b800');
					break;*/
				case ITEM_POTION:
					if (player.currentHealth < player.maxHealth)
						player.currentHealth++;
                    //Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, 'red');
					break;
				/*case ITEM_CRYSTAL:
					player.enemyHitCount++;
					//Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, 'blue');
					break;*/
				case ITEM_HEART_CONTAINER:
					player.maxHealth +=2;
					player.currentHealth += 2;
					//Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, 'yellow');
                    break;
                case ITEM_ARTIFACT:
                    attackBuff += 0.25;
                    //Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, '#4682B4'); // SteelBlue
                    break;
                case ITEM_FIREBALL_LVL2: //TODO: add booleans to bulletSpell
                    fireballLvl1Upgrade = false;
                    fireballLvl2Upgrade = true;
                    //Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, '#40bf77'); // SeaGreen Modified
                    break;
                case ITEM_FIREBALL_LVL3: //TODO: add booleans to bulletSpell
                    foreballLvl2Upgrade = false;
                    fireballLvl3Upgrade = true;
                    //Sound.play('key_pickup', false, 0.1);
                    particleFX(item.x, item.y, PARTICLES_PER_PICKUP, 'lightblue');
                    break;
            }
        }
    }
}
