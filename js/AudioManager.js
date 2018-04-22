setFormat();
isMuted = false;

//declare sound assets
var player_jump_SFX = new sfxClipSingle("./audio/player_jump");
var player_hit_SFX = new sfxClipSingle("./audio/player_hit");
var player_hit_ground_SFX = new sfxClipSingle("./audio/player_hit_ground");
var sword_attack_SFX = new sfxClipSingle("./audio/sword_attack");
var ghast_laugh_crackly_clip = new sfxClipSingle("./audio/ghost_laugh_crackly");
var ghast_laugh_clip = new sfxClipSingle("./audio/ghost_laugh");
var ghast_laugh_SFX = new sfxContainerRandom([ghast_laugh_crackly_clip, ghast_laugh_clip]);

var level1_stage_track = new musicTrackLoopingWTail("./audio/bg_track_witch_level", 115.555);  //By Klaim
var level1_dialog_track = new musicTrackLoopingWTail("./audio/bg_track_witch_boss_talking", 35.555);  //By Klaim
var level1_boss_track = new musicTrackLoopingWTail("./audio/bg_track_witch_boss_fighting", 97.777);  //By Klaim
var level2_stage_track = new musicTrackLoopingWTail("./audio/Newage3", 102.222);  //By Vignesh
var level2_dialog_track = new musicTrackLoopingWTail("./audio/bg_track_witch_boss_talking", 42.222);  //Coming from Axis~~~
var level2_boss_track = new musicTrackLoopingWTail("./audio/bg_track_witch_boss_fighting", 97.777);  //Coming from Klaim~~~
var level3_stage_track = new musicTrackLoopingWTail("./audio/bg_track_witch_level", 115.555);  //Coming from Klaim~~~~~~~~~
var level3_dialog_track = new musicTrackLoopingWTail("./audio/Scarydialog", 17.777);  //By Vignesh
var level3_boss_track = new musicTrackLoopingWTail("./audio/ghosts-by-Vignesh", 68.888);  //By Vignesh
var menu_track = new musicTrackLoopingWTail("./audio/bg_track_menu", 53.333);  //By RyantheLou
var gpa_dialog_track = new musicTrackLoopingWTail("./audio/dawn_of_the_autumn_leaves_NoRain", 62.222);  //By Kise
var cat_dialog_track = new musicTrackLoopingWTail("./audio/baron_temp_theme", 12.777);  //By Kise

var master_bgm = new musicContainerCrossfade([menu_track, gpa_dialog_track]);

player_jump_SFX.setVolume(0.5);
player_hit_SFX.setVolume(0.5);
player_hit_ground_SFX.setVolume(0.5);
sword_attack_SFX.setVolume(0.5);
ghast_laugh_crackly_clip.setVolume(0.6);
ghast_laugh_clip.setVolume(0.6);

master_bgm.setVolume(1);

level1_stage_track.setMixVolume(1);
level1_dialog_track.setMixVolume(0.65);
level1_boss_track.setMixVolume(0.5);
level2_stage_track.setMixVolume(0.78);
level2_dialog_track.setMixVolume(0.65);
level2_boss_track.setMixVolume(0.5);
level3_stage_track.setMixVolume(1);
level3_dialog_track.setMixVolume(1);
level3_boss_track.setMixVolume(0.9);
menu_track.setMixVolume(0.53);
gpa_dialog_track.setMixVolume(0.9);
cat_dialog_track.setMixVolume(0.65);

level1_stage_track.setVolume(0);
level1_dialog_track.setVolume(0);
level1_boss_track.setVolume(0);
level2_stage_track.setVolume(0);
level2_dialog_track.setVolume(0);
level2_boss_track.setVolume(0);
level3_stage_track.setVolume(0);
level3_dialog_track.setVolume(0);
level3_boss_track.setVolume(0);
gpa_dialog_track.setVolume(0);
cat_dialog_track.setVolume(0);

gpa_dialog_track.setTrackName("Gpa");
cat_dialog_track.setTrackName("Cat");

//hook ups for GiNT
function updateCurrentTracks(boss = false) {
	var levelNames = ["Level1", "Level2", "Level3"]
	var trackIndex = [[level1_stage_track, level1_dialog_track, level1_boss_track],
	[level2_stage_track, level2_dialog_track, level2_boss_track],
	[level3_stage_track, level3_dialog_track, level3_boss_track]];

	for (var i in levelNames) {
		if (currentRoomName == levelNames[i]) {
			if (boss) {
				master_bgm.loadTrackWithCrossfade(trackIndex[i][2], 0, 1);
			} else {
				master_bgm.loadTrackWithCrossfade(trackIndex[i][0], 0, 1);
			}

			master_bgm.loadTrackWithCrossfade(trackIndex[i][1], 1, 1);
		}
	}

}

//general audio functions
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
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function setMute(TorF) {
	isMuted = TorF;
	SFXVolumeManager.updateVolume();
	MusicVolumeManager.updateVolume();
}

function getMute(TorF) {
	return isMuted;
}



//Time Manager
const REMOVE = 0; // Arrayformat [REMOVE]
const FADE = 1; // Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
const TIMER = 2; // Arrayformat [TIMER, track, endTime, callSign]
const STOP = 3; // Arrayformat [STOP, track, endTime]

var AudioEventManager = new audioEventManager();

