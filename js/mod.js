let modInfo = {
	name: "The Eternity Tree",
	author: "nobody",
	pointsName: "points",
	modFiles: ["layers/super.js","layers/concepts.js","layers/timeline.js","layers/time.js", "layers/achievements.js", "tree.js"],

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
	if (hasMilestone("T", 4)) {gain = new Decimal(10)}

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
	if (hasUpgrade("C", 51)) {gain = gain.times(100)}
	if (inChallenge("C", 12)) {gain = gain.times(player.C.c12percent)}
	if (hasChallenge("C", 12)) {gain = gain.times(challengeEffect("C", 12))}
	if (inChallenge("C", 13)) {gain = new Decimal(1)}
	if (hasChallenge("C", 13)) {gain = gain.times(10)}
	if (hasUpgrade("C", 71)) {gain = gain.times(1e3)}
	if (inChallenge("C", 14)) {gain = gain.pow(inChallengeEffect("C", 14))}
	if (hasChallenge("C", 14)) {gain = gain.times(10)}
	if (hasMilestone("C", 9)) {gain = gain.times(1e25)}
	if (inChallenge("C", 16)) {gain = gain.pow(0.01)}
	gain = gain.times((player.C.generator.effect(player.C.generator.energy)))
	if (hasUpgrade("C", 95)) {gain = gain.times(1e20)}
	if (hasUpgrade("T", 11)) {gain = gain.pow(1.1)}



	if (player.points.gte("1.79e308") && !player.breakinf) {
		gain = new Decimal(0)
	}
	return gain
}

function gameSpeed() {
	let s = 1


	player.devSpeed = s
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	saves: {
		1: "eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc5MzE4Mzc1MTkyMiwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJUaGUtRXRlcm5pdHktVHJlZS1ub2JvZHkiLCJ2ZXJzaW9uIjoiMC4wIiwidGltZVBsYXllZCI6NjM0NDY0LjU0OTkxODE3MDksImtlZXBHb2luZyI6ZmFsc2UsImhhc05hTiI6ZmFsc2UsInBvaW50cyI6IjIuODAxMDI1NzY4NzkwODI5ZTE4Iiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fSwiUyI6eyJtYWluVGFicyI6IkJvb3N0In0sIkFjaCI6eyJtYWluVGFicyI6IkFjaGlldmVtZW50cyJ9LCJDIjp7Im1haW5UYWJzIjoiR2VuZXJhdG9ycyJ9fSwibGFzdFNhZmVUYWIiOiJDIiwiaW5mb2JveGVzIjp7fSwiaW5mby10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo2MzQ0NjQuNTQ5OTE4MTcwOSwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJvcHRpb25zLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjYzNDQ2NC41NDk5MTgxNzA5LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImNoYW5nZWxvZy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo2MzQ0NjQuNTQ5OTE4MTcwOSwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJTIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIyLjA5MTA5NzU2ODg2MTUwM2UzNiIsInN1cGVyY29yZXMiOiIxLjY3NDI3MDk2MDQ3MTcxMzZlNTAiLCJzdXBlcmNvcmVjb3N0YmFzZSI6IjUwMDAwMCIsInRvdGFsIjoiMi4wOTEwOTc1Njg4NjE1MDNlMzYiLCJiZXN0IjoiMi4wOTEwOTc1Njg4NjE1MDNlMzYiLCJyZXNldFRpbWUiOjEzLjI1MDAwMDAwMDAwMDAzOSwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnsiMTEiOiIwIiwiMTIiOiIwIiwiMTMiOiIwIiwiMTQiOiIwIiwiMTUiOiIwIn0sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIiLCI5OTkxIjoiIiwiOTk5MiI6IiIsIjk5OTMiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6WzEsMiwzLDQsNSw2LDcsOF0sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiIsInN1cGVyY29yZXBhc3NpdmVnZW5lcmF0aW9uIjoyLCJhY3RpdmVDaGFsbGVuZ2UiOm51bGx9LCJibGFuayI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjYzNDQ2NC41NDk5MTgxNzA5LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sInRyZWUtdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6NjM0NDY0LjU0OTkxODE3MDksImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiQWNoIjp7InVubG9ja2VkIjp0cnVlLCJwb2ludHMiOiIwIiwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjYzNDQ2NC41NDk5MTgxNzA5LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnsiMTEiOiIifSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6WyIxMSIsIjEyIiwiMTMiLCIxNiIsIjE0IiwiMTUiLCIyMSIsIjIyIiwiMjMiLCIyNCIsIjI1IiwiMjYiLCIzMSJdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiQyI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMTYiLCJ0b3RhbCI6IjE2IiwiYmVzdCI6IjE2IiwicmVzZXRUaW1lIjoxMy4yNTAwMDAwMDAwMDAwMzksImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7IjExIjoiMCJ9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7IjExIjoiIiwiMTIiOiIiLCI5OTkxIjoiIiwiOTk5MiI6IiIsIjk5OTMiOiIiLCI5OTk0IjoiIn0sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzExLDIyLDIxLDMzLDQzLDMxLDMyLDQyLDQxLDQ0LDU0LDU1LDUzLDUyLDUxLDYxLDczLDcxLDcyLDc0LDc1LDgxXSwibWlsZXN0b25lcyI6WyIxIiwiMiIsIjMiLCI0IiwiNSJdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7IjExIjoxLCIxMiI6MSwiMTMiOjEsIjE0IjoxLCIxNSI6MX0sImdyaWQiOnt9LCJwcmV2VGFiIjoiIiwiYzEycGVyY2VudCI6IjEiLCJhY3RpdmVDaGFsbGVuZ2UiOm51bGwsImdlbmVyYXRvciI6eyIxIjp7ImFtdCI6IjAiLCJtdWx0IjoiMSIsImJvdWdodCI6IjAifSwiMiI6eyJhbXQiOiIwIiwibXVsdCI6IjEiLCJib3VnaHQiOiIwIn0sIjMiOnsiYW10IjoiMCIsIm11bHQiOiIxIiwiYm91Z2h0IjoiMCJ9LCJlbmVyZ3kiOiIwIn19LCJwYXVzZWQiOmZhbHNlLCJkZXZTcGVlZCI6MX0="
	},
	breakinf: false,
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

setInterval(() => {
	if (player && player.points) {
		if (player.points.gte("1.79e308") && !player.breakinf) {
			player.points = new Decimal("1.79e308")
		}
	}
})