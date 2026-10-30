addLayer("T", {
    name: "Timelines", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        milestones: [1],

        fragments: new Decimal(1),

        universefragbase: new Decimal(1),
        universefragtimebase: new Decimal(10000),

        universefragresetformula() {
            return new Decimal(player.T.universefragbase).times(new Decimal(player.T.universefragtimebase).div(Math.max(player.T.resetTime,0.01))).times(player.C.generator.energy.pow(1/50).max(1)).times(player.points.div("1.79e308").pow(0.1)).max(1)
        } 

    }},
    color: "rgb(111, 0, 255)",
    requires: new Decimal("1.79e308"), // Can be a function that takes requirement increases into account
    resource: "Timelines", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
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

        let keep = ["fragments"]
    
        layerDataReset(this.layer, keep)
    },
    onPrestige() {
        player.T.fragments = player.T.fragments.add(player.T.universefragresetformula())
    },
    branches: ["C"],
    layerShown(){return player.points.gte(1e250) || hasAchievement("Ach", 33)},
    upgrades: {
        11: {
            title: "Transendant Points",
            description: "^1.1 point gain",
            cost: new Decimal(1),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
        },
        12: {
            title: "Transendant Super",
            description: "^1.05 Super gain",
            cost: new Decimal(5),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
            unlocked() {return hasUpgrade("T", 11)}
        },
        13: {
            title: "Transendant Cores",
            description: "^1.15 Core mult",
            cost: new Decimal(10),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
            unlocked() {return hasUpgrade("T", 12)}
        },
        14: {
            title: "Neuronic Eternity",
            description: "Concept requirement is 1e30 and remove the concept cost increase from ",
            cost: new Decimal(15),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
            unlocked() {return hasUpgrade("T", 13)}
        },
        15: {
            title: "Prime generator",
            description: "1st generator generates ^2 more",
            cost: new Decimal(20),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
            unlocked() {return hasUpgrade("T", 14)}
        },
        16: {
            title: "UnPrime generator",
            description: "2nd and 3rd generator generates ^1.25 more",
            cost: new Decimal(25),
            currencyDisplayName: "Universal Fragments",
            currencyInternalName: "fragments",
            currencyLayer: "T",
            unlocked() {return hasUpgrade("T", 15)}
        },
    },
    milestones: {
        1: {
            requirementDescription: "1st Timeline",
            effectDescription: "This is the timeline you started in",
            unlocked() {return true},
            done() {return false},
        },
        2: {
            requirementDescription: "2nd Timeline",
            effectDescription: "Generate 1% of your super",
            unlocked() {return true},
            done() {return player.T.total.gte(1)},
        },
        3: {
            requirementDescription: "3rd Timeline",
            effectDescription: "Superboost no longer resets cores and doesnt cost anything",
            unlocked() {return true},
            done() {return player.T.total.gte(2)},
        },
        4: {
            requirementDescription: "4th Timeline",
            effectDescription: "Points start at 10/sec",
            unlocked() {return true},
            done() {return player.T.total.gte(3)},
        },
        5: {
            requirementDescription: "5th Timeline",
            effectDescription: "Increase Supercharge cap by x1e25",
            unlocked() {return true},
            done() {return player.T.total.gte(4)},
        },
        6: {
            requirementDescription: "6th Timeline",
            effectDescription: "Keep super milestones",
            unlocked() {return true},
            done() {return player.T.total.gte(5)},
        },
        7: {
            requirementDescription: "7th Timeline",
            effectDescription: "Keep super buyables",
            unlocked() {return true},
            done() {return player.T.total.gte(6)},
        },
        8: {
            requirementDescription: "8th Timeline",
            effectDescription: "Supercores dont reset anything",
            unlocked() {return true},
            done() {return player.T.total.gte(7)},
        },
        9: {
            requirementDescription: "9th Timeline",
            effectDescription: "CG 1 starts free and generator is unlocked immediately",
            unlocked() {return true},
            done() {return player.T.total.gte(8)},
        },
        10: {
            requirementDescription: "10th Timeline",
            effectDescription: "Unlock Time",
            unlocked() {return true},
            done() {return player.T.total.gte(9)},
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
                ["display-text", function() { 
                    return 'You have <h2 style="color: ' + "black" + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.T.fragments) +'</h2> Universe Fragments';
                }],
                "blank",
                
                "prestige-button",
                ["display-text", function() { 
                    return 'You will get <h2 style="color: ' + "black" + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.T.universefragresetformula()) +'</h2> Universe Fragments on Timeline reset';
                }],
                
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
                ["display-text", function() { 
                    return 'You have <h2 style="color: ' + "black" + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.T.fragments) +'</h2> Universe Fragments';
                }],
                "blank",
                "prestige-button",
                ["display-text", function() { 
                    return 'You will get <h2 style="color: ' + "black" + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.T.universefragresetformula()) +'</h2> Universe Fragments on Timeline reset';
                }],
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

let layerT = {}