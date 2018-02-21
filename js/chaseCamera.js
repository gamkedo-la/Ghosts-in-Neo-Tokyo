// chaseCamera.js by McFunkypants - made with love for Gamkedo

// a work in progress platformer chase camera that follows the "best practises" outlined at:
// https://www.gamasutra.com/blogs/JochenHeizmann/20171127/310386/Camera_Logic_in_a_2D_Platformer.php
// https://www.gamasutra.com/blogs/ItayKeren/20150511/243083/Scroll_Back_The_Theory_and_Practice_of_Cameras_in_SideScrollers.php

var cameraX = null;
var cameraY = null;
var cameraLastFloorY = 0; // no vertical scrolling when in the air, like SMW/Sonic etc
var cameraCenterTolerance = 100; // how far horizontally we can move with no scroll required
var cameraYScollSpeed = 1; // smooth vert scroll if inside region and on a platform
var cameraYOffset = -16; // pixels away from centered, eg eye height

function scrollCamera() {
    
    // grab game-specific data, may need fixes if we change things elsewhere:
    var playerX = Math.round(player.x);
    var playerY = Math.round(player.x) + cameraYOffset; // the foot Y
    var onGround = (player.motionState == "Grounded");
    var screenW = Math.round(WORLD_W * WORLD_COLS);
    var screenH = Math.round(WORLD_H * WORLD_ROWS);
    
    // everything below this line doesn't depend on code in other files
    var halfW = Math.round(screenW/2);
    var halfH = Math.round(screenH/2);

    // first update ever? move instantly
    if (cameraX==null)
    {
        console.log('Warping camera to player!');
        cameraX = playerX - halfW;
        cameraY = playerY - halfH;
        cameraLastFloorY = cameraY;
    }

    // define region we don't need to scroll in
    var rightEdge = cameraX + halfW + cameraCenterTolerance;
    var leftEdge = cameraX - halfW - cameraCenterTolerance;
    var topEdge = cameraY - halfH - cameraCenterTolerance;
    var bottomEdge = cameraY + halfH + cameraCenterTolerance;
    
    // keep player inside a region, but don't scroll on tiny moves
    if (playerX>rightEdge) { cameraX=rightEdge; console.log('camera right!'); }
    if (playerX<leftEdge) { cameraX=leftEdge; console.log('camera left!'); }
    if (playerY>bottomEdge) { cameraY=bottomEdge; console.log('camera down!'); }
    if (playerY<topEdge) { cameraY=topEdge; console.log('camera up!'); }

    // smoothly scroll vertically only if we are not in mid air
    if (onGround)
    {
        cameraLastFloorY = playerY;
        if (cameraY<cameraLastFloorY) cameraY += cameraYScollSpeed; // fixme: if smaller distance than speed it will overshoot and wobble
        if (cameraY>cameraLastFloorY) cameraY -= cameraYScollSpeed;
    }


    // debug only
    console.log('CAMERA DEBUG: rltb: '+rightEdge+','+leftEdge+','+topEdge+','+bottomEdge
        +' plr:'+playerX+','+playerY+' '+(onGround ? '[on ground]' : '[in air]')
        +' cam:'+cameraX+','+cameraY);

}

