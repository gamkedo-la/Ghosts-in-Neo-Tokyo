//General
var isMuted = false;

//SFX Classes
var sfxVolume = 1;
SFXVolumeManager = new sfxVolumeManager();
function sfxVolumeManager() {
	var clipList = [];

	this.setVolume = function(amount) {
		if (amount > 1) {sfxVolume = 1;}
		else if (amount < 0) {sfxVolume = 0;}
		else {sfxVolume = amount;}
		for (var i in clipList) {
			clipList[i].updateVolume();
		}
	}

	this.getVolume = function() {
		return sfxVolume;
	}

	this.addToList = function(sfxClip) {
		clipList.push(sfxClip);
	}
}

function getRandomVolume(){
	var min = 0.85;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function getRandomRate(){
	var min = 0.85;
	var max = 1.15;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function sfxClipSingle(filenameWithPath) {
	var soundFile = new Audio(filenameWithPath+audioFormat);
	var clipVolume = 1;
	var randVolume = true;
	var randRate = true
	var clipName = filenameWithPath;
	var duration = soundFile.duration;

	soundFile.pause();
	SFXVolumeManager.addToList(this);


	this.play = function() {
		soundFile.currentTime = 0;
		this.updateVolume();
		soundFile.play();
	}

	this.stop = function() {
		soundFile.pause();
		soundFile.currentTime = 0;
	}

	this.resume = function() {
		soundFile.play();
	}

	this.pause = function() {
		soundFile.pause();
	}

	function setRandomRate() {
		this.setPlaybackRate(getRandomRate());
	}

	this.updateVolume = function() {
		if (randVolume) {
			soundFile.volume = Math.pow(sfxVolume * clipVolume * getRandomVolume() * !isMuted, 2);
		} else {
			soundFile.volume = Math.pow(sfxVolume * clipVolume * !isMuted, 2);
		}
	}

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		soundFile.volume = Math.pow(newVolume * sfxVolume * !isMuted, 2);
		clipVolume = newVolume;
	}

	this.getVolume = function() {
		return sfxVolume * clipVolume * !isMuted;
	}

	this.setTime = function(time) {
		soundFile.currentTime = time;
	}

	this.getTime = function() {
		return soundFile.currentTime;
	}

	this.setPlaybackRate = function(rate) {
		soundFile.playbackRate = rate;
	}

	this.getPlaybackRate = function() {
		return soundFile.playbackRate;
	}
	
	this.setClipName = function(name) {
		clipName = name;
	}

	this.getClipName = function() {
		return clipName;
	}
	
	this.getDuration = function() {
		return duration;
	}

	this.getPaused = function() {
		return soundFile.paused;
	}
}

function sfxClipOverlap(filenameWithPath, voices) {
	var soundFile = new array(voices);
	var maxVoices = soundfile.length;

	for (var i in soundFile) {
		soundFile[i] = new Audio(filenameWithPath+audioFormat);
		soundFile[i].pause();
	}

	var currentClip = 0;
	var clipVolume = 1;
	var randVolume = true;
	var randRate = true
	var clipName = filenameWithPath;
	var duration = soundFile[0].duration;


	SFXVolumeManager.addToList(this);

	this.play = function() {
		currentClip++;
		if (currentClip >= maxVoices) {currentClip = 0;}

		soundFile[currentClip].currentTime = 0;
		this.updateVolume();
		soundFile[currentClip].play();
	}

	this.stop = function() {
		for (var i in soundFile) {
			soundFile[i].pause();
			soundFile[i].currentTime = 0;
		}
	}

	this.resume = function() {
		soundFile[currentClip].play();
	}

	this.pause = function() {
		for (var i in soundFile) {
			soundFile[i].pause();
		}
	}

	function setRandomRate() {
		this.setPlaybackRate(getRandomRate());
	}

	this.updateVolume = function() {
		if (randVolume) {
			for (var i in soundFile) {
				soundFile[i].volume = Math.pow(sfxVolume * clipVolume * getRandomVolume() * !isMuted, 2);
			}
		} else {
			for (var i in soundFile) {
				soundFile[i].volume = Math.pow(sfxVolume * clipVolume * !isMuted, 2);
			}
		}
	}

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		for (var i in soundFile) {
			soundFile[i].volume = Math.pow(newVolume * sfxVolume * !isMuted, 2);
		}
		clipVolume = newVolume;
	}

	this.getVolume = function() {
		return sfxVolume * clipVolume * !isMuted;
	}

	this.setTime = function(time) {
		soundFile.currentTime[currentClip] = time;
	}

	this.getTime = function() {
		return soundFile[currentClip].currentTime;
	}

	this.setPlaybackRate = function(rate) {
		soundFile.playbackRate[currentClip] = rate;
	}

	this.getPlaybackRate = function() {
		return soundFile[currentClip].playbackRate;
	}
	
	this.setClipName = function(name) {
		clipName = name;
	}

	this.getClipName = function() {
		return clipName;
	}
	
	this.getDuration = function() {
		return duration;
	}

	this.getPaused = function() {
		return soundFile[currentClip].paused;
	}
}

