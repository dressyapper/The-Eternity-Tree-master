addLayer("C", {
    name: "Concepts", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(255, 230, 0)",
    requires: new Decimal(1e40), // Can be a function that takes requirement increases into account
    resource: "Concepts", // Name of prestige currency
    baseResource: "Super", // Name of resource prestige is based on
    baseAmount() {return player.S.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    update(dt) {

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
            cost: new Decimal(0),
            unlocked() {return player.C.total.gte(1)}
        },
        21: {
            title: "Point flow",
            description: "4x points",
            cost: new Decimal(1),
            branches: [31],
            unlocked() {return hasUpgrade("C", 11)}
        },
        22: {
            title: "Super Increase",
            description: "2x super",
            cost: new Decimal(1),
            branches: [32,33],
            unlocked() {return hasUpgrade("C", 11)}
        },
        31: {
            title: "Point factory",
            description: "16x points",
            cost: new Decimal(2),
            branches: [41],
            unlocked() {return hasUpgrade("C", 21)}
        },
        32: {
            title: "Super Increment",
            description: "4x super",
            cost: new Decimal(3),
            branches: [42],
            unlocked() {return hasUpgrade("C", 22)}
        },
        33: {
            title: "Supercore Robots",
            description: "3x Supercores",
            cost: new Decimal(1),
            branches: [43,44],
            unlocked() {return hasUpgrade("C", 22)}
        },
        41: {
            title: "Conceptpoints",
            description: "Concepts boosts points",
            cost: new Decimal(4),
            effectCap() {
                let cap = new Decimal(1e40)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].points.add(1).pow(2)

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
            unlocked() {return hasUpgrade("C", 33)}
        },
        42: {
            title: "SuperConcept",
            description: "Concepts boosts Super",
            cost: new Decimal(4),
            effectCap() {
                let cap = new Decimal(1e40)


                return cap
            },
            effect() {
                let cap = this.effectCap()
                let eff = player[this.layer].points.add(1).pow(1.5)

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
            unlocked() {return hasUpgrade("C", 33)}
        },
        43: {
            title: "Supercore Industry",
            description: "9x Supercores",
            cost: new Decimal(2),
            branches: [],
            unlocked() {return hasUpgrade("C", 22)}
        },
        44: {
            title: "Supercore Shopping",
            description: "Double all supercore buyable caps",
            cost: new Decimal(2),
            branches: [54],
            unlocked() {return hasUpgrade("C", 22)}
        },

        //no effect
        54: {
            title: "SuperchargerBoost?",
            description: "Supercharger cost is always 10",
            cost: new Decimal(1),
            branches: [64],
            unlocked() {return false}
        },
        64: {
            title: "SuperchargerMax",
            description: "You can now buy max Supercharger",
            cost: new Decimal(5),
            branches: [],
            unlocked() {return false}
        },
    },
    milestones: {
        1: {
            requirementDescription: "3 Concepts",
            effectDescription: "3x points",
            unlocked() {return true},
            done() {return player.C.points.gte(3)},
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
    },
})

