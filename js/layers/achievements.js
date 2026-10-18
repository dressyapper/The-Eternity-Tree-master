addLayer("Ach", {
    name: "Achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(255,255,255)",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    achievements: {
        11: {
            name: "The beginning",
            tooltip: "Buy the first upgrade",
            done() {
                return hasUpgrade("S", 11)
            },
        },
        12: {
            name: "Wow so much",
            tooltip() {
                let desc = "Get 50 Super"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Unlock Prestige Milestones tab"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            done() {
                return player.S.points.gte(50)
            },
        },
        13: {
            name: "0.5e6",
            tooltip() {
                let desc = "Get 500000 Super"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Unlock Super Cores"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            done() {
                return player.S.points.gte(5e5)
            },
        },
        14: {
            name: "Fivecharger",
            tooltip() {
                let desc = "Buy 5 superchargers"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Unlock another buyable"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            done() {
                return getBuyableAmount("S", 11) >= 5
            },
        },
        15: {
            name: "Tencharger",
            tooltip() {
                let desc = "Buy 10 superchargers"
                if (hasAchievement(this.layer, this.id)) {
                    let effectdesc = "Unlock another buyable"
                    return desc+"<br>Reward: "+effectdesc
                }
                else {
                    return desc
                }
            },
            done() {
                return getBuyableAmount("S", 11) >= 10
            },
        },
        16: {
            name: "Side B",
            tooltip: "Get the 6th S milestone",
            done() {
                return hasMilestone("S", 6)
            },
        },
        21: {
            name: "More??",
            tooltip: "Unlock the 4th Core buyable",
            done() {
                return hasUpgrade("S", 36)
            },
        },
        22: {
            name: "50 cores!!",
            tooltip: "Get 1e50 Supercores",
            done() {
                return player.S.supercores.gte(1e50)
            },
        },
        23: {
            name: "40 super",
            tooltip: "Get 1e40 Super",
            done() {
                return player.S.points.gte(1e40)
            },
        },
        24: {
            name: "Concepts",
            tooltip: "Reset for a concept",
            done() {
                return player.C.points.gte(1)
            },
        },
    },
    clickables: {
        11: {
            title: "Remove last achievement",
            onClick() {
                player.Ach.achievements.splice(player.Ach.achievements.length-1,1)
            },
            canClick() {
                return true
            },
        }
    },
    tabFormat: {
        "Achievements": {
            content: [
                "blank",
                "clickables",
                "achievements",
            ],
    
            unlocked() {return true}
        },
    },

})