function sfxContainerRandom(clipList) {
	var soundFile = [];
	currentClip = 0;

	for (var i in clipList) {
		soundFile[i] = clipList[i];
		soundFile[i].pause();
	}

	var clipVolume = 1;

	this.play = function() {
		currentClip = Math.floor(Math.random() * soundFile.length);
		soundFile[currentClip].play();
	}

	this.stop = function() {
		for (var i in trackList) {
			soundFile[i].stop();
		}
	}

	this.resume = function() {
		soundFile[currentClip].resume();
	}

	this.pause = function() {
		for (var i in trackList) {
			soundFile[i].pause();
		}
	}

	function setRandomRate() {
		soundFile[currentClip].setRandomRate();
	}

	this.updateVolume = function() {
		for (var i in trackList) {
			soundFile[i].updateVolume();
		}
	}

	this.setVolume = function(newVolume) {
		soundFile[currentClip].setVolume(newVolume);
	}

	this.getVolume = function() {
		return soundFile[currentClip].getVolume();
	}

	this.setTime = function(time) {
		soundFile[currentClip].setTime(time);
	}

	this.getTime = function() {
		return soundFile[currentClip].getTime();
	}

	this.setPlaybackRate = function(rate) {
		soundFile[currentClip].setPlaybackRate(rate);
	}

	this.getPlaybackRate = function() {
		return soundFile[currentClip].getPlaybackRate();
	}
	
	this.setClipName = function(name) {
		soundFile[currentClip].setClipName(name);
	}

	this.getClipName = function() {
		return soundFile[currentClip].getClipName();
	}
	
	this.getDuration = function() {
		return soundFile[currentClip].getDuration();
	}

	this.getPaused = function() {
		return soundFile[currentClip].getPaused();
	}
}


//Music Classes

var musicVolume = 1;
MusicVolumeManager = new musicVolumeManager();
function musicVolumeManager() {
	var trackList = [];

	this.setVolume = function(amount) {
		if (amount > 1) {musicVolume = 1;}
		else if (amount < 0) {musicVolume = 0;}
		else {musicVolume = amount;}
		for (var i in trackList) {
			trackList[i].updateVolume();
		}
	}

	this.getVolume = function() {
		return musicVolume;
	}

	this.addToList = function(musicTrack) {
		trackList.push(musicTrack);
	}
}

function musicTrackLooping(filenameWithPath) {
	var musicFile = new Audio(filenameWithPath+audioFormat);
	var duration = musicFile.duration;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile.pause();
	musicFile.loop = true;
	MusicVolumeManager.addToList(this);

	this.play = function() {
		musicFile.currentTime = 0;
		this.updateVolume();
		musicFile.play();
	}

	this.stop = function() {
		musicFile.pause();
		musicFile.currentTime = 0;
	}

	this.resume = function() {
		musicFile.play();
	}

	this.pause = function() {
		musicFile.pause();
	}

	this.playFrom = function(time) {
		musicFile.currentTime = time;
		musicFile.play();
	}

	this.startOrStop = function() {
		if(musicFile.paused) {
			this.resume();
		} else {
			this.pause();
		}
	}

	this.updateVolume = function() {
		musicFile.volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
	}

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		musicFile.volume = Math.pow(mixVolume * newVolume * musicVolume * !isMuted, 2);
		trackVolume = newVolume;
		if (trackVolume <= 0) { this.stop();}
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.setTime = function(time) {
		musicFile.currentTime = time;
	}

	this.getTime = function() {
		return musicFile.currentTime;
	}

	this.setPlaybackRate = function(rate) {
		musicFile.playbackRate = rate;
	}

	this.getPlaybackRate = function() {
		return musicFile.playbackRate;
	}
	
	this.setTrackName = function(name) {
		trackName = name;
	}

	this.getTrackName = function() {
		return trackName;
	}
	
	this.getDuration = function() {
		return duration;
	}

	this.getPaused = function() {
		return musicFile.paused;
	}
}

