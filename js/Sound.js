// SOUND SYSTEM MODULE v3
// by Christer "McFunkypants" Kaitila for http://gamkedo.com

// Requires https://github.com/goldfire/howler.js

// TO USE: just do 
// Sound.play("boom"); // it will download boom.mp3 once
// Sound.mute();
// Sound.unmute();

"use strict";

const BACKGROUND_VOL = 0.7;

var Sound = new SoundSystem(); // global

function SoundSystem() {

    var USE_SOUND_ATLAS = false; // useful but optional
    var music = null;   // one looping Howl() object
    var sounds = [];    // an array of Howl() objects
    var atlas = null;   // one big sound sprite (optional)
    var debug_sound = false; // write to console?

    this.mute = false;   // if true ignore all play()

    // playback function
    this.play = function(samplename,looping,vol,rate,pan)
    {
        if(this.mute) return;
        // null variable conditions
        if (looping==null) looping = false;
        if (vol == null) vol = 1;
        if (rate == null) rate = 1;
        if (pan == null) pan = 0;

        //if (debug_sound) console.log("pan: " + pan);

        if (!sounds[samplename]) // downloads on demand once only
        {
            // src array is filenames to try in what order
            // every new browser supports .webm,
            // older ones like mp3 or ogg but not both
            if (debug_sound) console.log("Downloading a new sound: " + samplename);
            sounds[samplename] = new Howl({
                src: [
                    'audio/'+samplename+'.mp3',
                    'audio/'+samplename+'.ogg',
                    'audio/'+samplename+'.webm'],
                loop: looping,
                volume: vol,
                rate: rate,
                pan: pan
            });
        }
        if (!this.mute) // we still download even if muted
            sounds[samplename].play();
        };

        this.stop = function(samplename) {
            if (debug_sound) console.log("soundSystem.stop "+samplename);
            if (sounds[samplename])
                sounds[samplename].stop();
        };

        this.pause = function(samplename) {
            if (debug_sound) console.log("soundSystem.stop "+samplename);
            if (sounds[samplename])
                sounds[samplename].pause();
        };

    // can be called often and it will only play one at a time max
    this.playUnlessAlreadyPlaying = function(samplename,looping,vol,rate,pan)
    {
        if (!this.isPlaying(samplename))
            this.play(samplename,looping,vol,rate,pan);
    }
    
        // returns true if a sample is currently playing
    this.isPlaying = function(samplename) {
        var result = false;

        if (sounds[samplename]) {
            result = sounds[samplename].playing();
        }
        else {
            if (debug_sound) console.log("unknown sound: " + samplename);
        }
        return result;
    };

    this.Mute = function() {
        Howler.mute(true);
        this.mute = true;
    };

    this.unMute = function() {
        Howler.mute(false);
        this.mute = false;
    };

}

