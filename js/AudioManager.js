setFormat();
isMuted = false;

var player_jump_SFX = new sfxClipSingle("./audio/player_jump");
var player_hit_SFX = new sfxClipSingle("./audio/player_hit");

function setFormat() {
	var audio = new Audio();
	if (audio.canPlayType("audio/ogg")) {
		audioFormat = ".ogg";
	} else {
		audioFormat = ".mp3";
	}
}

function toggleMute() {
	isMuted = !isMuted;
}

function setMute(TorF) {
	isMuted = TorF;
}

function getMute(TorF) {
	return isMuted;
}