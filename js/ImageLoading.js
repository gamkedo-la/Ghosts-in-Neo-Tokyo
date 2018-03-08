var playerPic = document.createElement("img");
var worldPics = [];
var sprites = {}
var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	//console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
		imageLoadingDoneSoAssignInventoryImages();
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
	picsToLoad = imgPayload.length;

	for(var i=0;i<imgPayload.length;i++) {
		if(imgPayload[i].set != undefined, imgPayload[i].set != undefined) {
			beginLoadingImage(imgPayload[i]);
		} else {
			loadImageForWorldCode(imgPayload[i].worldType, imgPayload[i].theFile);
		}
	}
}