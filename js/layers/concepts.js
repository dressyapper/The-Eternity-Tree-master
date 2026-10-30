addLayer("C", {
    name: "Concepts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        c12percent: new Decimal(1),

        generator: {
            energy: new Decimal(0),
            effect(x) {
                //x is energy ^^^^
                let eff = x.pow(3).add(1)


                if (eff.gte(1e100)) {
                    eff = new Decimal(new Decimal(1e100)).times(x.div(new Decimal(1e100).pow(1/3)).add(1).log(1.01).add(1))
                }
                return eff
            },
            1: {
                amt: new Decimal(0),
                mult: new Decimal(1),
                bought: new Decimal(0),
                cost(x) {
                    if (hasMilestone("T", 9) && this.bought.eq(0)) {
                        return new Decimal(0)
                    }

                    return new Decimal(2).pow(x)
                }
            },
            2: {
                amt: new Decimal(0),
                mult: new Decimal(1),
                bought: new Decimal(0),
                cost(x) {
                    return new Decimal(17).pow(x.times(1.1322).max(1)).floor()
                }
            },
            3: {
                amt: new Decimal(0),
                mult: new Decimal(1),
                bought: new Decimal(0),
                cost(x) {
                    return new Decimal(140).pow(x.times(3).add(1))
                }
            }
        }
    }},
    color: "rgb(255, 230, 0)",
    requires() {
        let r = new Decimal(1e40)

        if (hasUpgrade("T", 14)) {r = new Decimal(1e30)}
        
        return r
    }, // Can be a function that takes requirement increases into account
    resource: "Concepts", // Name of prestige currency
    baseResource: "Super", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let e = 1.1

        if (hasUpgrade("C", 71) && !hasUpgrade("T", 14)) e = 3.33
        if (hasUpgrade("T", 14)) e = 2
        if (hasChallenge("C", 15)) e = e - 0.33
        if (hasUpgrade("C", 91)) e = e - 0.5 //2.5
        if (hasChallenge("C", 16)) e = e - 1

        return Math.max(e, 0.01)
    },// Prestige currency exponent
    genmult() {
        let m = {
            1: new Decimal(1),
            2: new Decimal(1),
            3: new Decimal(1),
        }
        function add(x) {
            for (i in m) {
                m[i] = m[i].add(x)
            }
        }
        function multiply(x) {
            for (i in m) {
                m[i] = m[i].times(x)
            }
        }
        function pow(x) {
            for (i in m) {
                m[i] = m[i].pow(x)
            }
        }




        multiply(buyableEffect("C", 11))
        if (hasUpgrade("C",93)) {multiply(upgradeEffect("C", 93))}
        if (hasUpgrade("C",94)) {multiply(upgradeEffect("C", 94))}
        if (hasChallenge("C", 16)) {pow(1.014)}




        if (hasUpgrade("T",15)) {m[1] = m[1].pow(1.5)}
        if (hasUpgrade("T",16)) {m[2] = m[2].pow(1.25)}
        if (hasUpgrade("T",16)) {m[3] = m[3].pow(1.25)}

        for (i in m) {
            player.C.generator[i].mult = m[i] 
        }
    },
    
    
    canBuyMax() {
        let x = false
        if (hasUpgrade("C", 71)) x = true

        return x
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    directMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(dt) {
        if (inChallenge("C", 12)) {
            if (player.C.c12percent.sub(0.05).lte(0.001)) {
                player.C.c12percent = new Decimal(0.001)
            }
            else {
                player.C.c12percent = player.C.c12percent.sub(new Decimal(0.05).times(dt))
            }
        }


        player.C.generator.energy = player.C.generator.energy.add(player.C.generator[1].amt.times(player.C.generator[1].mult).times(dt))
        player.C.generator[1].amt = player.C.generator[1].amt.add(player.C.generator[2].amt.times(player.C.generator[2].mult).times(dt))
        player.C.generator[2].amt = player.C.generator[2].amt.add(player.C.generator[3].amt.times(player.C.generator[3].mult).times(dt))
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "C", description: "C: Reset for Concepts", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement("Ach", 23)},
    upgrades: {
        11: {
            title: "Conceptualize",
            description: "Unlock the Concept tree",
            branches: [21,22],
            cost() {
                if (player.C.total.gte(1)) {
                    return new Decimal(0)
                }
                else {
                    return new Decimal(9223372036854775808)
                }
            }
        },
        21: {
            title: "Point flow",
            description: "4x points",
            cost: new Decimal(1),
            branches: [31],
            canAfford() {
                return hasUpgrade("C", 11)
            }
        },
        22: {
            title: "Super Increase",
            description: "2x super",
            cost: new Decimal(1),
            branches: [32,33],
            canAfford() {
                return hasUpgrade("C", 11)
            }
        },
        31: {
            title: "Point factory",
            description: "16x points",
            cost: new Decimal(1),
            branches: [41],
            canAfford() {
                return hasUpgrade("C", 21)
            }
        },
        32: {
            title: "Super Increment",
            description: "4x super",
            cost: new Decimal(1),
            branches: [42],
            canAfford() {
                return hasUpgrade("C", 22)
            }
        },
        33: {
            title: "Supercore Robots",
            description: "3x Supercores",
            cost: new Decimal(1),
            branches: [43,44],
            canAfford() {
                return hasUpgrade("C", 22)
            }
        },
        41: {
            title: "Conceptpoints",
            description: "Total Concepts boosts points",
            cost: new Decimal(2),
            branches: [51],
            effectCap() {
                let cap = new Decimal(1e40)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].total.add(1).pow(2)

                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return hasUpgrade("C", 31)
            }
        },
        42: {
            title: "SuperConcept",
            description: "Total Concepts boosts Super",
            cost: new Decimal(2),
            branches: [52],
            effectCap() {
                let cap = new Decimal(1e40)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].total.add(1).pow(1.5)

                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return hasUpgrade("C", 32)
            }
        },
        43: {
            title: "Supercore Industry",
            description: "9x Supercores",
            cost: new Decimal(1),
            branches: [53],
            canAfford() {
                return hasUpgrade("C", 33)
            }
        },
        44: {
            title: "Supercore Shopping",
            description: "Double all supercore buyable caps",
            cost: new Decimal(2),
            branches: [54, 55],
            canAfford() {
                return hasUpgrade("C", 33)
            }
        },
        51: {
            title: "Point Planet",
            description: "100x Points",
            cost: new Decimal(2),
            branches: [61],
            canAfford() {
                return hasUpgrade("C", 41)
            }
        },
        52: {
            title: "Super System",
            description: "100x Super",
            cost: new Decimal(3),
            branches: [61],
            canAfford() {
                return hasUpgrade("C", 42)
            }
        },
        53: {
            title: "Supercore Star",
            description: "100x Supercores",
            cost: new Decimal(2),
            branches: [61],
            canAfford() {
                return hasUpgrade("C", 43)
            }
        },
        54: {
            title: "SuperchargeBoost?",
            description: "Supercharge cost is always 1000 BUT you can Buymax. You can also have decimal amount.",
            cost: new Decimal(3),
            branches: [61],
            canAfford() {
                return hasUpgrade("C", 44)
            }
        },
        55: {
            title: "Supercharge^14",
            description: "Supercharge purcahse limit is ^14 but is applied first (5^14)",
            cost: new Decimal(2),
            branches: [61],
            canAfford() {
                return hasUpgrade("C", 44)
            }
        },
        61: {
            title: "Pgen",
            description: "Generate 100% of your super on reset",
            cost: new Decimal(5),
            branches: [71,72,73,74,75],
            canAfford() {
                return hasUpgrade("C", 51) && hasUpgrade("C", 52) && hasUpgrade("C", 53) && hasUpgrade("C", 54) && hasUpgrade("C", 55) && player.C.points.gte(this.cost)
            }
        },
        71: {
            title: "Conceptual",
            requiredchallenge: 14,
            description() {
                let desc = (!hasUpgrade("T",14) ? "The concept cost scale goes up hyper-exponentially but you can buy max concepts" : "You can buy max concepts")

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(2),
            branches: [81],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        72: {
            title: "Radiant",
            requiredchallenge: 14,
            description() {
                let desc = "Supercharger's cap is multiplied by (cores/1000)^0.5 (Capped at 1e50)"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(10),
            branches: [81],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        73: {
            title: "Jack of all trades",
            requiredchallenge: 13,
            description() {
                let desc = "1e3x Points, Super and Cores"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(5),
            branches: [81],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        74: {
            title: "Stardust",
            requiredchallenge: 14,
            description() {
                let desc = "Always generate 200% Supercores, also 1e15x cores"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(12),
            branches: [81],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        81: {
            title: "Conceptual Generators",
            requiredchallenge: 15,
            description() {
                let desc = "Unlock the Conceptual Generators"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(16),
            branches: [91,92,93,94,95],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        91: {
            title: "Concept of bargain",
            requiredchallenge: 15,
            description() {
                let desc = "-0.5 Concept cost exponent"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(17),
            branches: [],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        92: {
            title: "Concept of repeat",
            requiredchallenge: 15,
            description() {
                let desc = "Unlock a buyable in generators"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(25),
            branches: [],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        93: {
            title: "Concept of linear",
            requiredchallenge: 15,
            description() {
                let desc = "Increase Conceptual Generator multiplier depending on Concept reset time"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(25),
            branches: [],
            effectCap() {
                let cap = new Decimal(60)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(player.C.resetTime).times(10).add(1)

                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        94: {
            title: "Concept of multiplication",
            requiredchallenge: 15,
            description() {
                let desc = "Increase Conceptual Generator multiplier depending on unspent Concepts"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(25),
            branches: [],
            effectCap() {
                let cap = new Decimal(100000)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(player.C.points).pow(1.5).add(1)

                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return format(upgradeEffect(this.layer, this.id))+"x (CAPPED)"
                }
                else {
                    return format(upgradeEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },
        95: {
            title: "Point Eternity",
            requiredchallenge: 15,
            description() {
                let desc = "1e20x points"

                if (hasChallenge("C", this.requiredchallenge)) {
                    return desc
                }
                else {
                    return "You need to beat Concept challenge: "+layers.C.challenges[this.requiredchallenge].name+" to unlock this!"
                }
            },
            cost: new Decimal(145),
            branches: [],
            canAfford() {
                return challengeCompletions("C", this.requiredchallenge) > 0 && player.C.points.gte(this.cost)
            }
        },

    },
    milestones: {
        1: {
            requirementDescription: "3 Total Concepts",
            effectDescription: "3x points",
            unlocked() {return true},
            done() {return player.C.total.gte(3)},
        },
        2: {
            requirementDescription: "6 Total Concepts",
            effectDescription: "2x Super",
            unlocked() {return true},
            done() {return player.C.total.gte(6)},
        },
        3: {
            requirementDescription: "10 Total Concepts",
            effectDescription: "2x Supercores",
            unlocked() {return true},
            done() {return player.C.total.gte(10)},
        },
        4: {
            requirementDescription: "15 Total Concepts",
            effectDescription: "Bragging rights",
            unlocked() {return true},
            done() {return player.C.total.gte(15)},
        },
        5: {
            requirementDescription: "30 Total Concepts",
            effectDescription: "Unlock Challenges",
            unlocked() {return true},
            done() {return player.C.total.gte(30)},
        },
        6: {
            requirementDescription: "111 Total Concepts",
            effectDescription: "Keep Superchargecharge on reset",
            unlocked() {return true},
            done() {return player.C.total.gte(111)},
        },
        7: {
            requirementDescription: "222 Total Concepts",
            effectDescription: "Keep Supercharge on reset",
            unlocked() {return true},
            done() {return player.C.total.gte(222)},
        },
        8: {
            requirementDescription: "333 Total Concepts",
            effectDescription: "Keep Superboost on reset",
            unlocked() {return true},
            done() {return player.C.total.gte(333)},
        },
        9: {
            requirementDescription: "444 Total Concepts",
            effectDescription: "Keep Supersupersuper on reset",
            unlocked() {return true},
            done() {return player.C.total.gte(444)},
        },
        10: {
            requirementDescription: "555 Total Concepts",
            effectDescription: "Keep Corecharge on reset",
            unlocked() {return true},
            done() {return player.C.total.gte(555)},
        },
    

    },
    buyables: {
        11: {
            title: "Grey matter",
            description() {
                return "1.2x Generator multiplier"
            },
            purchaseLimit() {  
                let x = new Decimal(1000)
                return x
            },
            unlocked() {return hasUpgrade("C", 92)},
            cost(x) {
                let c = new Decimal(1.5).pow(x)
                
                return c
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Concepts" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "/"+format(this.purchaseLimit())+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Concepts" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                try {
                    return player.C.points.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player.C.points = player.C.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effectbase(x) {
                let b = new Decimal(1)


                return b
            },
            effect(x) {
                let eff = new Decimal(1.2).pow(x)

               

                return eff
            },
        },
    },
    clickables: {
        9991: {
            title: "Reset points and concepts",
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
        9994: {
            title: "+1 Concept",
            canClick() {return true},
            onClick() {
                addPoints("C", 1)
            },
            display() {
                
            },
            unlocked() {
                return document.URL.split("/")[0] == "file:"
            }
            
        },
        11: {
            title: "Generator 1",
            gen: 1,
            display() {
                return "Cost: "+format(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))+"<br>You have: "+format(player.C.generator[this.gen].amt)+"<br>You bought: "+format(player.C.generator[this.gen].bought)+"<br>Multiplier: "+format(player.C.generator[this.gen].mult)+"x"
            },
            canClick() {return player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))},
            onClick() {
                if (player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))) {
                    player.C.points = player.C.points.sub(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))
                    player.C.generator[this.gen].amt = player.C.generator[this.gen].amt.add(1)
                    player.C.generator[this.gen].bought = player.C.generator[this.gen].bought.add(1) 
                    
                }
            },
            style() {
                return {
                    "height": "200px",
                    "width": "300px",
                }
            }
            
        },
        12: {
            title: "Generator 2",
            gen: 2,
            display() {
                return "Cost: "+format(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))+"<br>You have: "+format(player.C.generator[this.gen].amt)+"<br>You bought: "+format(player.C.generator[this.gen].bought)+"<br>Multiplier: "+format(player.C.generator[this.gen].mult)+"x"
            },
            canClick() {return player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))},
            onClick() {
                if (player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))) {
                    player.C.points = player.C.points.sub(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))
                    player.C.generator[this.gen].amt = player.C.generator[this.gen].amt.add(1)
                    player.C.generator[this.gen].bought = player.C.generator[this.gen].bought.add(1) 
                    
                }
            },
            style() {
                return {
                    "height": "200px",
                    "width": "300px",
                }
            }
            
        },
        13: {
            title: "Generator 3",
            gen: 3,
            display() {
                return "Cost: "+format(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))+"<br>You have: "+format(player.C.generator[this.gen].amt)+"<br>You bought: "+format(player.C.generator[this.gen].bought)+"<br>Multiplier: "+format(player.C.generator[this.gen].mult)+"x"
            },
            canClick() {return player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))},
            onClick() {
                if (player.C.points.gte(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))) {
                    player.C.points = player.C.points.sub(player.C.generator[this.gen].cost(player.C.generator[this.gen].bought))
                    player.C.generator[this.gen].amt = player.C.generator[this.gen].amt.add(1)
                    player.C.generator[this.gen].bought = player.C.generator[this.gen].bought.add(1) 
                    
                }
            },
            style() {
                return {
                    "height": "200px",
                    "width": "300px",
                }
            }
            
        },
    },
    challenges: {
        11: {
            name: "Antisupercharge",
            challengeDescription() { 
                let x = "You cant use supercharge and base core gain is /1e6"
                return x
            },
            goalDescription() {
                return "1e20 Super"
            },
            canComplete(){
                return player.S.points.gte(1e20)
            },
            unlocked() { 
                return (hasMilestone("C", 5)) 
            },
            rewardEffect() {
                return new Decimal(2)
            },
            inChallengeEffect() {
                return new Decimal(4)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "Supercharge also boosts cores"
                return x
            },
            onEnter() {
                player.points = player.points
            }
        },
        12: {
            name: "Linear Growth",
            challengeDescription() { 
                if (inChallenge(this.layer, this.id)) {
                    let x = "Lose 5% of your gain per second (min 0.1%)<br>Currently: "+format(player.C.c12percent.times(100))+"%"
                    return x
                }
                else {
                    let x = "Lose 5% of your gain per second (min 0.1%)"
                    return x
                }

            },
            goalDescription() {
                return "1e65 Super"
            },
            canComplete(){
                return player.S.points.gte(1e65)
            },
            unlocked() { 
                return (hasChallenge("C", 11)) 
            },
            rewardEffect() {
                let upg = player.C.upgrades.length
                return new Decimal(5).pow(new Decimal(upg).div(100).add(1)).pow(new Decimal(upg).max(2).log(2)).min(1e9)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                if (hasChallenge(this.layer, this.id)) {
                    let x = "Concept upgrades boost points<br>Currently: "+format(this.rewardEffect())+"x"+(this.rewardEffect().gte(1e9) ? " (CAPPED)" : "") 
                    return x
                }
                else {
                    let x = "Concept upgrades boost points"
                    return x
                }
            },
            onEnter() {
                player.C.c12percent = new Decimal(1)
            }
        },
        13: {
            name: "Pointless",
            challengeDescription() { 
                let x = "All point multipliers are disabled up to this point (get it)"
                return x
            },
            goalDescription() {
                return "1e45 Super"
            },
            canComplete(){
                return player.S.points.gte(1e45)
            },
            unlocked() { 
                return (hasChallenge("C", 12)) 
            },
            rewardEffect() {
                return new Decimal(1)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "10x points and all caps on super effect upgrades are 1.5x"
                return x
            },
        },
        14: {
            name: "Mayhem",
            challengeDescription() { 
                let x = "^0.8 Points, Super and Core"
                return x
            },
            goalDescription() {
                return "1e65 Super"
            },
            canComplete(){
                return player.S.points.gte(1e65)
            },
            unlocked() { 
                return (hasChallenge("C", 13)) 
            },
            inChallengeEffect() {
                return new Decimal(0.8)
            },
            rewardEffect() {
                return new Decimal(1)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "10x points and all caps on super effect upgrades are 1.5x"
                return x
            },
        },
        15: {
            name: "Chaos",
            countsAs: [11,12,13,14],
            challengeDescription() { 
                let x = "Every challenge so far and you cant earn cores but you unlock milestones 1-8"
                return x
            },
            goalDescription() {
                return "3e15 Super"
            },
            canComplete(){
                return player.S.points.gte(3e15)
            },
            unlocked() { 
                return (hasChallenge("C", 13)) 
            },
            inChallengeEffect() {
                return new Decimal(0.8)
            },
            rewardEffect() {
                return new Decimal(1)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "Keep super milestones, 1e15x Super, Cores and less Concept cost scale."
                return x
            },
            onEnter() {
                player.S.milestones = [1,2,3,4,5,6,7,8]
            }
        },
        16: {
            name: "Blank mind",
            countsAs: [11,12,13,14],
            challengeDescription() { 
                let x = "Point gain is ^0.01 but conceptual generators are unaffected"
                return x
            },
            goalDescription() {
                return "1e11 Points"
            },
            canComplete(){
                return player.points.gte(1e11)
            },
            unlocked() { 
                return (hasUpgrade("C", 81)) 
            },
            inChallengeEffect() {
                return new Decimal(0.8)
            },
            rewardEffect() {
                return new Decimal(1)
            },
            currencyDisplayName: "points",
            completionLimit: 1,
            rewardDescription() {
                let x = "^1.014 Generator Multiplier && -1 Concept cost exponent"
                return x
            },
            onEnter() {
                player.S.milestones = [1,2,3,4,5,6,7,8]
            }
        },
    },
    tabFormat: {
        "Tree": {
            content() {
                let c = []
                c.push("main-display")
                c.push("prestige-button")
                c.push("blank")
                c.push(["clickables", [999]])
                c.push("blank")
                for (let i = 1; i <= tmp.C.upgrades.rows; i++) {
                    c.push(["upgrades", [i]])
                    c.push("blank")
                }
                c.push("blank")


                return c
            },

            
    
            unlocked() {return true}
        },
        "Milestones": {
            content: [
                "main-display",
                ["clickables", [999]],
                "blank",
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 12)}
        },
        "Challenges": {
            content: [
                "main-display",
                "blank",
                "challenges",
                "blank",
            ],
    
            unlocked() {return hasMilestone("C", 5)}
        },
          "Generators": {
            content: [
                "main-display",
                ["display-text", function() { 
                    return 'You have <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.C.generator.energy) +'</h2> Conceptual Energy';
                }],
                ["display-text", function() { 
                    return 'Which is boosting point gain by <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.C.generator.effect(player.C.generator.energy)) +'</h2>x '+(player.C.generator.energy.pow(3).add(1).gte(1e100) ? "(CAPPED)" : "");
                }],
                "blank",
                ["clickables", [1]],
                "buyables",
                "blank",
            ],
    
            unlocked() {return hasUpgrade("C", 81) || hasMilestone("T", 9)}
        },
    },
})

