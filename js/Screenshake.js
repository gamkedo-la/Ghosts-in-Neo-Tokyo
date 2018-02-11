// SCREENSHAKE - a simple html element wiggler for "juice"
// made for gamkedo with love from mcfunkypants

var screen_shakes = 0; // frames of screenshake used as player feedback for when we take damage
var screen_shake_pivot_x = 0;
var screen_shake_pivot_y = 0;
var screen_shake_me = document.body;//getElementById('gameCanvas');
var original_css = null;

var MAX_SCREEN_SHAKES = 30;
var MAX_SCREEN_SHAKE_SIZE_PX = 20;
var CSS_PROPERTY_TO_SHAKE = "margin"; // could be padding, margin, left etc

function screenShake(howmany)
{
	//console.log('screenshake ' + howmany);
	if (!screen_shake_me)
	{
		console.log('ERROR: screenshake does not know which html element to shake!')
		return;
	}

	screen_shake_pivot_x = 0;
	screen_shake_pivot_y = 0;
	screen_shakes += howmany;

	// max out at a reasonable value to avoid infini-shake in tight loops
	if (screen_shakes>MAX_SCREEN_SHAKES)
		screen_shakes=MAX_SCREEN_SHAKES;
}

function updateScreenshake()
{
	if (!screen_shake_me) return; // sanity check

	if (screen_shakes>0)
	{
		if (original_css==null) // remember initial setting
			original_css = screen_shake_me.style[CSS_PROPERTY_TO_SHAKE];

		var shakesize = screen_shakes / 2;
		if (shakesize > MAX_SCREEN_SHAKE_SIZE_PX) 
			shakesize = MAX_SCREEN_SHAKE_SIZE_PX;

		// shake around a pivot point
		screen_shake_me.style[CSS_PROPERTY_TO_SHAKE] = "" + (screen_shake_pivot_x + Math.round((Math.random() * shakesize) - shakesize / 2) * 2) + 
					"px " + (screen_shake_pivot_y + Math.round((Math.random() * shakesize) - shakesize / 2) * 2) + "px";

		screen_shakes--;
		//console.log('screen_shakes:'+screen_shakes);

		// about to finish? return to where we were when we started
		if (screen_shakes < 1)
		{
			//console.log('screenshakes done. going back to original position.')
			screen_shake_me.style[CSS_PROPERTY_TO_SHAKE] = original_css; //"0";
		}
	}
}

function resetScreenShake(){
	screen_shakes = 0; // frames of screenshake used as player feedback for when we take damage
	screen_shake_pivot_x = 0;
	screen_shake_pivot_y = 0;
	screen_shake_me = document.getElementById('gameCanvas');
}
