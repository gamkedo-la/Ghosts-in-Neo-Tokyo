const WALL_JUMP_VERTICAL_REVERSE_SPEED = 5;
const WALL_JUMP_HORIZONTAL_REVERSE_SPEED = 5;
const WALL_JUMP_MAX_TIME = 25;
var wallJumpTime;

    if(wallJumpTime > 0) {
        if(playerClass.controlKeyRight || playerClass.controlKeyLeft) { // still holding on
            wallJumpTime--; // but losing grip
            console.log("wall jump time : " + wallJumpTime);
        } else { // released the wall
            wallJumpTime = 0;
    }
        if (playerClass.controlKeyJump) { // jumps off wall
            wallJumpTime = 0;
			playerClass.motionState = "Jumping";
            playerClass.vy = -WALL_JUMP_HORIZONTAL_REVERSE_SPEED;
            }
        }