function musicTrackLoopingWTail(filenameWithPath, playLength) {
	var musicFile = new Array(new Audio(filenameWithPath+audioFormat), new Audio(filenameWithPath+audioFormat));
	var currentTrack = 0;
	var duration = playLength;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile[0].pause();
	musicFile[1].pause();
	MusicVolumeManager.addToList(this);

	this.play = function() {
		musicFile[currentTrack].currentTime = 0;
		this.updateVolume();
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, "loop");
	}

	this.stop = function() {
		musicFile[0].pause();
		musicFile[0].currentTime = 0;
		musicFile[1].pause();
		musicFile[1].currentTime = 0;
	}

	this.resume = function() {
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, "loop");
	}

	this.pause = function() {
		musicFile[0].pause();
		musicFile[1].pause();
	}

	this.playFrom = function(time) {
		musicFile[currentTrack].currentTime = time;
		musicFile[currentTrack].play();
		AudioEventManager.addTimerEvent(this, "loop");
	}

	this.startOrStop = function() {
		if(musicFile[currentTrack].paused) {
			this.resume();
		} else {
			this.pause();
		}
	}

	this.triggerTimerEnded = function(callSign) {
		currentTrack++;
		if (currentTrack > 1) {currentTrack = 0;}
		this.play();
	}

	this.updateVolume = function() {
		musicFile[0].volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
		musicFile[1].volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
	}

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		musicFile[currentTrack].volume = Math.pow(mixVolume * newVolume * musicVolume * !isMuted, 2);
		trackVolume = newVolume;
		if (trackVolume <= 0) { this.stop();}
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.setTime = function(time) {
		musicFile[currentTrack].currentTime = time;
	}

	this.getTime = function() {
		return musicFile[currentTrack].currentTime;
	}

	this.setPlaybackRate = function(rate) {
		musicFile[0].playbackRate = rate;
		musicFile[1].playbackRate = rate;
	}

	this.getPlaybackRate = function() {
		return musicFile[currentTrack].playbackRate;
	}
	
	this.setTrackName = function(name) {
		trackName = name;
	}

	this.getTrackName = function() {
		return trackName;
	}
	
	this.getDuration = function() {
		return duration;
	}

	this.getPaused = function() {
		return musicFile[currentTrack].paused;
	}
}

function musicTrackStinger(filenameWithPath) {
	var musicFile = new Audio(filenameWithPath+audioFormat);
	var duration = musicFile.duration;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile.pause();
	musicFile.loop = false;
	MusicVolumeManager.addToList(this);

	this.play = function() {
		musicFile.currentTime = 0;
		this.updateVolume();
		musicFile.play();
	}

	this.stop = function() {
		musicFile.pause();
		musicFile.currentTime = 0;
	}

	this.resume = function() {
		musicFile.play();
	}

	this.pause = function() {
		musicFile.pause();
	}

	this.playFrom = function(time) {
		musicFile.currentTime = time;
		musicFile.play();
	}

	this.startOrStop = function() {
		if(musicFile.paused) {
			this.resume();
		} else {
			this.pause();
		}
	}

	this.updateVolume = function() {
		musicFile.volume = Math.pow(mixVolume * musicVolume  * trackVolume * !isMuted, 2);
	}

	this.setVolume = function(newVolume) {
		if(newVolume > 1) {newVolume = 1;}
		if(newVolume < 0) {newVolume = 0;}
		musicFile.volume = Math.pow(mixVolume * newVolume * musicVolume * !isMuted, 2);
		trackVolume = newVolume;
		if (trackVolume <= 0) { this.stop();}
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.setTime = function(time) {
		musicFile.currentTime = time;
	}

	this.getTime = function() {
		return musicFile.currentTime;
	}

	this.setPlaybackRate = function(rate) {
		musicFile.playbackRate = rate;
	}

	this.getPlaybackRate = function() {
		return musicFile.playbackRate;
	}
	
	this.setTrackName = function(name) {
		trackName = name;
	}

	this.getTrackName = function() {
		return trackName;
	}
	
	this.getDuration = function() {
		return duration;
	}

	this.getPaused = function() {
		return musicFile.paused;
	}
}

function musicContainer(trackList) {
	var musicTrack = [];
	var currentTrack = 0;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	var trackVolume = 1;

	this.play = function() {
		musicTrack[currentTrack].play();
	}

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	}

	this.resume = function() {
		musicTrack[currentTrack].resume();
	}

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	}

	this.playFrom = function(time) {
		musicTrack[currentTrack].playFrom(time);
	}

	this.startOrStop = function() {
		musicTrack[currentTrack].startOrStop();
	}

	this.loadTrack = function(newTrack, slot) { //need
		var timeNow = musicTrack.getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	}

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	}

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	}

	this.getCurrentTrack = function() {
		 return currentTrack;
	}

	this.getListLength = function() {
		 return musicTrack.length;
	}

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	}

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	}

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	}

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	}

	this.setPlaybackRate = function(rate) {
		musicTrack[currentTrack].setPlaybackRate(rate);
	}

	this.getPlaybackRate = function() {
		return musicTrack[currentTrack].getPlaybackRate();
	}
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	}

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	}
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	}

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	}
}

