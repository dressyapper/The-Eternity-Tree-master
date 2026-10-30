addLayer("Tm", {
    name: "Time", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(0, 0, 255)",
    requires: new Decimal("1"), // Can be a function that takes requirement increases into account
    resource: "Time Crystals", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    getResetGain() {
        return player.points.add(1).log(10).div(player.points.sub(1e154).max(1).add(1).log(10))
    },
    getNextAt() {
        return this.getResetGain()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(dt) {
    },
    passiveGeneration() {
        let pg = 0



        if (player.paused) pg = new Decimal(0)
        return pg
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "S", description: "S: Reset for Super", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(reset) {
        if (layers[reset].row <= this.row) return 

        let keep = []
    
        layerDataReset(this.layer, keep)
    },
    onPrestige() {

    },
    branches: ["T", "Tm"],
    layerShown(){return hasAchievement("Ach", 34)},
    upgrades: {
        11: {
            title: "Automate I",
            description: "Automate Super upgrades",
            cost: new Decimal(1000),
        },
        12: {
            title: "Automate II",
            description: "Automate Super upgrades",
            cost: new Decimal(Infinity),
        },
    },
    milestones: {
        1: {
            requirementDescription: "1st Timeline",
            effectDescription: "This is the timeline you started in",
            unlocked() {return true},
            done() {return false},
        },
    },
    buyables: {
        11: {
            title: "Supercharge",
            description() {
                return "Boost Points by +"+format(this.effectbase())+"x"
            },
            purchaseLimit() {
                
                let x = new Decimal(5)
                if (hasUpgrade("C", 55)) x = x.pow(14)
                x = x.add(new Decimal(getBuyableAmount(this.layer, 12)).times(5))
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                if (hasUpgrade("C", 72)) x = x.times(player.S.supercores.div(1000).sqrt()).min(1e125).add(1)
                if (hasChallenge("C", 14)) x = x.times(1.5)
                return x
            },
            unlocked() {return true},
            cost(x) {
                let c = new Decimal(new Decimal(1.5).div(new Decimal(1.1).pow(getBuyableAmount(this.layer, 12))).max(1)).pow(x).times(new Decimal(x).div(10).add(1)).floor()
                
                if (hasUpgrade("C", 54)) c = new Decimal(1000)
                return c
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "/"+format(this.purchaseLimit())+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                try {
                    return player.S.supercores.gte(this.cost()) && !inChallenge("C", 11)
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return

                if (!hasUpgrade("C",54)) {
                    player.S.supercores = player.S.supercores.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
                else {
                    let buy = player[this.layer].supercores.div(1000).min(this.purchaseLimit().sub(getBuyableAmount(this.layer, this.id)))
                    player.S.supercores = player.S.supercores.sub(this.cost().times(buy))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(buy))
                }
            },
            effectbase(x) {
                let b = new Decimal(1)

                if (hasUpgrade("S", 35)) b = new Decimal(1.5)
                if (hasUpgrade("S", 42)) b = new Decimal(10)
                if (hasUpgrade("S", 43)) b = b.add(new Decimal(upgradeEffect("S", 43)))
                if (hasUpgrade("C", 55)) b = b.add(0.1)

                return b
            },
            effect(x) {
                let b = this.effectbase()
                let eff = new Decimal(x).times(b).add(1)

               

                return eff
            },
        },
    },
    clickables: {
        9991: {
            title: "Reset points and this layers points",
            canClick() {return true},
            onClick() {
                layerDataReset(this.layer, ["upgrades", "buyables", "milestones", "challenges"])
                player.points = new Decimal(0)
            },
            
        },
        9992: {
            title: "Remove last upgrade",
            canClick() {return true},
            onClick() {
                player[this.layer].upgrades.splice(player[this.layer].upgrades.length-1,1)
            },
            display() {
                
            },
            
        },
        9993: {
            title: "Remove last milestone",
            canClick() {return true},
            onClick() {
                player[this.layer].milestones.splice(player[this.layer].milestones.length-1,1)
            },
            display() {
                
            },
            
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["clickables", [999]],
                "blank",
                "upgrades",
                "blank",
                ["infobox", "format"],
            ],
    
            unlocked() {return true}
        },
        "Milestones": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                ["clickables", [999]],
                "blank",
                "milestones",
                "blank",
                ["infobox", "format"],
            ],
    
            unlocked() {return true}
        },
    },
})
