class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key:"BootScene",
            pack: {
                files: [
                    { type: "image", key: "boot-bg", url: "assets/images/boot-scene/boot-bg.png"},
                    { type: "image", key: "boot-bar", url: "assets/images/boot-scene/boot-bar.png"},
                    { type: "image", key: "boot-fill", url: "assets/images/boot-scene/boot-fill.png"}
                ]
            }
        })

        this.graphics = {}
    }

    init() {
        game.scene.add("BootShowScene", BootShowScene)
        game.scene.start("BootShowScene")

        //game.scene.start("preloadGame")
    }

    preload() {
        let folder = ""
        let resources = []

        // graphics in the scene
        this.graphics.bg = this.add.image(gWidth/2, gHeight/2, "boot-bg")
        this.graphics.bar = this.add.image(gWidth/2, gHeight*0.8, "boot-bar")
        this.graphics.fill = this.add.image(gWidth/2 -this.graphics.bar.width/2 + 10,
            gHeight*0.8, "boot-fill").setOrigin(0, 0.5).setScale(0)

        this.load.on("progress", (value)=> {
            this.graphics.fill.setScale(value*0.9, 1)
        })


        // --- Hjson ---
        this.load.text("game-text", "js/game-text.hjson")
        DATA.cartoonNames.forEach(c => {
            for (let i=1; i<=4; i++) {
                this.load.text("level-data-"+c+"-"+i, "js/levels/level-" + c + "-" +i+ ".hjson")
            }
        })
        this.load.text("game-config", "game-config.hjson")

        // --- fonts ---
        this.load.script('webfont', 'lib/webfont.js')
        let element = document.createElement('style')
        document.head.appendChild(element)
        let sheet = element.sheet
        let styles
        styles = '@font-face { font-family: "nunito"; src: url("assets/fonts/nunito-regular.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "trash-hand"; src: url("assets/fonts/trash-hand.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "a-hint-of-sass"; src: url("assets/fonts/a-hint-of-sass.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "sunnxooo"; src: url("assets/fonts/sunnxooo.otf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "lubalin-graph"; src: url("assets/fonts/lubalin-graph-bold-bt.ttf") format("opentype"); }\n';
        sheet.insertRule(styles, 0)

        // ---------------------------- Common UI ----------------------------
        this.load.atlas("box", "assets/images/common-ui/ui-box.png", "assets/images/common-ui/ui-box.json")
        this.load.atlas("box-dialog", "assets/images/common-ui/ui-box-dialog.png", "assets/images/common-ui/ui-box.json")
        this.loadResources([            
            "ui-transparent-bg",
            "button-ui-audio",
            "button-ui-pause",
            "button-ui-options",
            "title-decoration-left", "title-decoration-right",
            "button-close", "button-prev", "button-next", "button-red"
        ], "assets/images/common-ui/")


        // ---------------------------- splash scene ----------------------------
        resources = [
            "splash-bg", 
            "splash-button-play", 
            "splash-button-how-to-play"
        ]
        this.loadResources(resources, "assets/images/splash-scene/")


        // ---------------------------- help scene ----------------------------
        resources = []
        for (let i=1; i<= DATA.helpImages; i++) {
            resources.push("help-image"+i)
        }
        this.loadResources(resources
            /*[
            "help-image1", "help-image2", 
            "help-heart", "help-fruit", "help-omnitrix",
            "help-artifacts", "help-fruits"
        ]*/, "assets/images/help-scene/")

        // ---------------------------- level selection scene ----------------------------
        resources = [
            "level-selection-world-word",
            "button-level-selection-archievements",
            "button-level-selection-ranking",
            "button-level-selection-ranking-bn",
            "level-selection-name-section",
            "level-selection-avatar-section",
            "level-selection-avatar-placeholder"
        ]
        for (let i=1; i<=4; i++) {
            resources.push("button-level"+i)
            resources.push("button-level"+i+"-bn")
        }
        DATA.cartoonNames.forEach(cn => {
            resources.push("world-bg-"+cn)
            resources.push("world-logo-"+cn)
            resources.push("world-char-"+cn)
        })
        this.loadResources(resources, "assets/images/level-selection-scene/")

        // ---------------------------- level end scene ----------------------------
        DATA.characterNames.forEach(ch => {
            this.loadResources([
                "level-end-win-char-" + ch,
                "level-end-lost-char-" + ch
            ], "assets/images/level-end-scene/")
        })
        resources = [
            "level-end-star-on",
            "level-end-star-off",
            "level-end-score-panel"
        ]
        this.loadResources(resources, "assets/images/level-end-scene/")

        // ---------------------------- options scene ----------------------------
        resources = [
            "button-opt-levels", "button-opt-melody", 
            "button-opt-sfx", 
            "button-opt-help",
            "button-opt-home", "button-opt-archievements", 
            "button-opt-homepink", "button-opt-ranking", 
            "button-opt-restart", 
            "button-opt-play"
        ]
        this.loadResources(resources, "assets/images/options-scene/")

        
        // -------------------- archievements scene ---------------------
        resources = [
            "archievements-cup",
            "archievements-bg",
            "archievements-score-panel",
            "archievements-object-panel"
        ]
        
        this.loadResources(resources, "assets/images/archievements-scene/")

        // -------------------- character selection scene ---------------------
        resources = []
        Object.keys(DATA.charactersByWorld).forEach(world => {
            DATA.charactersByWorld[world].forEach(char => {
                resources.push("charselect-" +world+ "-"+ char)
            })
        })
        this.loadResources(resources, "assets/images/character-selection-scene/")

        // ---------------------------- ranking scene ----------------------------
        resources = [
            "ranking-slot-yellow", 
            "ranking-slot-cyan", 
            "ranking-slot-magenta",
            "ranking-slot-number",
            "ranking-gumball"
        ]
        DATA.medalNames.forEach(m => {
            resources.push("ranking-medal-" + m)
        })
        this.loadResources(resources, "assets/images/ranking-scene/")

        // --------------------------- game end scene ----------------------------
        resources = [
            "splash-bg", 
            "splash-button-play", 
            "splash-button-how-to-play"
        ]
        this.loadResources(resources, "assets/images/splash-scene/")

        // ---------------------------- game scene ----------------------------
        resources = [
            "game-end-apple", "game-end-star", "game-end-archievements",
            "game-end-blossom", "game-end-buttercup", "game-end-bubbles",
            "game-end-steven", "game-end-bears",
            "game-end-dialog-box", "game-end-panel"
        ]
        this.loadResources(resources, "assets/images/game-end-scene/")






        // game
        for (var i=0; i<DATA.characterNames.length; i++) {
            let cName = DATA.characterNames[i]
            this.load.atlas("character-"+cName, 
                "assets/images/game-scene/characters/character-"+cName+".png", 
                "assets/images/game-scene/characters/character-"+cName+"_atlas.json")
            
            this.load.spritesheet("character-"+cName+"-die",
            "assets/images/game-scene/characters/character-"+cName+"-die.png",
            {frameWidth: 250, frameHeight: 185})
            
            this.load.image(cName+"-shoot", 
            "assets/images/game-scene/effects/"+cName+"-shoot.png")
            
        }
        this.load.image("enem-shoot", 
        "assets/images/game-scene/effects/enem-shoot.png")

        Object.keys(DATA.bossAnims).forEach(boss => {
            this.load.image("boss-" + boss + "-shoot", 
            "assets/images/game-scene/effects/boss-"+boss+"-shoot.png")
        })
        /*for (var i=0; i<DATA.friendNames.length; i++) {
            let fName = DATA.friendNames[i]
            this.
        }*/
        resources = []
        Object.entries(DATA.alliesByWorld).forEach(wArray => {
            let wrd = wArray[0]
            let names = wArray[1]
            names.forEach(al => {
                //resources.push("ally-" + wrd +"-"+ al)

                
                this.load.atlas("ally-" + wrd +"-"+ al[0],
                "assets/images/game-scene/allies/ally-" + wrd + "-" + al[0] + ".png",
                "assets/images/game-scene/allies/ally-" + wrd + "-" + al[0] + "_atlas.json")
                /*this.load.spritesheet("ally-" + wrd +"-"+ al,
                "assets/images/game-scene/allies/" 
                + "ally-" + wrd +"-"+ al + ".png",
                {frameWidth: 181, frameHeight: 221})*/
            })
        })
        //this.loadResources(resources, "assets/images/game-scene/allies/")
        
        DATA.fruitNames.forEach(fr=> {
            this.load.spritesheet("game-fruit-" + fr, "assets/images/game-scene/collectables/"
            + "game-fruit-" + fr + "-sheet.png", {frameWidth: 200, frameHeight: 200})
        })

        // bosses
        let bossFolder = "assets/images/game-scene/bosses/"
        Object.keys(DATA.bossAnims).forEach(boss => {
            this.load.atlas("boss-"+boss, 
                bossFolder + "boss-" + boss + ".png", 
                bossFolder + "boss-" + boss + "_atlas.json")
        })

        resources = [
            "enemy-smash",
            "tile"
        ]
        this.loadResources(resources, "assets/images/game-scene/")

        DATA.cartoonNames.forEach(cn => {
            this.load.spritesheet("portal-"+cn, "assets/images/game-scene/structures/portal-" + cn + ".png", {
                frameWidth: 146, frameHeight: 416
            })
        })

        resources = [
            "platform-mini", "platform", 
            /*"platform-left", "platform-right", "platform-center",*/
            "floor",
            "platform-vertical", "platform-vertical-mini",
            "end"
        ]
        let rl = []
        DATA.cartoonNames.forEach(cn => {
            for (let lvl=1; lvl<=4; lvl++) {
                resources.forEach(res => {
                    rl.push(cn + "-lvl" + lvl + "-" + res)
                })
            }
        })
        this.loadResources(rl, "assets/images/game-scene/structures/")
        

        resources = []
        for(let i=0; i<DATA.cartoonNames.length; i++) {
            for (let lvl=1; lvl<=4; lvl++) {
                for (let j = 1; j<=3; j++) {
                    resources.push(DATA.cartoonNames[i] + "-lvl"+lvl+"-key"+j)
                    resources.push(DATA.cartoonNames[i] + "-lvl"+lvl+"-door"+j)
                }
            }
        }
        this.loadResources(resources, "assets/images/game-scene/doors/")

        resources = [
            "foreback1", "foreback2", "foreback3", "foreback4", "foreback5", 
            "midback1", "midback2", "skyback1", "skyback2", "backback1",
            "backimage",
            "furniture1", "furniture2", "furniture3", "furniture4", "furniture5"
        ]
        for (var i=0; i<DATA.cartoonNames.length; i++) {
            let rl = []
            resources.forEach((r, j)=> {
                for (let lvl = 1; lvl <= 4; lvl++) {
                    rl.push(DATA.cartoonNames[i] + "-lvl"+ lvl + "-" + r)
                }
            })
            this.loadResources(rl, "assets/images/game-scene/furniture/")
        }
        /*resources = ["flying-1", "flying-2", "walking-1"]
        for (var i=0; i<DATA.cartoonNames.length; i++) {
            let rl = [...resources]
            rl.forEach((r, j)=> {
                rl[j] = "enemy-" + DATA.cartoonNames[i] + "-" + r
            })
            this.loadResources(rl, "assets/images/game-scene/enemies/")
        }*/

        let enemiesFolder = "assets/images/game-scene/enemies/"
        Object.entries(DATA.enemiesByWorld).forEach(worldObj => {
            let world = worldObj[0]
            let enemiesInWorld = worldObj[1]


            enemiesInWorld.forEach(enem => {
                this.load.atlas(`enemy-${world}-${enem.name}`,
                `${enemiesFolder}enemy-${world}-${enem.name}.png`,
                `${enemiesFolder}enemy-${world}-${enem.name}_atlas.json`)
            })
        })

        // Game UI
        resources =[
            "button-left", "button-right",
            "button-jump", "button-pow",
            "ui-power-bar",
            "ui-power-fill",
            "ui-thunder"
        ]
        let rs = [
            "button-pause",
            "ui-bubble-key",
            "ui-heart"]
        DATA.cartoonNames.forEach(cn => {
            resources.forEach(r => {
                rs.push(cn + "-" + r)
            })
        })
        this.loadResources(rs, "assets/images/game-scene/ui/")
        

        

        // BONUS
        resources = []
        let bonusResources = []
        DATA.bonusNames.forEach(b => {
            resources.push("game-" + b)
            bonusResources.push("logros-ui-" + b)
            bonusResources.push("logros-ui-" + b + "-bn")
        })
        this.loadResources(resources, "assets/images/game-scene/collectables/")
        this.loadResources(bonusResources, "assets/images/gamification/")

        // artifacts
        resources = []
        bonusResources = []
        let words = ["left", "right", "none", "both"]

        DATA.artifactNames.forEach(ar => {
            resources.push("game-artifact-" + ar + "-left")
            resources.push("game-artifact-" + ar + "-right")

            words.forEach(w => {
                bonusResources.push("logros-ui-artifact-" + ar + "-" + w)
            })
        })
        this.loadResources(resources, "assets/images/game-scene/collectables/")
        this.loadResources(bonusResources, "assets/images/gamification/")

        // more collectables
        resources = []
        DATA.cartoonNames.forEach(cn => {
            resources.push("game-power-" + cn)
        })
        this.loadResources(resources, "assets/images/game-scene/collectables/")

        resources = []
        DATA.medalNames.forEach(m => {
            resources.push("logros-ui-medalla-r-" + m)
            resources.push("logros-ui-medalla-r-" + m + "-bn")
        })
        this.loadResources(resources, "assets/images/gamification/")


        //resources = []
        DATA.fruitNames.forEach(fr => {
            this.load.image("fruit-ui-" + fr,
            "assets/images/gamification/fruit-ui-" + fr + ".png")
        })
        DATA.alienNames.forEach(a => {
            this.load.image("omni-champ-ui-" + a,
            "assets/images/gamification/omni-champ-ui-" + a + ".png")
            this.load.image("omni-champ-ui-" + a + "-bn",
            "assets/images/gamification/omni-champ-ui-" + a + "-bn.png")
        })
    }

    create() {        
        this.input.addPointer(2);
        DATA.text = Hjson.parse(this.cache.text.get("game-text"))
        DATA.game = Hjson.parse(this.cache.text.get("game-config"))
        DATA.levelData = {}
        DATA.cartoonNames.forEach(cn => {
            DATA.levelData[cn] = []
            for (let i=1; i<=4; i++) {
                DATA.levelData[cn].push(
                    Hjson.parse(this.cache.text.get("level-data-"+cn+"-"+i))
                )
            }
        })

        //DATA.getGamificationDistribution()

        Enemy.def.shoot = DATA.game.enemyDefaultShoot

        let animTypes = ["walk", "jump", "pow", "stand", "wait", "die-air", "die-angel"]
        let animFrames = [4, 1, 3, 4, 7, 2, 2]
        let animRepeat = [-1, 0, 0, -1, 0, 0, -1]
        for (let i=0; i<DATA.characterNames.length; i++) {
            let cName = DATA.characterNames[i]
            for (let j=0; j<animTypes.length; j++) {
                let an = this.anims.create({
                    key: cName + "-" + animTypes[j],
                    frames: this.anims.generateFrameNames("character-"+cName, {
                        end: animFrames[j],
                        //end: 0,
                        prefix: "character-"+cName.toLowerCase()+"-"+animTypes[j]
                    }),
                    frameRate: DATA.game.characterFrameRate,
                    repeat: animRepeat[j]
                })
            }

            this.anims.create({
                key: "character-" + cName + "-die",
                frames: this.anims.generateFrameNumbers(
                    "character-" + cName + "-die", {
                    start: 0, end: 4
                }),
                frameRate: 10,
                repeat: 0
            })
            this.anims.create({
                key: "character-" + cName + "-diestand",
                frames: this.anims.generateFrameNumbers(
                    "character-" + cName + "-die", {
                    start: 3, end: 4
                }),
                frameRate: 8,
                repeat: -1
            })
        }

        DATA.fruitNames.forEach(fr => {
            this.anims.create({
                key: "game-fruit-" + fr + "-explode",
                frames: this.anims.generateFrameNumbers("game-fruit-" + fr, {
                    start: 0, end: 4
                }),
                frameRate: 15,
                repeat: 0
            })
        })

        DATA.cartoonNames.forEach(cn => {
            this.anims.create({
                key: "portal-" + cn + "-anim",
                frames: this.anims.generateFrameNumbers("portal-" + cn, {
                    start: 0, end: 3
                }),
                frameRate: 10,
                repeat: -1
            })
        })

        Object.entries(DATA.alliesByWorld).forEach(wArray => {
            let wrd = wArray[0]
            let names = wArray[1]
            names.forEach(al => {
                this.anims.create({
                    key: "ally-" + wrd +"-"+ al[0] + "-anim",
                    frames: this.anims.generateFrameNames(
                        "ally-" + wrd +"-"+ al[0], {
                            prefix: "ally-" + wrd +"-"+ al[0], 
                            end: Number(al[1])
                        }),
                    frameRate: 3,
                    repeat: 0
                })

                this.anims.create({
                    key: "ally-" + wrd +"-"+ al[0] + "-stand",
                    frames: this.anims.generateFrameNames(
                        "ally-" + wrd +"-"+ al[0], {
                            prefix: "ally-" + wrd +"-"+ al[0], 
                            end: 1
                        }),
                    frameRate: 3,
                    repeat: 0
                })
            })
        })

        // --------- enemies animations ------------
        let enemiesFolder = "assets/images/game-scene/enemies/"
        let enemyAnimationTypes = ["stand", "pow", "die", "walk"]
        let enemyAnimationFrameRates =  [7, 15, 12, 5]

        Object.entries(DATA.enemiesByWorld).forEach(worldObj => {
            let world = worldObj[0]
            let enemiesInWorld = worldObj[1]
            
            enemiesInWorld.forEach(enem => {
                
                    enemyAnimationTypes.forEach((an,i) => {
                        if (enem[an])
                        {
                            let a = this.anims.create({
                                key: `enemy-${world}-${enem.name}-${an}`,
                                frames: this.anims.generateFrameNames(
                                    `enemy-${world}-${enem.name}`, {
                                        prefix: `enemy-${world}-${enem.name}-${an}`, 
                                        end: enem[an]
                                    }),
                                frameRate: enemyAnimationFrameRates[i],
                                repeat: an == "pow"? 0 : -1
                            })
                        }
                    })
                
                

                /*
                this.load.atlas(`enemy-${world}-${enem.name}`,
                `${enemiesFolder}enemy-${world}-${enem.name}.png`,
                `${enemiesFolder}enemy-${world}-${enem.name}_atlas.json`)*/
            })
        })

        // --------- boss animations ------------
        // iceking

        Object.keys(DATA.bossAnims).forEach(bossName => {
            Object.entries(DATA.bossAnims[bossName]).forEach(a => {
                let animName = a[0]
                let framesAmount = a[1][0]
                let repeatAnim = a[1][1]
                
                this.anims.create({
                    key: "boss-" + bossName + "-" + animName,
                    frames: this.anims.generateFrameNames(
                        "boss-" + bossName, {
                            end: framesAmount,
                            prefix: "boss-" + bossName + "-" + animName
                        }
                    ),
                    frameRate: 11,
                    repeat: repeatAnim
                })
            })
        })

        WebFont.load({
            custom: {
                families: [ 'nunito', 'trash-hand', 'sunnxooo', 'a-hint-of-sass', 'lubalin-graph' ]
            }, active: ()=> {
                this.tweens.add({
                    targets: [this.graphics.fill],
                    duration: 300,
                    scale: 1,
                    onComplete: ()=> {
                        //this.scene.sendToBack()
                        game.scene.start("SplashScene")
                    }
                })
                //this.scene.start("SplashScene")
            }
        })
    }

    update(w,d) {
        //console.log("update: ", w)
    }

    loadResources(resourceArray, folder, extension=".png") {
        resourceArray.forEach(r => {
            this.load.image(r, folder + r.toLowerCase() + extension)
        })
    }
}

class BootShowScene extends Phaser.Scene {
    constructor() {
        super("BootShowScene") 

    }

    create() {

    }
}