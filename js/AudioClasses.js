var isMuted = false;

//SFX Classes
var sfxVolume = 1;

function setSFXVolume(amount) {
	sfxVolume = amount;
}

function getSFXVolume() {
	return sfxVolume;
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

function sfxClipSingle(filenameWithPath, audioFormat = defaultAudioFormat) {
	var soundFile = new Audio(filenameWithPath+audioFormat);
	var clipVolume = 1;
	var randVolume = true;
	var randRate = true
	var clipName = filenameWithPath;
	var duration = soundFile.duration;

	soundFile.pause();

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
		soundFile[i] = new Audio(filenameWithPath+defaultAudioFormat);
		soundFile[i].pause();
	}

	var currentClip = 0;
	var clipVolume = 1;
	var randVolume = true;
	var randRate = true
	var clipName = filenameWithPath;
	var duration = soundFile[0].duration;

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

//Music Classes
var musicVolume = 1;

function setMusicVolume(amount) {
	musicVolume = amount;
}

function getMusicVolume() {
	return musicVolume;
}

function musicTrackLooping(filenameWithPath) {
	var musicFile = new Audio(filenameWithPath+defaultAudioFormat);
	var duration = musicFile.duration;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile.pause();
	musicFile.loop = true;

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
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.getMixVolume = function() {
		return mixVolume;
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
	var musicFile = new Array(new Audio(filenameWithPath+defaultAudioFormat), new Audio(filenameWithPath+defaultAudioFormat));
	var currentTrack = 0;
	var duration = playLength;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile[0].pause();
	musicFile[1].pause();

	this.play = function() {
		musicFile[currentTrack].currentTime = 0;
		this.updateVolume();
		musicFile[currentTrack].play();
		musicManager.addTimerEvent(this, "loop");
	}

	this.stop = function() {
		musicFile[0].pause();
		musicFile[0].currentTime = 0;
		musicFile[1].pause();
		musicFile[1].currentTime = 0;
	}

	this.resume = function() {
		musicFile[currentTrack].play();
		musicManager.addTimerEvent(this, "loop");
	}

	this.pause = function() {
		musicFile[0].pause();
		musicFile[1].pause();
	}

	this.playFrom = function(time) {
		musicFile[currentTrack].currentTime = time;
		musicFile[currentTrack].play();
		musicManager.addTimerEvent(this, "loop");
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
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.getMixVolume = function() {
		return mixVolume;
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
	var musicFile = new Audio(filenameWithPath+defaultAudioFormat);
	var duration = musicFile.duration;
	var trackName = filenameWithPath;
	var trackVolume = 1;
	var mixVolume = 1;

	musicFile.pause();
	musicFile.loop = false;

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
	}

	this.getVolume = function() {
		return trackVolume * !isMuted;
	}

	this.setMixVolume = function(volume) {
		mixVolume = volume;
	}

	this.getMixVolume = function() {
		return mixVolume;
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

function musicContainer(track) {
	var musicTrack = track;
	var trackVolume = 1;

	this.play = function() {
		musicTrack.play();
	}

	this.stop = function() {
		musicTrack.stop();
	}

	this.resume = function() {
		musicTrack.resume();
	}

	this.pause = function() {
		musicTrack.pause();
	}

	this.playFrom = function(time) {
		musicTrack.playFrom(time);
	}

	this.startOrStop = function() {
		musicTrack.startOrStop();
	}

	this.loadTrack = function(newTrack) {
		var timeNow = musicTrack.getTime();
		if(!musicTrack.getPaused()) {
			musicTrack.pause();
			musicTrack.setTime(0);
			musicTrack = newTrack;
			musicTrack.setVolume(trackVolume);
			musicTrack.playFrom(timeNow);
		} else {
			musicTrack = newTrack;
			musicTrack.setVolume(trackVolume);
			musicTrack.setTime(timeNow);
		}
	}

	this.updateVolume = function() {
		musicTrack.updateVolume();
	}

	this.setVolume = function(newVolume) {
		trackVolume = newVolume;
		musicTrack.setVolume(newVolume);
	}

	this.getVolume = function() {
		return musicTrack.getVolume();
	}

	this.setTime = function(time) {
		musicTrack.setTime(time);
	}

	this.getTime = function() {
		return musicTrack.getTime();
	}

	this.setPlaybackRate = function(rate) {
		musicTrack.setPlaybackRate(rate);
	}

	this.getPlaybackRate = function() {
		return musicTrack.getPlaybackRate();
	}
	
	this.setTrackName = function(name) {
		musicTrack.setTrackName(name);
	}

	this.getTrackName = function() {
		return musicTrack.getTrackName();
	}
	
	this.getDuration = function() {
		return musicTrack.getDuration();
	}

	this.getPaused = function() {
		return musicTrack.getPaused();
	}
}

function musicContainerCrossfade(track1, track2) {
	var musicTrack = new Array(track1, track2);
	var currentTrack = 0;
	var trackVolume = 1;

	this.play = function() {
		musicTrack[currentTrack].play();
	}

	this.stop = function() {
		musicTrack[0].stop();
		musicTrack[1].stop();
	}

	this.resume = function() {
		musicTrack[currentTrack].resume();
	}

	this.pause = function() {
		musicTrack[0].pause();
		musicTrack[1].pause();
	}

	this.playFrom = function(time) {
		musicTrack[currentTrack].playFrom(time);
	}

	this.startOrStop = function() {
		musicTrack[0].startOrStop();
		musicTrack[1].startOrStop();
	}

	this.loadTrack = function(newTrack, fadeTime = 1) {
		var timeNow = musicTrack[currentTrack].getTime();
		var altTrack = Math.abs(currentTrack - 1);
		if(musicTrack[currentTrack].getPaused() == false) {
			musicTrack[altTrack] = newTrack;
			musicTrack[altTrack].setVolume(0);
			musicTrack[altTrack].playFrom(timeNow);
			musicManager.removeStopEvent(musicTrack[currentTrack]);
			musicManager.addFadeEvent(musicTrack[currentTrack], fadeTime, 0);
			musicManager.addFadeEvent(musicTrack[altTrack], fadeTime, trackVolume);
			musicManager.addStopEvent(musicTrack[currentTrack], fadeTime);
			currentTrack = altTrack;
		} else {
			musicTrack[currentTrack] = newTrack;
			musicTrack[currentTrack].stop();
			musicTrack[currentTrack].setTime(timeNow);
		}
	}

	this.updateVolume = function() {
		musicTrack[0].updateVolume();
		musicTrack[1].updateVolume();
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