function audioEventManager() {
	var eventList = [];
	var now = Date.now();

	this.returnEventList = function () {
		return eventList;
	}

	this.updateEvents = function () {
		now = Date.now();
		runList();
		cleanupList();
	}

	this.addFadeEvent = function (track, duration, endVol) {
		var check = checkListFor(FADE, track);
		var endTime = duration * 1000 + now;
		var startVolume = track.getVolume();
		//console.log("Adding Fade Event for " + track.getTrackName());

		if (check == "none") {
			eventList.push([FADE, track, now, endTime, startVolume, endVol, false]);
		} else {
			eventList[check] = [FADE, track, now, endTime, startVolume, endVol, false];
		}
	}

	this.addCrossfadeEvent = function (track, duration, endVol) {
		var check = checkListFor(FADE, track);
		var endTime = duration * 1000 + now;
		var startVolume = track.getVolume();
		//console.log("Adding Fade Event for " + track.getTrackName());

		if (check == "none") {
			eventList.push([FADE, track, now, endTime, startVolume, endVol, true]);
		} else {
			eventList[check] = [FADE, track, now, endTime, startVolume, endVol, true];
		}
	}

	this.addTimerEvent = function (track, duration, callSign = "none") {
		var thisTrack = track;
		var check = checkListFor(TIMER, thisTrack, callSign);
		var endTime = (duration * 1000) + now;
		//var endTime = (thisTrack.getDuration() - thisTrack.getTime()) * 1000 + now;

		if (check == "none") {
			//console.log("Adding Timer Event for " + track.getTrackName());
			eventList.push([TIMER, track, endTime, callSign]);
		} else {
			eventList[check] = [TIMER, track, endTime, callSign];
		}
	}

	this.addStopEvent = function (track, duration) {
		var thisTrack = track;
		var check = checkListFor(STOP, thisTrack);
		var endTime = (duration * 1000) + now;
		//var endTime = (thisTrack.getDuration() - thisTrack.getTime()) * 1000 + now;

		if (check == "none") {
			//console.log("Adding Stop Event for " + track.getTrackName());
			eventList.push([STOP, track, endTime]);
		} else {
			eventList[check] = [STOP, track, endTime];
		}
	}

	this.removeStopEvent = function (track) {
		var thisTrack = track;
		var check = checkListFor(STOP, thisTrack);

		if (check == "none") {
			return;
		} else {
			//console.log("Removing Stop Event for " + track.getTrackName());
			eventList[check] = [REMOVE];
		}
	}

	function runList() {
		for (var i = 0; i < eventList.length; i++) {
			if (eventList[i][0] == FADE) {
				// Arrayformat [FADE, track, startTime, endTime, startVolume, endVolume, crossfade]
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() == false) {
					if (eventList[i][6]) {
						if (eventList[i][4] < eventList[i][5]) {
							thisTrack.setVolume(scaleRange(0, 1, eventList[i][4], eventList[i][5],
								Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 0, 1, now), 0.5)));
						} else {
							thisTrack.setVolume(scaleRange(1, 0, eventList[i][4], eventList[i][5],
								Math.pow(interpolateFade(eventList[i][2], eventList[i][3], 1, 0, now), 0.5)));
						}
					} else {
						thisTrack.setVolume(interpolateFade(eventList[i][2], eventList[i][3], eventList[i][4], eventList[i][5], now));
					}
					if (eventList[i][3] < now) {
						//console.log("Ending Fade Event for " + thisTrack.getTrackName());
						eventList[i] = [REMOVE];
					}
				}
			}
			if (eventList[i][0] == TIMER) {
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() == false) {
					if (eventList[i][2] <= now) {
						//console.log("Ending Timer Event for " + thisTrack.getTrackName());
						eventList[i] = [REMOVE];
						thisTrack.triggerTimerEnded(eventList[i][3]);
					}
				} else {
					eventList[i] = [REMOVE];
				}
			}
			if (eventList[i][0] == STOP) {
				thisTrack = eventList[i][1];
				if (thisTrack.getPaused() == false) {
					if (eventList[i][2] <= now) {
						//console.log("Executing Stop Event for " + thisTrack.getTrackName());
						eventList[i] = [REMOVE];
						thisTrack.stop();
					}
				}
			}
		}

	}

	function cleanupList() {
		eventList.sort(function (a, b) { return b - a });
		while (eventList[eventList.length - 1] == REMOVE) {
			eventList.pop();
		}
	}

	function checkListFor(eventType, track, callSign = "") {
		var foundItem = false;
		for (var i = 0; i < eventList.length; i++) {
			if (eventList[i][0] == eventType) {
				if (eventList[i][1] == track) {
					if (eventType == TIMER && eventList[i][3] == callSign) {
						foundItem = true;
						return i;
					} else if (eventType != TIMER) {
						foundItem = true;
						return i;
					}
				}
			}
		}
		if (!foundItem) {
			return "none";
		}
	}
}

function interpolateFade(startTime, endTime, startVolume, endVolume, currentTime) {
	/*
	x1 = startTime
	y1 = startVolume

	x2 = endTime
	y2 = endVolume

	x = currentTime
	y = y1 + (x - x1)((y2 - y1)/(x2 - x1))
    currentVolume = startVolume + (now - startTime) * ((endVolume - startVolume) / (endTime - startTime))
	*/
	if (currentTime > endTime) { currentTime = endTime; }
	var currentVolume = startVolume + (currentTime - startTime) * ((endVolume - startVolume) / (endTime - startTime));

	return currentVolume;
}

function scaleRange(inputStart, inputEnd, outputStart, outputEnd, value) {
	var scale = (outputEnd - outputStart) / (inputEnd - inputStart);
	return outputStart + ((value - inputStart) * scale);
}