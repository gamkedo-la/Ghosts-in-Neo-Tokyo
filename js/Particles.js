const MIN_DECAY_TIME = .25;
const MAX_DECAY_TIME = .50;
const MIN_PARTICLE_SPEED = .1;
const MAX_PARTICLE_SPEED = 1;
const PARTICLE_SIZE = 1;
const DEFAULT_GRAVITY = .03;

var particle = [];

function particleClass(posX, posY, color, optionalVelX, optionalVelY, optionalLifespan, optionalGravity) {

    var x = posX;
    var y = posY;
    var size = PARTICLE_SIZE;
    var decayTimer = MIN_DECAY_TIME + Math.random() * MAX_DECAY_TIME;
    var speed = MIN_PARTICLE_SPEED + Math.random() * MAX_PARTICLE_SPEED;
    var angle = (Math.random() * Math.PI * 2);
    var velX = optionalVelX || Math.cos(angle) * speed;
    var velY = optionalVelY || Math.sin(angle) * speed;
    var color = color;
    var gravity = DEFAULT_GRAVITY;

    // maybe override defaults
    if (optionalVelX!=undefined) velX = optionalVelX;
    if (optionalVelY!=undefined) velY = optionalVelY;
    if (optionalLifespan!=undefined) decayTimer = optionalLifespan;
    if (optionalGravity!=undefined) gravity = optionalGravity;
    
    // var red = Math.round(Math.random() * 255);
    // var blue = Math.round(Math.random() * 255);
    // var green = Math.round(Math.random() * 255);
    // var color = "rgb(" + red + "," + blue + "," + green + ")";


    this.remove = false;

    this.update = function() {
        decayTimer -= TIME_PER_TICK;
        if (decayTimer <= 0) {
            this.remove = true;
        }


        x += velX;
        y += velY;
        velY += gravity;
    }

    this.draw = function() {
        colorRect(x, y, size, size, color);
    }
}

function updateParticles() {
    for (var i = 0; i < particle.length; i++) {
        particle[i].update();
    }
    for (var i = particle.length -1; i >= 0; i--) {
        particle[i].update();
        if (particle[i].remove) {
            particle.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (var i = 0; i < particle.length; i++) {
        particle[i].draw();
    }
}

// spawn multiple particles
function particleFX(x, y, num, color, optionalVelX, optionalVelY, optionalLifespan, optionalGravity, optionalVelocityRandomness)
{
    optionalVelocityRandomness = optionalVelocityRandomness || 0;
    for (var i = 0; i < num; i++) {
        var wobbleX = optionalVelX + (Math.random() * optionalVelocityRandomness - (optionalVelocityRandomness/2));
        var wobbleY = optionalVelY + (Math.random() * optionalVelocityRandomness - (optionalVelocityRandomness/2));
        particle.push(new particleClass(x, y, color, optionalVelX?wobbleX:optionalVelX, optionalVelY?wobbleY:optionalVelY, optionalLifespan, optionalGravity));
    }
}
