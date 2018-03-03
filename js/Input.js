const USE_DOUBLE_TAP_DASH = false; // still work in progress: a bit buggy
var _DOUBLE_TAP_TIMESPAN = 250; // time in ms between consecutive move presses for DASH
var keyTime = []; // used for double tap detection
keyTime[NORTH] = keyTime[SOUTH] = keyTime[EAST] = keyTime[WEST] = 0; // avoid undefined

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_NUMPAD_0 = 96;
const KEY_NUMPAD_9 = 105;
const KEY_NUMPAD_PLUS = 107;
const KEY_NUMPAD_MINUS = 109;
const KEY_NUMPAD_PERIOD = 110;

const KEY_BACKSPACE = 8
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32; // attack

const KEY_0 = 48; // ???
const KEY_9 = 57; // print room array when in editor mode
const KEY_PLUS = 187; // +1 to current tile id # when in editor mode
const KEY_MINUS = 189; // -1 to current tile id # when in editor mode
const KEY_PERIOD = 190; // ???
const KEY_TILDE = 192; // cheat console

const KEY_W = 87; // move up a room when in editor mode
const KEY_A = 65; // move a room to the left when in editor mode
const KEY_S = 83; // move down a room when in editor mode
const KEY_D = 68; // move a room to the right when in editor mode
const KEY_Q = 81; // move up a floor when in editor mode
const KEY_E = 69; // move down a floor when in editor mode
const KEY_R = 82; // reset currentRoom
const KEY_B = 66; // draw hitboxes
const KEY_C = 67; // draw collision boxes
const KEY_TAB = 9; // tile editor
const KEY_Z = 90; // dash
const KEY_X = 88; // range attack
const KEY_M = 77; // testing raycasting
const KEY_P = 80; // pause update

var mouseX = 0;
var mouseY = 0;
var mouseHeld = false;
var mouseCanvasY = 0;
var mouseCanvasX = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown',function() {
		mousePressed();
	});
	canvas.addEventListener('mouseup',function() {
		mouseReleased();
		editTileOnMouseClick();
	});
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	player.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_X, KEY_Z, KEY_C, KEY_SPACE);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	mouseCanvasX = Math.floor(mouseX * (canvas.width/canvas.clientWidth));
	mouseCanvasY = Math.floor(mouseY * (canvas.height/canvas.clientHeight));

	//console.log('Mouse move: screen='+mouseX+','+mouseY+' canvas='+mouseCanvasX+','+mouseCanvasY);

}

// Note, due to browser silliness, keydown events fire repeatedly while keys are held,
// but keyup fires once as expected, no matter how long you held the key down.
// So we detect in UP event: you dash if you release the movement key twice fast.
function checkDoubleTap(NSEW)
{
	if (!USE_DOUBLE_TAP_DASH) return;
	var now = performance.now();
	var timespan = now - keyTime[NSEW];
	if (timespan < _DOUBLE_TAP_TIMESPAN)
	{
		console.log('DOUBLE TAPPED DIR '+NSEW+' in ' + timespan + 'ms');
		player.dashPending[NSEW] = true; // pending
	}
	keyTime[NSEW] = now;
	// reset others
	if (NSEW!=NORTH) keyTime[NORTH] = 0;
	if (NSEW!=SOUTH) keyTime[SOUTH] = 0;
	if (NSEW!=EAST) keyTime[EAST] = 0;
	if (NSEW!=WEST) keyTime[WEST] = 0;
}

