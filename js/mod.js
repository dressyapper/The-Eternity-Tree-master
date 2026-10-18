let modInfo = {
	name: "The Eternity Tree",
	author: "nobody",
	pointsName: "points",
	modFiles: ["layers/super.js","layers/concepts.js", "layers/achievements.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	let x = true

	if (player.paused) x = false
	
	return x
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0) 

	let gain = new Decimal(1)
	if (hasUpgrade("S", 11)) {gain = gain.times(2)}
	if (hasUpgrade("S", 12)) {gain = gain.times(3)}
	if (hasUpgrade("S", 13)) {gain = gain.times(4)}
	if (hasUpgrade("S", 15)) {gain = gain.times(upgradeEffect("S", 15))}
	if (hasUpgrade("S", 16)) {gain = gain.times(1.5)}
	if (hasUpgrade("S", 21)) {gain = gain.times(2)}
	if (hasMilestone("S", 1)) {gain = gain.times(3)}
	if (hasUpgrade("S", 24)) {gain = gain.times(16)}
	if (hasMilestone("S", 2)) {gain = gain.times(20)}
	gain = gain.times(buyableEffect("S", 11))
	if (hasUpgrade("S", 26)) {gain = gain.times(100)}
	if (hasUpgrade("S", 31)) {gain = gain.times(upgradeEffect("S", 31))}
	gain = gain.times(buyableEffect("S", 14).pow(0.5+(hasUpgrade("S",45)*0.5)))
	if (hasUpgrade("S", 41)) {gain = gain.times(upgradeEffect("S", 41))}
	if (hasUpgrade("C", 21)) {gain = gain.times(4)}
	if (hasUpgrade("C", 31)) {gain = gain.times(16)}
	if (hasMilestone("C", 1)) {gain = gain.times(3)}
	if (hasUpgrade("C", 41)) {gain = gain.times(upgradeEffect("C", 41))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	()=>{
		if (player.paused) {
			return "[DISABLED GENERATION]"
		}
	},
	()=>{
		if (document.URL.split("/")[0] == "file:") {
			return "YOU ARE IN TESTING MODE"
		}
	},
	()=>{
		if (!options.autosave) {
			return "<p style='color:rgb(255,100,100)'>Autosave is disabled"
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

onkeydown = (ev) => {
	if (ev.key == "t") {
		player.paused = !player.paused
	}
	if (ev.key == "r") {
		player.points = new Decimal(0)
	}
}

function getHighestUnlockedRow() {
	let highest = 0
	for (i in ROW_LAYERS) {
		if (Number(i) == i) {
			for (j in ROW_LAYERS[i]) {
				if (layerShown(j)) {
					if (i > highest) {
						highest = i
					}
				}
			}
		}
	}

	return highest
}