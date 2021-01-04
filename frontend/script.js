var playing = false;

var context;
var panLeftNode;
var panRightNode;
var gain;

var osc1Frequency = 440;
var osc1;

var osc2Frequency = 447;
var osc2;

var timerId;

var volume = 0.5;
 
function start() {
	if (this.playing === false) {
		var context = this.context || new AudioContext();
		this.context = context;

		this.panLeftNode = context.createStereoPanner();
		this.panRightNode = context.createStereoPanner();
  
		this.panLeftNode.pan.value = -1;
		this.panRightNode.pan.value = 1;
  
		this.osc1Freq = document.getElementById("freq1").value;
		this.osc1 = context.createOscillator();
		this.osc1.frequency.value = osc1Freq;
  
		this.osc2Freq = document.getElementById("freq2").value;
		this.osc2 = context.createOscillator();
		this.osc2.frequency.value = osc2Freq;
  
		this.gain = context.createGain()
		this.gain.gain.setValueAtTime(0.001, context.currentTime);
  
		this.osc1.connect(this.panLeftNode);
		this.osc2.connect(this.panRightNode);
		this.panLeftNode.connect(this.gain);
		this.panRightNode.connect(this.gain);
		this.gain.connect(context.destination);
		this.osc1.start(0);
		this.osc2.start(0);
		this.gain.gain.exponentialRampToValueAtTime(this.volume, context.currentTime + 2);
		this.playing = true;
		
		var minsToPlay = document.getElementById("timerMins").value;
		timer(minsToPlay);
		document.getElementById("controlbar").style.display = "none";
		document.getElementById("stopbar").style.display = "block";
		document.getElementById("countdownWrapper").style.visibility = "visible";
	}
}
 
async function stop() {
	document.getElementById("controlbar").style.display = "block";
	document.getElementById("stopbar").style.display = "none";
	document.getElementById("countdownWrapper").style.visibility = "hidden";
	clearInterval(this.timerId);
	this.gain.gain.exponentialRampToValueAtTime(this.volume / 1.05, context.currentTime + 0.3);
	await delay(300);
	this.gain.gain.exponentialRampToValueAtTime(this.volume / 1.5, context.currentTime + 0.3);
	await delay(300);
	this.gain.gain.exponentialRampToValueAtTime(this.volume / 2, context.currentTime + 0.4);
	await delay(400);
	this.gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2);
	await delay(2000);
	this.osc1.stop();
	this.osc2.stop();
	this.playing = false;
}
 
function updateText(oscNum) {
	if (oscNum === 1) {
		document.getElementById("frequencyText1").innerHTML = this.osc1Freq + " Hz";
		return;
	} else {
		document.getElementById('frequencyText2').innerHTML = this.osc2Freq + " Hz";
		return;
	}
}
 
function updateFrequency(newFreq, oscillator) {
	if (oscillator === 1) {
		this.osc1Freq = newFreq
		if (this.playing === true) this.osc1.frequency.value = newFreq;
		updateText(1);
		return;
	} else if (oscillator === 2) {
		this.osc2Freq = newFreq;
		if (this.playing === true) this.osc2.frequency.value = newFreq;
		updateText(2);
		return;
	}
}
 
function updateVolume(newVolume) {
	var newVolumeScaled = newVolume / 100;
	this.volume = newVolumeScaled;
	if (typeof this.gain !== 'undefined') {
		this.gain.gain.exponentialRampToValueAtTime(this.volume, context.currentTime + 2);
	}
}
 
const delay = ms => new Promise(res => setTimeout(res, ms));
 
function timer(mins) {
	var countdown = mins * 60 * 1000;
	var minInit = Math.floor(countdown / (60 * 1000));
	var secInit = Math.floor(60*(mins%1));
	document.querySelector("div.timer").innerHTML = minInit + " : " + secInit;
	this.timerId = setInterval(function(){
		countdown -= 1000;
		var min = Math.floor(countdown / (60 * 1000));
		var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);
     
		if (countdown <= 0) {
			stop();
			clearInterval(timerId);
		} else {
			document.querySelector("div.timer").innerHTML = min + " : " + sec;
		}
	}, 1000);
}