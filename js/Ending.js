var endScreen
function ending(){
	paused = true;
	endScreen = new spriteClass();
	endScreen.setSprite(sprites.Ending.tempEndScreen,
						  320, 180,
						  1, 1, true);
	setInterval(drawEnding, 1000/FRAMES_PER_SECOND);
}

function drawEnding(){
	endScreen.draw(160,90);
}

var splashScreen
var splashInterval
var cursor
var currentScreen = "none"
var currentSelection = "none"
var currentPage = 0
function splash() {
	Sound.playUnlessAlreadyPlaying("mage_hook_chiptune_menu_melody",true,MUSIC_VOLUME);
	paused = true;
	currentScreen = "splash"
	currentSelection = "play"
	splashScreen = new spriteClass();
	splashScreen.setSprite(sprites.OPENING.tempOpening,
		320, 180,
		1, 1, true);

	cursor = new spriteClass();
	cursor.setSprite(sprites.OPENING.cursor,
		32, 32,
		1, 1, true);

	cursor.x = 120
	cursor.y = 128
	splashInterval = setInterval(drawSplash, 1000/FRAMES_PER_SECOND);
	document.addEventListener('keydown', startEmUP);

	//load screens up only after they've been put in memory.
	creditsScreens = []
	creditsScreens.push(sprites.Credits.page1);
	creditsScreens.push(sprites.Credits.page2);
	creditsScreens.push(sprites.Credits.page3);
	creditsScreens.push(sprites.Credits.page4);
}

function startEmUP(evt){
	evt.preventDefault()
	switch(evt.keyCode) {
		case KEY_ENTER:
		case KEY_SPACE:
			if(currentScreen == "splash" && currentSelection == "play"){
				currentScreen = "controls"
				splashScreen.setSprite(sprites.OPENING.controls,
								  320, 180,
								  1, 1, true);
				return;
			}

			if(currentScreen == "splash" && currentSelection == "credits"){
				
				cursor.draw(-666, -666);
				clearInterval(splashInterval)
				document.removeEventListener('keydown',
			        startEmUP,
			        false
			    );
			    CreditsRun();
				return;
			}

			if(currentScreen == "controls"){
				clearInterval(splashInterval)
				paused = false;
				runThatGame();
				document.removeEventListener('keydown',
			        startEmUP,
			        false
			    );
			    return;
			}
		break;
		case KEY_W:
		case KEY_UP_ARROW:
			cursor.x = 120
			cursor.y = 128
			currentSelection = "play"
		break;
		case KEY_DOWN_ARROW:
		case KEY_S:
			cursor.x = 120
			cursor.y = 151
			currentSelection = "credits"
		break;
	}	
}

function drawSplash(){
	splashScreen.draw(160,90);
	if(currentScreen == "splash"){
		cursor.draw(cursor.x, cursor.y);
	}
	//console.log("draw") // this runs every frame
}
var creditsScreens = [
];

function CreditsRun(){
	splashInterval = setInterval(CreditsDraw, 1000/FRAMES_PER_SECOND);
	document.addEventListener('keydown', creditsInput);
	currentPage = 0;
	splashScreen.setSprite(creditsScreens[currentPage],
				320, 180,
				1, 1, true);
}

function CreditsDraw(){
	splashScreen.draw(160,90);
}

function creditsInput(evt){
	evt.preventDefault()
	switch(evt.keyCode) {
		case KEY_ENTER:
		case KEY_SPACE:
			// if(currentScreen == "splash" && currentSelection == "play"){
			// 	currentScreen = "controls"
			// 	splashScreen.setSprite(sprites.OPENING.controls,
			// 					  320, 180,
			// 					  1, 1, true);
			// 	return;
			// }

			// if(currentScreen == "credits" && currentSelection == "play"){
			// 	currentScreen = "credits"
			// 	clearInterval(splashInterval);
			// 	document.removeEventListener('keydown',
			//         startEmUP,
			//         false
			//     );
			// 	return;
			// }

			// if(currentScreen == "controls"){
			// 	clearInterval(splashInterval)
			// 	paused = false;
			// 	runThatGame();
			// 	document.removeEventListener('keydown',
			//         startEmUP,
			//         false
			//     );
			//     return;
			// }
			break;

		case KEY_D:
		case KEY_RIGHT_ARROW:
			if(currentPage < creditsScreens.length - 1){
				currentPage += 1;
			} 
			splashScreen.setSprite(creditsScreens[currentPage],
				320, 180,
				1, 1, true);
			break;
		case KEY_A:
		case KEY_LEFT_ARROW:
		
			if(currentPage > 0){
				currentPage -= 1;
			} else {
				currentPage = 0;
				clearInterval(splashInterval)
				document.removeEventListener('keydown',
			        creditsInput,
			        false
			    );
			    splash()
			    return;
			}
			splashScreen.setSprite(creditsScreens[currentPage],
				320, 180,
				1, 1, true);
			break;
	}	
}