function musicContainerCrossfade(trackList) {
	var musicTrack = [];
	var currentTrack = 0;

	for (var i in trackList) {
		musicTrack[i] = trackList[i];
		musicTrack[i].pause();
	}

	var trackVolume = 1;

	this.play = function() {
		musicTrack[currentTrack].play();
	}

	this.stop = function() {
		for (var i in trackList) {
			musicTrack[i].stop();
		}
	}

	this.resume = function() {
		musicTrack[currentTrack].resume();
	}

	this.pause = function() {
		for (var i in trackList) {
			musicTrack[i].pause();
		}
	}

	this.playFrom = function(time) {
		musicTrack[currentTrack].playFrom(time);
	}

	this.startOrStop = function() {
		musicTrack[currentTrack].startOrStop();
	}

	this.loadTrack = function(newTrack, slot) { //need
		var timeNow = musicTrack.getTime();
		if(!musicTrack[slot].getPaused()) {
			musicTrack[slot].pause();
			musicTrack[slot].setTime(0);
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].playFrom(timeNow);
		} else {
			musicTrack[slot] = newTrack;
			musicTrack[slot].setVolume(trackVolume);
			musicTrack[slot].setTime(timeNow);
		}
	}

	this.switchTo = function(slot, fadeTime = 1) {
		var timeNow = musicTrack[currentTrack].getTime();
		if(currentTrack != slot && !musicTrack[currentTrack].getPaused()) {
			musicTrack[slot].playFrom(timeNow);
			AudioEventManager.addFadeEvent(musicTrack[currentTrack], fadeTime, 0);
			AudioEventManager.addFadeEvent(musicTrack[slot], fadeTime, trackVolume);
			currentTrack = slot;
		} else if (currentTrack != slot) {
			musicTrack[slot].setTime(timeNow);
			musicTrack[currentTrack].stop();
			currentTrack = slot;
		}

	}

	this.updateVolume = function() {
		for (var i in trackList) {
			musicTrack[i].updateVolume();
		}
	}

	this.setCurrentTrack = function(trackNumber) {
		currentTrack = trackNumber;
	}

	this.getCurrentTrack = function() {
		 return currentTrack;
	}

	this.getListLength = function() {
		 return musicTrack.length;
	}

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack[currentTrack].setVolume(newVolume);
	}

	this.getVolume = function() {
		return musicTrack[currentTrack].getVolume();
	}

	this.setTime = function(time) {
		musicTrack[currentTrack].setTime(time);
	}

	this.getTime = function() {
		return musicTrack[currentTrack].getTime();
	}

	this.setPlaybackRate = function(rate) {
		musicTrack[currentTrack].setPlaybackRate(rate);
	}

	this.getPlaybackRate = function() {
		return musicTrack[currentTrack].getPlaybackRate();
	}
	
	this.setTrackName = function(name) {
		musicTrack[currentTrack].setTrackName(name);
	}

	this.getTrackName = function() {
		return musicTrack[currentTrack].getTrackName();
	}
	
	this.getDuration = function() {
		return musicTrack[currentTrack].getDuration();
	}

	this.getPaused = function() {
		return musicTrack[currentTrack].getPaused();
	}
}