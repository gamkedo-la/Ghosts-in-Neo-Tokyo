const X_AXIS = "x";
const Y_AXIS = "y";
const COLLISION_CHECKS_PER_TICK = 5;
var _DEBUG_DRAW_TILE_COLLIDERS = true;
var _DEBUG_DRAW_HITBOX_COLLIDERS = true;

function boxColliderClass(x, y, width, height, offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.width = width;
    this.height = height;
    this.x = x + this.offsetX;
    this.y = y + this.offsetY;
    this.box = {};

    this.setCollider = function(posX, posY) {

		this.box.topLeft = {
			x: posX - this.width/2 + this.offsetX,
			y: posY - this.height/2 + this.offsetY
		}

		this.box.topRight = {
			x: posX + this.width/2 + this.offsetX,
			y: posY - this.height/2 + this.offsetY
		}

		this.box.bottomLeft = {
			x: posX - this.width/2 + this.offsetX,
			y: posY + this.height/2 + this.offsetY
		}

		this.box.bottomRight = {
            x: posX + this.width/2 + this.offsetX,
			y: posY + this.height/2 + this.offsetY
    	}
        this.x = posX + this.offsetX;
        this.y = posY + this.offsetY;
	}
    this.setCollider(x, y);

    this.isCollidingWith = function(otherCollider) {
        var myLeft = this.box.topLeft.x;
        var myRight = this.box.topLeft.x + this.width;
        var myTop = this.box.topLeft.y;
        var myBottom = this.box.topLeft.y + this.height;
        var theirLeft = otherCollider.box.topLeft.x;
        var theirRight = otherCollider.box.topLeft.x + otherCollider.width;
        var theirTop = otherCollider.box.topLeft.y;
        var theirBottom = otherCollider.box.topLeft.y + otherCollider.height;
        return ((myLeft > theirRight || // I'm right of them
                myRight < theirLeft  || // I'm left of them
                myTop > theirBottom  || // I'm below them
                myBottom < theirTop) // I'm above them
                == false); // if none of the above are true, boxes don't overlap
        // NOTE(Cipherpunk): Thanks, Chris!
    }

    this.update = function(posX, posY) {
        this.setCollider(posX, posY);
    }

    this.draw = function(color) {
        canvasContext.strokeStyle = color;
        canvasContext.lineWidth = 1;
        var x = Math.floor(this.box.topLeft.x) + .5;
        var y = Math.floor(this.box.topLeft.y) + .5;
        canvasContext.strokeRect(x, y, this.width, this.height);
    }

    this.checkTileTypes = function() {
        var uniqueTileTypes = [];
        for (var corner in this.box) {
            var x = this.box[corner].x;
            var y = this.box[corner].y;
            var tileIndex = getTileIndexAtPixelCoord(x, y);

            if (uniqueTileTypes.indexOf(worldGrid[tileIndex]) == -1) {
                uniqueTileTypes.push(worldGrid[tileIndex]);
            }
        }
        return uniqueTileTypes;
    }

    // NOTE(Cipherpunk): See template below to add to class
    this.moveOnAxis = function(objectToMove, velocity, axis) {
        var collisionDetected = false;

        if (velocity == 0) {
            return collisionDetected;
        }

        var checksPerTick = COLLISION_CHECKS_PER_TICK;
        var movePerCheck = velocity/checksPerTick;
        while (Math.abs(movePerCheck) < 1 && checksPerTick > 1) {
            checksPerTick--;
            movePerCheck = velocity/checksPerTick;
        }

        for (var i = 0; i < checksPerTick; i++) {

            objectToMove[axis] += movePerCheck;
            objectToMove.updateColliders();

            for (var corner in this.box) {
                var x = this.box[corner].x;
                var y = this.box[corner].y;
                var tileIndex = getTileIndexAtPixelCoord(x, y);

                collisionDetected = objectToMove.collisionHandler(tileIndex);

                if (collisionDetected) {
                    this.snapObjectToTileEdge(objectToMove, velocity, axis, tileIndex);
                    return collisionDetected;
                }
            }
        }
        return collisionDetected;
    }

    this.snapObjectToTileEdge = function(objectToMove, velocity, axis, tileIndex) {
        var tileEdge = calculateTopLeftCoordOfTileIndex(tileIndex);
        var snapPoint;

        if (axis == X_AXIS) {
            if (velocity > 0) {
                snapPoint = tileEdge.x - this.width/2 - this.offsetX - 1;
            } else if (velocity < 0) {
                snapPoint = tileEdge.x + WORLD_W + this.width/2 - this.offsetX;
            }
        } else if (axis == Y_AXIS) {
            if (velocity > 0) {
                snapPoint = tileEdge.y - this.height/2 - this.offsetY - 1;
            } else if (velocity < 0) {
                snapPoint = tileEdge.y + this.height/2 + WORLD_H - this.offsetY;
            }
        }
        objectToMove[axis] = snapPoint;
        objectToMove.updateColliders();
    }
    
    this.snapObjectToColliderEdge = function(objectToMove, velocity, axis, collider) {
	    var colliderEdge = {x: collider.x, y: collider.y};
	    var snapPoint;
	    
	    if (axis == X_AXIS) {
		    if (velocity > 0) {
                snapPoint = colliderEdge.x - objectToMove.tileCollider.width - collider.width/2 - 1;
            } else if (velocity < 0) {
                snapPoint = colliderEdge.x + objectToMove.tileCollider.width + collider.width/2 + 1;
            }
	    } else if (axis == Y_AXIS) {
		    if (velocity > 0) {
                snapPoint = colliderEdge.y - collider.height/2 - this.offsetY - 1;
            } else if (velocity < 0) {
                snapPoint = colliderEdge.y + collider.height/2 - this.offsetY;
            }
	    }
	    
	    objectToMove[axis] = snapPoint;
        objectToMove.updateColliders();
    }
}

