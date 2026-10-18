addLayer("S", {
    name: "Super", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),

        supercores: new Decimal(0),
        supercorecostbase: new Decimal(500000),
    }},
    color: "rgb(0, 255, 255)",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Super", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("S", 14)) {mult = mult.times(2)}
        if (hasUpgrade("S", 16)) {mult = mult.times(1.5)}
        if (hasUpgrade("S", 21)) {mult = mult.times(2)}
        if (hasUpgrade("S", 22)) {mult = mult.times(upgradeEffect("S", 22))}
        if (hasUpgrade("S", 25)) {mult = mult.times(3)}
        if (hasMilestone("S", 3)) {mult = mult.times(4)}
        if (hasMilestone("S", 4)) {mult = mult.times(10)}
        if (hasMilestone("S", 5)) {mult = mult.times(100)}
        if (hasUpgrade("S", 31)) {mult = mult.times(upgradeEffect("S", 31))}
        mult = mult.times(buyableEffect("S", 14).pow(0.5+(hasUpgrade("S",45)*0.5))) //no way i didnt use decimal here
        mult = mult.times(buyableEffect("S", 15))
        if (hasUpgrade("C", 22)) {mult = mult.times(2)}
        if (hasUpgrade("C", 32)) {mult = mult.times(4)}
        if (hasUpgrade("C", 42)) {mult = mult.times(upgradeEffect("C", 42))}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(dt) {
        if (hasUpgrade("S",34) && !player.paused) {
            player.S.supercores = player.S.supercores.add(layerS.getcoregain().times(tmp.S.coremult).times(0.05).times(dt))
        }
    },
    corecostbase() {
        let c = new Decimal(500000)

        c = c.div(new Decimal(1.1).pow(getBuyableAmount("S", 13)))

        player.S.supercorecostbase = c.floor()
        return c
    },
    coremult() {
        let m = new Decimal(1)

        m = m.times(buyableEffect("S", 13))
        if (hasUpgrade("S",32)) m = m.times(upgradeEffect("S", 32))
        m = m.times(buyableEffect("S", 14))
        if (hasUpgrade("C",33)) m = m.times(3)
        if (hasUpgrade("C",43)) m = m.times(9)

        return m
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "S", description: "S: Reset for Super", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    branches: ["S", "C"],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "The first upgrade!",
            description: "2x point gain",
            cost: new Decimal(1),
        },
        12: {
            title: "The second upgrade!",
            description: "3x point gain",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade("S", 11)}
        },
        13: {
            title: "Quadgrade",
            description: "4x point gain",
            cost: new Decimal(4),
            unlocked() {return hasUpgrade("S", 12)}
        },
        14: {
            title: "Not alot to do at this stage",
            description: "2x super gain",
            cost: new Decimal(9),
            unlocked() {return hasUpgrade("S", 13)}
        },
        15: {
            title: "Extra Points",
            description: "Boost points based on themselves",
            cost: new Decimal(20),
            effectCap() {
                let cap = new Decimal(1e15)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.points.add(1).log(5).add(1)
                if (hasUpgrade("S", 23)) {eff = eff.times(1.5)}
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
            unlocked() {return hasUpgrade("S", 14)}
        },
        16: {
            title: "Double trouble",
            description: "1.5x points & super",
            cost: new Decimal(35),
            unlocked() {return hasUpgrade("S", 15)}
        },
        21: {
            title: "Double Double",
            description: "2x points & super",
            cost: new Decimal(70),
            unlocked() {return hasUpgrade("S", 16)}
        },
        22: {
            title: "trouble trouble",
            description: "Boost super based on itself",
            cost: new Decimal(500),
            effectCap() {
                let cap = new Decimal(1e15)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].points.add(1).log(25).add(1)

                if (hasUpgrade("S", 23)) {eff = eff.times(1.5)}
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
            unlocked() {return hasUpgrade("S", 21)}
        },
        23: {
            title: "trouble Double",
            description: "Extra Points and trouble trouble effects are boosted by 1.5x",
            cost: new Decimal(1500),
            unlocked() {return hasUpgrade("S", 22)}
        },
        24: {
            title: "Quadquadgrade",
            description: "16x points",
            cost: new Decimal(4444),
            unlocked() {return hasUpgrade("S", 23)}
        },
        25: {
            title: "Increasing",
            description: "3x super",
            cost: new Decimal(1.75e5),
            unlocked() {return hasUpgrade("S", 24)}
        },
        26: {
            title: "Extreme",
            description: "100x points",
            cost: new Decimal(1e9),
            unlocked() {return hasUpgrade("S", 25)}
        },
        31: {
            title: "Coreunion",
            description: "Supercores boost Points and Super",
            cost: new Decimal(5e11),
            effectCap() {
                let cap = new Decimal(100)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].supercores.add(1).log(10).max(1)

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
            unlocked() {return hasUpgrade("S", 26) && hasMilestone("S", 6)}
        },
        32: {
            title: "Supercoreversed",
            description: "Points and Super boost core gain",
            cost: new Decimal(5e13),
            effectCap() {
                let cap = new Decimal(100)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player.points.times(player[this.layer].points).add(1).log(10).max(1)

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
            unlocked() {return hasUpgrade("S", 31)}
        },
        33: {
            title: "The row all about supercores",
            description: "Multiply the core buyable caps based on Super",
            cost: new Decimal(5.01e13),
            effectCap() {
                let cap = new Decimal(5)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].points.add(1).log(5e3).floor().max(1)

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
            unlocked() {return hasUpgrade("S", 32)}
        },
        34: {
            title: "Supercore Factory",
            description: "Generate 5% of your core on reset",
            cost: new Decimal(1.5e14),
            unlocked() {return hasUpgrade("S", 33)}
        },
        35: {
            title: "Slightly more useful",
            description: "Supercharge is now 1.5x better",
            cost: new Decimal(4e14),
            unlocked() {return hasUpgrade("S", 34)}
        },
        36: {
            title: "Thats right more supercore gameplay",
            description: "Unlock a new supercore buyable",
            cost: new Decimal(5e14),
            unlocked() {return hasUpgrade("S", 35)}
        },
        41: {
            title: "Superpoints",
            description: "Super boosts points",
            cost: new Decimal(4e30),
            effectCap() {
                let cap = new Decimal(1e100)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].points.log(2)

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
            unlocked() {return hasUpgrade("S", 36)}
        },
        42: {
            title: "Superchargington",
            description: "Supercharge is now +10x",
            cost: new Decimal(3e31),
            unlocked() {return hasUpgrade("S", 41)}
        },
        43: {
            title: "Supercharge^2",
            description: "Superchargecharge boosts supercharges effect",
            cost: new Decimal(1e33),
            effectCap() {
                let cap = new Decimal(1e100)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = new Decimal(getBuyableAmount("S", 12)).div(10)

                if (eff.gte(cap)) {
                    return cap
                }
                else {
                    return eff
                }
            },
            effectDisplay() {
                if (this.effect().gte(this.effectCap())) {
                    return "+"+format(upgradeEffect(this.layer, this.id))+" (CAPPED)"
                }
                else {
                    return "+"+format(upgradeEffect(this.layer, this.id))+""
                }
            },
            unlocked() {return hasUpgrade("S", 42)}
        },
        44: {
            title: "Coresupercharge",
            description: "+0.1 core multiplier to supercore ",
            cost: new Decimal(3.33e33),
            unlocked() {return hasUpgrade("S", 43)}
        },
        45: {
            title: "SuperBoostCharge",
            description: "Make SuperBoost boost points and super without the square root",
            cost: new Decimal(1e34),
            unlocked() {return hasUpgrade("S", 44)}
        },
        46: {
            title: "Super^3",
            description: "Increase the exponent for supersupersuper effect from 10 to 10.5",
            cost: new Decimal(5e38),
            unlocked() {return hasUpgrade("S", 45)}
        },
        
    },
    milestones: {
        1: {
            requirementDescription: "200 Super",
            effectDescription: "3x points",
            unlocked() {return true},
            done() {return player.S.points.gte(200)},
        },
        2: {
            requirementDescription: "20000 Super",
            effectDescription: "20x points",
            unlocked() {return true},
            done() {return player.S.points.gte(20000)},
        },
        3: {
            requirementDescription: "2e6 Super",
            effectDescription: "Hey why do these multiply by 100x each time anyways 4x super",
            unlocked() {return true},
            done() {return player.S.points.gte(2e6)},
        },
        4: {
            requirementDescription: "50000 Supercores",
            effectDescription: "10x Super",
            unlocked() {return player.S.supercores.gte(10000) || hasAchievement("Ach",24)},
            done() {return player.S.supercores.gte(50000)},
        },
        5: {
            requirementDescription: "2e8 Super and 8 Corecharges",
            effectDescription: "100x Super",
            unlocked() {return getBuyableAmount("S", 13) >= 5 && getBuyableAmount("S", 11) >= 255 || hasAchievement("Ach",24)},
            done() {return player.S.points.gte(2e8) && getBuyableAmount("S", 13) >= 8},
        },
        6: {
            requirementDescription: "1e10 Supercores, 255 Supercharges, 50 Superchargecharges, 10 Corecharges and 1e12 Super",
            effectDescription: "Thats a few goals, unlock more upgrades",
            unlocked() {return hasMilestone("S", 5) || hasMilestone(this.layer, this.id) || hasAchievement("Ach",24)},
            done() {return player.S.points.gte(1e12) && getBuyableAmount("S", 11) >= 255 && getBuyableAmount("S", 12) >= 50 && getBuyableAmount("S", 13) >= 10 && player.S.supercores.gte(1e10)},
        },
        7: {
            requirementDescription: "50 Corecharges and 1e20 Super",
            effectDescription: "Unlock another... You guessed it",
            unlocked() {return hasAchievement("Ach", 22) || hasAchievement("Ach",24)},
            done() {return player.S.points.gte(1e20) && getBuyableAmount("S", 13) >= 50},
        },
        8: {
            requirementDescription: "1e30 Super",
            effectDescription: "More upgrades",
            unlocked() {return getBuyableAmount("S", 15) >= 6 || hasAchievement("Ach",24)},
            done() {return player.S.points.gte(1e30)},
        },
    },
    buyables: {
        11: {
            title: "Supercharge",
            description() {
                return "Boost Points by +"+this.effectbase()+"x"
            },
            purchaseLimit() {
                
                let x = new Decimal(5)
                x = x.add(new Decimal(getBuyableAmount(this.layer, 12)).times(5))
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                return x
            },
            unlocked() {return true},
            cost(x) {
                let c = new Decimal(new Decimal(1.5).div(new Decimal(1.1).pow(getBuyableAmount(this.layer, 12))).max(1)).pow(x).times(new Decimal(x).div(10).add(1)).floor()
                
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
                    return player.S.supercores.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player.S.supercores = player.S.supercores.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effectbase(x) {
                let b = new Decimal(1)

                if (hasUpgrade("S", 35)) b = new Decimal(1.5)
                if (hasUpgrade("S", 42)) b = new Decimal(10)
                if (hasUpgrade("S", 43)) b = b.add(new Decimal(upgradeEffect("S", 43)))

                return b
            },
            effect(x) {
                let b = this.effectbase()
                let eff = new Decimal(x).times(b).add(1)

               

                return eff
            },
        },
        12: {
            title: "Superchargecharge",
            description: "Increase the buy limit for supercharge by +5 AND divide its cost base by /1.1, also this doesnt take cores.",
            purchaseLimit() {
                let x = new Decimal(50)
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                return x
            },
            unlocked() {return hasAchievement("Ach", 14)},
            cost(x) {
                let c = new Decimal(new Decimal(x).times(5)).pow(2.5).div(100).add(5).add(x).floor(5)
                
                return c
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description+"<br>Requires: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "/"+format(this.purchaseLimit())+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x" 
                }
                else {
                    return ""+this.description+"<br>Requires: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                try {
                    return player.S.supercores.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = new Decimal(x).times(5)

               

                return eff
            },
        },
        13: {
            title: "Corecharge",
            description() {return "Multiply core gain by "+this.effectbase()+"x and lower core base by /1.1"},
            purchaseLimit() {
                let x = new Decimal(10)
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                return x
            },
            unlocked() {return hasAchievement("Ach", 15)},
            cost(x) {
                let c = new Decimal(10).pow(x)
                
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
                    return player.S.supercores.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player.S.supercores = player.S.supercores.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effectbase() {
                let b = new Decimal(5)

                if (hasUpgrade("S", 44)) b = b.add(0.3)
                return b
            },
            effect(x) {
                let eff = new Decimal(this.effectbase()).pow(x)

               

                return eff
            },
        },
        14: {
            title: "SuperBoost",
            description() {if (hasUpgrade("S", 45)) {return "Multiply Core, Super and Points. Buying this will also reset your cores."} else {return "Multiply Core, Super and Points. The effect is square rooted to points and super. Buying this will also reset your cores."}},
            purchaseLimit() {
                let x = new Decimal(4)
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                return x
            },
            unlocked() {return hasUpgrade("S", 36)},
            cost(x) {
                let c = new Decimal(1e22).pow(new Decimal(x).div(30).add(1))
                
                return c
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "/"+format(this.purchaseLimit())+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x, "+format(buyableEffect(this.layer, this.id).pow(0.5))+"x" 
                }
                else {
                    return ""+this.description()+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x, "+format(buyableEffect(this.layer, this.id).pow(0.5))+"x"
                }
            },
            canAfford() {
                try {
                    return player.S.supercores.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player.S.supercores = new Decimal(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = new Decimal(2).pow(x)

               

                return eff
            },
        },
        15: {
            title: "Supersupersuper",
            description: "Boost Super",
            purchaseLimit() {
                let x = new Decimal(4)
                if (hasUpgrade("S", 33)) x = x.times(upgradeEffect("S", 33))
                if (hasUpgrade("C", 44)) x = x.times(2)
                return x
            },
            unlocked() {return hasMilestone("S", 7)},
            cost(x) {
                let c = new Decimal(1e50).pow(new Decimal(x).div(100).add(1)).times(new Decimal(x).div(10).max(1).pow(10))
                
                return c
            },
            display() {
                if (this.purchaseLimit()) {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "/"+format(this.purchaseLimit())+"<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
                else {
                    return ""+this.description+"<br>Cost: " + format(this.cost()) + " Cores" + "<br>Bought: " + format(getBuyableAmount(this.layer, this.id)) + "<br>Effect: "+format(buyableEffect(this.layer, this.id))+"x"
                }
            },
            canAfford() {
                try {
                    return player.S.supercores.gte(this.cost())
                }
                catch {
                    return false
                }
            },
            buy() {
                if (player[this.layer].points.sign == -1) return
                player.S.supercores = player.S.supercores.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                let eff = new Decimal(x).add(1).pow(10)
                if (hasUpgrade("S", 46)) eff = new Decimal(x).add(1).pow(10.5)

               

                return eff
            },
        },
    },
    clickables: {
        11: {
            title: "Reset for Super Core",
            display() {
                if (layerS.getcoregain().gte(1)) {
                    return "Reset for "+format(layerS.getcoregain().times(tmp.S.coremult))+"<br>Next at "+format(layerS.getcorereq(layerS.getcoregain().add(1)))
                }
                else {
                    return "You need "+format(layerS.getcorereq(layerS.getcoregain().add(1)))+" to reset"
                }
            },
            canClick() {return layerS.getcoregain().gte(1)},
            onClick() {
                
                let gain = layerS.getcoregain()
                let buyables = [getBuyableAmount("S", 11), getBuyableAmount("S", 12), getBuyableAmount("S", 13), getBuyableAmount("S", 14), getBuyableAmount("S", 15)]
                let milestone = []
                if (hasMilestone("S", 4)) {
                    milestone.push(4)
                }
                if (hasMilestone("S", 6)) {
                    milestone.push(6)
                }
                player.points = new Decimal(0)
                layerDataReset(this.layer, ["supercores"])
                player.S.supercores = player.S.supercores.add(gain.times(tmp.S.coremult))
                player.S.buyables[11] = buyables[0]
                player.S.buyables[12] = buyables[1]
                player.S.buyables[13] = buyables[2]
                player.S.buyables[14] = buyables[3]
                player.S.buyables[15] = buyables[4]

                player.S.milestones = milestone


            
            },
            style() {
                return {
                    "height": "200px",
                    "width": "300px",
                }
            }
            
        },
        9991: {
            title: "Reset points and super",
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
                ["clickables", [999]],
                "blank",
                "milestones",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 12)}
        },
        "Boost": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "blank",
                ["display-text", function() { 
                    return 'You have <h2 style="color: ' + tmp[this.layer].color + +'; text-shadow: 0px 0px 10px ' + tmp[this.layer].color + '; display: inline;"> ' + format(player.S.supercores) +'</h2> Super Cores';
                }],
                "blank",
                ["display-text", function() { 
                    if (!hasUpgrade("S", 34)) {
                        return ""
                    }
                    return 'You are generating '+format(layerS.getcoregain().times(tmp.S.coremult).times(0.05))+" Cores every second"
                }],
                "blank",
                ["clickable",[11]],
                "blank",
                "buyables",
                "blank",
            ],
    
            unlocked() {return hasAchievement("Ach", 13)}
        },
    },
})

let layerS = {
    cost() {
        return new Decimal(player.S.supercorecostbase).pow()
    },
    getcoregain() {
        return player.S.points.div(new Decimal(player.S.supercorecostbase)).floor().pow(0.5).floor()
    },
    getcorereq(x) {
        return x.pow(2).times(new Decimal(player.S.supercorecostbase))
    }
}