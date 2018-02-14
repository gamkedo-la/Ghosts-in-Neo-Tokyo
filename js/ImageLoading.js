var playerPic = document.createElement("img");
var worldPics = [];
var sprites = {}
var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	//console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(data) {
	var set = data.set;
	var name = data.name;

	if(!sprites[set]){
		sprites[set] = {}
	}
	sprites[set][name] = document.createElement("img");
	sprites[set][name].onload = countLoadedImagesAndLaunchIfReady;
	sprites[set][name].src = "img/"+ data.fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	worldPics[worldCode].onload = countLoadedImagesAndLaunchIfReady;
	worldPics[worldCode].src = "img/"+ fileName;
}

function loadImages() {
	var imageList = [
		{set: "Player", name: "stand", fileName: "MainChar/Char_Animation 1.png"},
		{set: "Player", name: "walkSouth", fileName: "MainChar/Char_Animation 2.png"},
		{set: "Player", name: "walkWest", fileName: "MainChar/Char_Animation 3.png"},
		{set: "Player", name: "walkEast", fileName: "MainChar/Char_Animation 4.png"},
		{set: "Player", name: "attackDown", fileName: "MainChar/Char_Animation 5.png"},
		{set: "Concept", name: "background1", fileName: "Concept.png"},
		// {set: "Player", name: "walkSouth", fileName: "MainChar/playerchar_Walk South.png"},
		// {set: "Player", name: "walkEast", fileName: "MainChar/playerchar_Walk East.png"},
		// {set: "Player", name: "walkNorth", fileName: "MainChar/playerchar_Walk North.png"},
		// {set: "Player", name: "walkWest", fileName: "MainChar/playerchar_Walk West.png"},
		// {set: "Player", name: "anchorAttack", fileName: "MainChar/Anchor Attack.png"},

		// {set: "HeroBoss", name: "Stand", fileName: "HeroBoss/Boss_stand.png"},
		

		// {set: "Ending", name: "tempEndScreen", fileName: "temp-endscreen.png"},
		// {set: "OPENING", name: "tempOpening", fileName: "playtest splash.png"},
		// {set: "OPENING", name: "controls", fileName: "Controls Screen.png"},
		// {set: "OPENING", name: "cursor", fileName: "cursor.png"},
		
		// {set: "Credits", name: "page1", fileName: "Credits/Page1.png"},
		// {set: "Credits", name: "page2", fileName: "Credits/Page2.png"},
		// {set: "Credits", name: "page3", fileName: "Credits/Page3.png"},
		// {set: "Credits", name: "page4", fileName: "Credits/Page4.png"},

		{worldType: TILE_EMPTY, theFile: "Tiles/world_nothingness.png"},
		{worldType: TILE_WALL, theFile: "Tiles/world_ground.png"},

		
	];

	picsToLoad = imageList.length;

	for(var i=0;i<imageList.length;i++) {
		if(imageList[i].set != undefined, imageList[i].set != undefined) {
			beginLoadingImage(imageList[i]);
		} else {
			loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
		}
	}
}