function keySet(keyEvent, setTo) {
	var validGameKey = true;
	if(keyEvent.keyCode == player.controlKeyDash) {
		player.keyHeld_Dash = setTo;
	}else if(keyEvent.keyCode == player.controlKeyLeft || keyEvent.keyCode == player.controlKeyLeftALT) {
		if (!setTo) checkDoubleTap(WEST);
		player.keyHeld_West = setTo;
	}else if(keyEvent.keyCode == player.controlKeyRight || keyEvent.keyCode == player.controlKeyRightALT) {
		if (!setTo) checkDoubleTap(EAST);
		player.keyHeld_East = setTo;
	}else if(keyEvent.keyCode == player.controlKeyUp || keyEvent.keyCode == player.controlKeyUpALT) {
		if (!setTo) checkDoubleTap(NORTH);
		player.keyHeld_North = setTo;
	}else if(keyEvent.keyCode == player.controlKeyDown || keyEvent.keyCode == player.controlKeyDownALT) {
		if (!setTo) checkDoubleTap(SOUTH);
		player.keyHeld_South = setTo;
	}else if(keyEvent.keyCode == player.controlKeyJump){
		player.keyHeld_Jump = setTo;
	}else if(keyEvent.keyCode == player.controlKeyAttack) {
		if (!setTo) checkDoubleTap(ATTACK);
		player.keyHeld_Attack = setTo;
	} else if(keyEvent.keyCode == player.controlKeyRangeAttack) {
		if (!setTo) checkDoubleTap(RANGED_ATTACK);
		player.keyHeld_Ranged_Attack = setTo;
	}else {
		validGameKey = false;
	}
	return validGameKey;
}

function keyPressed(evt) {
	//console.log(evt.keyCode);
	panelKeyCapture(debugPanel, evt);
	//console.log("Key pressed: "+evt.keyCode);
	var validKey = keySet(evt, true);

	var otherKeyPressed = true;
	switch(evt.keyCode) {
		case KEY_TILDE:
			_DEBUG_CHEAT_CONSOLE = !_DEBUG_CHEAT_CONSOLE;
			break;
		case KEY_9:
			copyToClipboard();
			break;
		case KEY_PLUS:
			editTileOnMouseClick();
			break
		case KEY_MINUS:
			editTileReverse();
			break
		case KEY_R:
			resetAllRooms();
			break;
		case KEY_B:
			if(_DEBUG_MODE)
				_DEBUG_DRAW_HITBOX_COLLIDERS = !_DEBUG_DRAW_HITBOX_COLLIDERS;
			break;
		case KEY_C:
			if(_DEBUG_MODE)
				_DEBUG_DRAW_TILE_COLLIDERS = !_DEBUG_DRAW_TILE_COLLIDERS;
			break;
		case KEY_TAB:
			break;
		case KEY_W:
			if(!_DEBUG_MODE)
				break
			console.log("Room change North");
			currentRoomRow--;
			loadLevel(roomCoordToVar);
			break;
		case KEY_A:
			if(!_DEBUG_MODE)
				break
			console.log("Room change West");
			currentRoomCol--;
			loadLevel(roomCoordToVar);
			break;
		case KEY_M:
			console.log("arrayIndex: " + raycastingForPlayer() + " tileType: " + worldGrid[raycastingForPlayer()]);
			break;
		case KEY_S:
			if(!_DEBUG_MODE)
				break
			console.log("Room change South");
			currentRoomRow++;
			loadLevel(roomCoordToVar);
			break;
		case KEY_D:
			if(!_DEBUG_MODE)
				break
			console.log("Room change East");
			currentRoomCol++;
			loadLevel(roomCoordToVar);
			break;
		case KEY_Q:
			if(!_DEBUG_MODE)
				break

			console.log("Floor change Up");
			currentFloor++;
			loadLevel(roomCoordToVar);

			break;
		case KEY_E:
			if(!_DEBUG_MODE)
				break
			console.log("Floor change Down");
			currentFloor--;
			loadLevel(roomCoordToVar);
			break;
		case KEY_P: 
			paused = !paused;
			break;
		case KEY_LEFT_ARROW:
			moveInventory('left');
			break;
		case KEY_UP_ARROW:
			moveInventory('up');
			break;
		case KEY_RIGHT_ARROW:
			moveInventory('right');
			break;
		case KEY_DOWN_ARROW:
			moveInventory('down');
			break;
		default:
			otherKeyPressed=false;
			break;
	}
	if(otherKeyPressed) {
		validKey = true;
	}

	if(validKey){
		evt.preventDefault();
	}
}

function keyReleased(evt) {
	//console.log("Key released: "+evt.keyCode);
	keySet(evt, false);
}

function mousePressed(evt)
{
	mouseHeld = true;
}

function mouseReleased(evt)
{
	mouseHeld = false;
}