function calculateAngleFrom(object1, object2) {
    var x1 = object1.x;
    var x2 = object2.x;
    var y1 = object1.y;
    var y2 = object2.y;
    var angle = Math.atan2(y2-y1,x2-x1);
    return angle;
}

function calculateTopLeftCoordOfTileIndex(tileIndex) {
    var topLeftX = (tileIndex % WORLD_COLS) * WORLD_W;
    var topLeftY = Math.floor(tileIndex / WORLD_COLS) * WORLD_H;
    return {
        x: topLeftX,
        y: topLeftY
    };
}

function calculateCenterCoordOfTileIndex(tileIndex) {
    var topLeftX = (tileIndex % WORLD_COLS) * WORLD_W;
    var topLeftY = Math.floor(tileIndex / WORLD_COLS) * WORLD_H;
    var centerX = topLeftX + WORLD_W/2;
    var centerY = topLeftY + WORLD_H/2;
    return {
        x: centerX,
        y: centerY
    };
}

/* NOTE(Cipherpunk): Below is a template to add to each class
   so that it can use moveOnAxis().
   Cases that are not needed can be deleted from switch statements.

this.updateColliders = function() {
    this.collider.update(this.x, this.y);
    // More colliders can be added here.
}

// used for behaviors that should only be called once per tick
this.tileBehaviorHandler = function() {
    for (var i = 0; i < this.uniqueTileTypes.length; i++) {
        switch (collidedWithTheseTileTypes[i]) {
            case TILE_GROUND:
                break;
            case TILE_WALL:
                break;
            case TILE_OOZE:
                break;
            case TILE_WEB:
                break;
            case TILE_DOOR:
                break;
            default:
                break;
        }
    }
    this.uniqueTileTypes = [];
}

// used mainly to handle wall collision but has other uses
this.collisionHandler = function(tileIndex) {
    var collisionDetected = true;
    var tileType = worldGrid[tileIndex];
    switch(tileType) {
        case TILE_GROUND:
        case TILE_SKULL:
        case TILE_DOOR:
        case TILE_WALL:
        default:
            collisionDetected = false;
            break;
    }
    return collisionDetected;
}
*/
