class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene")

        // UI
        this.uiScene
        this.cursors

        // data
        this.levelNumber
        this.levelData
        this.levelLengthX
        this.levelLengthY
        this.levelWidth
        this.levelHeight
        this.tileSize



        // game background
        this.player
        this.platforms
        this.bg1
        this.bg2
        this.floor
        this.clouds

        this.enemies
        this.bosses
        this.enemySmash
        this.bonus
        this.levelEnd
        this.allies

        this.playerShoots
        this.playerShootsCooldown
        this.enemyShoots

        this.playerHasControl

        // gamification
        this.collected
        this.enemiesKilled
        this.omnitrixScore
        this.omnitrixCollected
        this.keysCollected
        this.doors

        this.score

        this.fruitNames
        this.bonusNames
        this.artifactNames

        this.worldName
        this.levelNumber
        this.characterName
        this.lvl
        this.activeElements

        this.boss
        this.bossAlive
        this.bossAwake
        this.bossLife

        this.omnitrixLifeUsed
        this.variants

        this.trackCooldownTime
        this.trackInCooldown

        this.securityToken
    }

    init(d) {
        this.levelNumber = d.levelNumber
        this.worldName = d.worldName
        this.characterName = d.character
        this.variants = d.variants
    }
    preload() {
    }

    omnitrixSetScore(champs, matches) {
        this.omnitrixCollected = []
        for (let i=0; i<champs.length; i++) {
            this.omnitrixCollected.push({
                champ: champs[i],
                size: matches[i]/10
            })
        }
    }

    continuePlaying(wonOmnitrix) {
        if (wonOmnitrix) {
            this.playerHasControl = true
            this.player.setInvulnerable(1500)
            this.uiScene.lifes++
            this.uiScene.setHearts(this.uiScene.lifes)
            
            this.physics.world.resume()
        }
        else {
            this.uiScene.scene.stop()
            
            let levelEndScene = game.scene.start("LevelEndScene", {
                parentScene: this,
                win: status
            })
        }
    }

    endLevel(status) {
        if (!this.playerHasControl) return
        this.playerHasControl = false
        let levelValues = {
            at: 0,
            wbb: 4,
            su: 8,
            gmb: 12,
            ppg: 16
        }

        let name = this.characterName || this.levelData.character

        // if win
        if (status) {
            this.uiScene.time.delayedCall(1000, ()=>{
                this.uiScene.scene.stop()

        
                if (this.levelNumber == 4) {

                    let omni = game.scene.getScene("preloadGame")
                    omni.loadLevel(this.levelNumber+levelValues[this.worldName], false)
                    omni.events.once("shutdown", ()=> {
                        let levelEndScene = game.scene.start("LevelEndScene", {
                            parentScene: this,
                            win: status
                        })
                    })
                }
                else {
                    let levelEndScene = game.scene.start("LevelEndScene", {
                        parentScene: this,
                        win: status
                    })
                }
            })
        } 

        // if lost
        else {
            let deadPlayer = this.add.sprite(this.player.x, this.player.y, 
                this.player.onAir?
                "character-" + name :
                "character-" + name + "-die", 0)
    
            this.physics.world.pause()
            this.player.alpha = 0

            if (this.player.onAir) {
                deadPlayer.play(name + "-die-air")
                deadPlayer.once("animationcomplete", ()=>{
                    this.tweens.add({
                        targets: deadPlayer,
                        duration: 30,
                        x: deadPlayer.x + 6,
                        yoyo: true,
                        repeat: 7,
                        onComplete: ()=> {
                            deadPlayer.play(name + "-die-angel")
                            this.tweens.add({
                                targets: deadPlayer,
                                duration: 1300,
                                y: deadPlayer.y -100,
                                alpha: 0
                            })
                        }
                    })
                })
            }
            else {
                deadPlayer.play("character-" + name + "-die")
                deadPlayer.once("animationcomplete", ()=>{
                    deadPlayer.play("character-" + name + "-diestand")
                })
            }

            this.uiScene.time.delayedCall(1900, ()=>{

                if (!this.omnitrixLifeUsed) {
                    this.omnitrixLifeUsed = true

                    deadPlayer.destroy()

                    let omni = game.scene.getScene("preloadGame")
                    omni.loadLevel(this.levelNumber+levelValues[this.worldName], true)

                }
                else {
                    this.continuePlaying(false)
                }
            })
        }
        
    }

    create() {
        this.cameras.main.setBackgroundColor("#6CCFF6")
        API.initLevel(this.worldName + "-" + this.levelNumber).then(res => {
            this.securityToken = res
        })

        // ------------------- load data -------------------
        this.levelData = DATA.levelData[this.worldName][this.levelNumber-1]
        //this.levelNumber = 1
        /*console.log(DATA.levelData)
        console.log(DATA.levelData[this.worldName])
        console.log(this.levelData)*/
        let lvl = LevelParser.getLevelStructure(this.levelData, this.variants)
        this.lvl = lvl
        this.activeElements = []
        this.playerHasControl = true
        if (!this.characterName) this.characterName = this.levelData.character

        this.bossAlive = this.levelData.boss != null
        this.bossAwake = false
        this.bossLife = this.bossAlive ? this.levelData.boss.lifes : 0
        this.bossDefeated = false
        this.doors = [null, null, null]
        this.keysCollected = [false, false, false]

        this.omnitrixLifeUsed = false
        this.trackCooldownTime = DATA.game.trackCooldown || 500
        this.trackInCooldown = 0


        // gamification
        this.collected = {}
        this.enemiesKilled = 0
        this.omnitrixScore = 0
        this.score = 0

        
        this.fruitNames =[]
        this.bonusNames =[]
        this.artifactNames =[]

        this.levelData.fruits.forEach(fr => {
            this.fruitNames.push(fr.type)
            this.collected[fr.type] = 0
        })
        this.levelData.bonus.forEach(b => {
            this.bonusNames.push(b.type)
            this.collected[b.type] = 0
        })
        this.levelData.artifacts.forEach(ar => {
            this.artifactNames.push(ar.type + "-"+ar.side)
            this.collected[ar.type + "-"+ar.side] = 0
        })


        this.levelLengthX = lvl[0].length
        this.levelLengthY = lvl.length

        this.tileSize = {
            width: /*this.levelData.config.tileWidth ||*/ 243,
            height: /*this.levelData.config.tileHeight ||*/ 218
        }
        this.levelWidth = this.levelLengthX * this.tileSize.width
        this.levelHeight = (this.levelLengthY+0.25) * this.tileSize.height

        this.enemies = this.physics.add.group()
        this.bosses = this.physics.add.group()
        this.enemySmash = this.physics.add.group()
        this.bonus = this.physics.add.group()
        this.levelEnd = this.physics.add.group()

        this.allies = this.physics.add.group()

        this.playerShoots = this.physics.add.group()
        this.enemyShoots = this.physics.add.group()
        this.playerShootsCooldown = false

        this.platforms = this.physics.add.staticGroup()
        this.physics.world.setBounds(0, 0, this.levelWidth, this.levelHeight)


        // ------------------- environment ------------------- 
        this.clouds = []
        for (let i=0; i<20; i++) {
            let cloud = (this.add.image(1000+ c*800, 
                Phaser.Math.Between(1,300) + this.levelHeight-850,
                this.levelData.worldName + "-lvl"+this.levelNumber+"-skyback"+ Phaser.Math.Between(1,2)))
            this.clouds.push(cloud)
            cloud.setScale(Phaser.Math.FloatBetween(0.2, 0.8))
            cloud.setScrollFactor(0.1,1)// + c.scale*0.5, 1)
            
            //gDV = c //.setVelocityX(-20)
        }

        for (let i=0; i<10; i++) {
            let m = this.add.image(-50 + 720*i,
                this.levelHeight-200, 
                this.levelData.worldName+"-lvl"+this.levelNumber+"-backback1")
            m.setScale(1.5)
            m.setScrollFactor(0.9*200/(this.levelWidth-800),0.9)
            m.setOrigin(0,1)
        }
        this.bg1 = this.add.image(1000,
            this.levelHeight-150,
            this.levelData.worldName + "-lvl"+this.levelNumber+"-backimage")
        this.bg1.setOrigin(0,1)
        /*this.bg1.x = this.bg1.width/2
        this.bg1.y = this.bg1.height/2*/
        this.bg1.setScrollFactor(200/(this.levelWidth-800),0.9)

        
        this.bg2 = []
        for (let i=0; i<20; i++) {
            /*let b = this.add.image(0,0, "bg2")
            this.bg2.push(b)
            b.x = b.width/2 + b.width*i
            b.y = b.height/2 +50 + this.levelHeight/10
            b.setScrollFactor(0.5,0.2)*/
            let b
            b= this.add.image(300+430 + 900*i, 
                this.levelHeight-150, 
                this.levelData.worldName +"-lvl"+this.levelNumber+"-midback2")
            b.setScrollFactor(0.5, 1)
            b.setScale(1.4)
            b = this.add.image(300 + 900*i, 
                this.levelHeight-170, 
                this.levelData.worldName +"-lvl"+this.levelNumber+"-midback1")
                b.setScale(1.2)
            b.setScrollFactor(0.5, 1)
        }

        //let trees = 
        for (let i=0; i< Math.ceil(this.levelLengthX / 7); i++) {
            for (let j=0; j<3; j++) {
                let treeIndex = Phaser.Math.Between(1,5+3)
                if (treeIndex > 5) continue
                let tree = this.add.image(this.tileSize.width*7*i + this.tileSize.width+512*i + 370*j, 
                    this.levelHeight -135, 
                    this.levelData.worldName + "-lvl"+this.levelNumber+"-foreback"+treeIndex)
                tree.setOrigin(0.5, 1)
                tree.setScrollFactor(0.95, 1)
            }
            
        // floor
            let floor = this.platforms.create(this.tileSize.width*7*i + this.tileSize.width*i*1.45/*+ this.tileSize.width+512*i*/, 
                this.levelHeight-50, 
                this.levelData.worldName +"-lvl"+this.levelNumber+ "-floor")
            //floor.x = floor.width/2 + floor.width*i
            floor.setScale(1 * this.tileSize.width/197, 1.2)
            floor.setOrigin(0,0.5)
            floor.body.setSize(floor.body.width * this.tileSize.width/197, floor.body.height*0.3, false)
            floor.body.setOffset(0, floor.body.height*0.5+40)
            floor.body.checkCollision.left = false
            floor.body.checkCollision.right = false
            //floor.refreshBody()
        }
        //let platforms = this.physics.add.staticGroup()

        
        for (let r=0; r<this.levelLengthY; r++) {
            for (let c=0; c<this.levelLengthX; c++) {


                if (DATA.debug) {
                    this.add.image(c*this.tileSize.width + this.tileSize.width/2,
                        r*this.tileSize.height + this.tileSize.height/2,
                        "tile")

                    this.lvl[r][c].text = this.add.text(c*this.tileSize.width + 20,
                        r*this.tileSize.height + 20,
                        "r:" + r + "\nc:" + c + "\n" + this.lvl[r][c].active, 
                        {fontSize: 30, color: "#000", stroke: "#000", strokeThickness: 2})
                }

                if (lvl[r][c].type == "ply") {
                    this.player = new Character({
                        scene: this,
                        x: c*this.tileSize.width + this.tileSize.width/2,
                        y: r*this.tileSize.height + this.tileSize.height/2, 
                        name: this.characterName})
                }
                else {
                    lvl[r][c].active = false
                }
            }
        }

        // ------------- OVERLAPS ------------------
        this.physics.add.collider(this.player, this.platforms)

        this.physics.add.overlap(this.player, this.enemies, (p, e)=>{
            /*this.scene.stop()
            this.uiScene.scene.stop()
            this.scene.start("SplashScene")*/
            if (!p.invulnerable && !e.killed) {
                this.uiScene.damage()
            }
        }, null, this)
        this.physics.add.overlap(this.player, this.enemySmash, (p, e)=>{
            e.enemy.getSmashed(p)
        }, null, this)

        this.physics.add.overlap(this.player, this.bosses, (p, e)=>{
            if (!p.invulnerable) {
                this.uiScene.damage()
            }
        }, null, this)
        this.physics.add.overlap(this.bosses, this.playerShoots, (b, sh)=>{
            sh.destroy()
            b.getDamage()
        })
        
        this.physics.add.overlap(this.player, this.levelEnd, (p, e)=>{
            if (!this.bossAlive || this.bossDefeated)
            this.endLevel(true)
        }, null, this)

        this.physics.add.overlap(this.player, this.enemyShoots, (p, e)=>{
            /*this.scene.stop()
            this.uiScene.scene.stop()
            this.scene.start("SplashScene")*/
            if (!p.invulnerable) {
                this.uiScene.damage()
            }
        }, null, this)

        this.physics.add.overlap(this.playerShoots, 
            this.enemyShoots, (p, e)=>{
            e.destroy()
        }, null, this)

        this.physics.add.overlap(this.enemies, this.playerShoots, (e, sh)=>{
            e.getKilled()
        })

        this.physics.add.overlap(this.player, this.bonus, (p, b)=>{
            
            if (b.behavior == "power" && 
            this.uiScene.power == DATA.game.maxPower)
            { 
                return
            }
            else {
                b.getCollected()
            }
        }, null, this)

        this.player.setCollideWorldBounds(true)
        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight)
        this.cameras.main.startFollow(this.player, true)

        let beforeIndex = 6
        for (var c=0; c<30; c++) {
            let fIndex = Phaser.Math.Between(1,8)
            if (fIndex>5 || fIndex == beforeIndex) continue
            beforeIndex = fIndex
            let furniture = this.add.image(
                30 + 300*c, 
                this.levelHeight +50, 
                this.levelData.worldName + "-lvl"+this.levelNumber+"-furniture" + fIndex)
            furniture.setOrigin(0.5, 1)
            furniture.setScale(0.8)
            //furniture.setScrollFactor(2,1)
            furniture.depth = 26
        }

        gs = game.scene.getScene("GameScene")    
        this.uiScene = game.scene.start("UIScene", this).getScene("UIScene")
        game.scene.bringToTop("UIScene") 

        //--- end create
        
        /*let endo = game.scene.start("LevelEndScene", {
            parentScene: this,
            win: true
        })*/

        
        //keyboard
        let keySpace = this.input.keyboard.addKey("SPACE")
        let keyUp = this.input.keyboard.addKey("DOWN")
        keySpace.on("up", ()=>{
            if (!this.playerHasControl) return
            this.playerShootsCooldown = false
        })
        keyUp.on("up", ()=>{
            if (!this.playerHasControl) return
            this.playerShootsCooldown = false
        })
    }

    addPlatform(c, r, e, lvl) {
        let thisScene = this
        let m = ""
        let n = ""
        let hasLeft = lvl[r][c-1] === "___" || lvl[r][c-1] === "°°°" || lvl[r][c-1] === "..."
        let hasRight = lvl[r][c+1] === "___" || lvl[r][c+1] === "°°°" || lvl[r][c+1] === "..."
        let ret = []
        let horizontal = "none"
        let vertical = "none"

        
        if (e[0] == "|") vertical = "left"
        if (e[1] == "|") vertical = "mid"
        if (e[2] == "|") vertical = "right"

        if (vertical == "left") hasLeft = true
        if (vertical == "right") hasRight = true

        if (e[1] == "_") horizontal = "down"
        if (e[1] == ".") horizontal = "down"
        if (e[1] == "°") horizontal = "up"


        // horizontal
        if (horizontal != "none") {
            if (e==" _ " || e==" ° " 
            || e=="|° " || e==" °|" 
            || e=="|_ " || e==" _|") {
                m = "-mini"
            } 
            /*else if (hasLeft && hasRight) {
                m = "-center"
            }
            else if (hasRight) {
                m = "-left"
            }
            else if (hasLeft) {
                m = "-right"
            }*/
            
            let p = this.platforms.create(c*this.tileSize.width 
                + this.tileSize.width/2, 
                r*(this.tileSize.height) 
                + (horizontal == "down" ? this.tileSize.height - 23 : 22 ) -7,
                this.levelData.worldName +"-lvl"
                + this.levelNumber + "-platform" + m)
            
            //p.setScale(DATA.scale)
            p.depth = 12 - 0.001*p.y
            let siz = 4
            let off = 3
            if (hasLeft) {
                siz +=20
                off +=20
            }
            if (hasRight) {
                siz +=20
            }
            p.body.setSize(p.width - siz, 30)
            p.body.setOffset(off, 18)
            
            
            /*if (lvl[r-1] && lvl[r-1][c] == "x") {
                p.body.checkCollision.up = false
            }*/
            /*if (lvl[r+1] && lvl[r+1][c] == "x") {
            }*/
            /*p.body.checkCollision.down = false*/
    
            /*if (lvl[r][c-1] && lvl[r][c-1].type.includes("_") || lvl[r][c-1] && lvl[r][c-1].type.includes("°")) {
                p.body.checkCollision.left = false
            }
            
            if (lvl[r][c+1] && lvl[r][c+1].type.includes("_") || lvl[r][c+1] && lvl[r][c+1].type.includes("°")) {
                p.body.checkCollision.right = false
            }*/
            //if (m == "-mini") {
            if (e[1] == "_")
                p.body.checkCollision.down = false
                p.body.checkCollision.left = false
                p.body.checkCollision.right = false
            //}
    
            ret.push(p)
        }
        
        // vertical
        if (vertical!="none") {
            let v = 0
            if (vertical == "mid") v = this.tileSize.width/2
            if (vertical == "right") v = this.tileSize.width - 24
            if (vertical == "left") v = 24
    
            let h = -7
            if (!m) {
                if (horizontal == "up") {
                    n = "-mini"
                    h = +21.5 -7
                }
                if (horizontal == "down") {
                    n = "-mini"
                    h = -21.5 -7
                }
            }
    
            let w = this.platforms.create(c*this.tileSize.width + v,
                r*this.tileSize.height + this.tileSize.height/2 + h,
                this.levelData.worldName + "-lvl"
                + this.levelNumber+"-platform-vertical" + n)

                w.body.setSize(w.width, w.height - 18)
                w.body.setOffset(0, 18)
            //w.setScale(DATA.scale)
            w.depth = 12 - 0.001*w.y

            if (horizontal == "up") {
                w.body.checkCollision.up = false
            }
            if (horizontal == "down") {
                w.body.checkCollision.down = false
            }
            if (lvl[r-1] && lvl[r-1][c].type.includes("|") && !lvl[r-1][c].type.includes("0")) {
                w.body.checkCollision.up = false
            }
            if (lvl[r+1] && lvl[r+1][c].type.includes("|") && !lvl[r+1][c].type.includes("0")) {
                w.body.checkCollision.down = false
            }
            //w.refreshBody()

            ret.push(w)
        }
        


        return ret
    }
    getCurrentTile (element) {
        return {
            x: Math.trunc(element.x/this.tileSize.width),
            y: Math.trunc(element.y/this.tileSize.height)
        }
    }



//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------- UPDATE !!! ----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
    update(time, delta) {
        if (DATA.debug) {
            for (let r=0; r<this.levelLengthY; r++) {
                for (let c=0; c<this.levelLengthX; c++) {
                    this.lvl[r][c].text.setText("r:" + r + "\nc:" + c + "\n" + this.lvl[r][c].active)
                }
            }
        }

        if (this.trackInCooldown <= 0) {
            this.trackInCooldown = this.trackCooldownTime
            /*API.postStatus({
                x: this.player.x,
                y: this.player.y,
                lifes: this.uiScene.lifes,
                score: this.score,
                pow: this.uiScene.power
            })*/
        }
        else {
            this.trackInCooldown -= delta
        }

        this.player.update(time, delta)
        let tile = this.getCurrentTile(this.player)
        let limit = {
            x: 8,
            y: 5
        }

        // open door
        this.doors.forEach((door, i) => {
            if (door) {
                let distance = Phaser.Math.Distance.Between

                if (distance(this.player.x, this.player.y, door.x, door.y) < 300
                    && this.keysCollected[i]) 
                {
                    this.keysCollected[i] = false
                    door.gridElement.alive = false

                    this.tweens.add({
                        targets: door,
                        y: door.y - 15,
                        duration: 40, 
                        repeat: 10,
                        onComplete: ()=> {
                            this.tweens.add({
                                targets: door,
                                y: door.y + 160,
                                alpha: 0,
                                duration: 200,
                                onComplete: ()=> {
                                    door.destroy()
                                }
                            })
                        }
                    })

                    // use key
                    this.uiScene.useKey(i+1)
                }
            }
        })


        // ------------------------------------------------- 
        // ------------------- creation  ------------------- 
        // ------------------------------------------------- 
        //LevelParser.create(this, lvl)

        let lvl = this.lvl
        for (let r= tile.y-limit.y; r<= tile.y + limit.y; r++) {
            for (let c= tile.x - limit.x; c<= tile.x + limit.x; c++) {

                if (!this.lvl[r] || !this.lvl[r][c]) continue
                if (this.lvl[r][c].active) continue
                if (!this.lvl[r][c].alive) continue


                let e = this.lvl[r][c].type
                let justCreated

                switch(e) {
                    /*case " | ": {
                        let w = this.platforms.create(
                            c*this.tileSize.width + this.tileSize.width/2,
                            r*this.tileSize.height + this.tileSize.height/2,
                            this.levelData.worldName + "-platform-vertical"
                        )
                        w.setScale(0.7).refreshBody()
                        justCreated = w
                        this.activeElements.push({elem: [justCreated], pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;*/
                    case "al0":
                    case "al1":
                    case "al2":
                    case "al3":
                    case "al4":
                    case "al5":
                    case "al6":
                    case "al7":
                    case "al8":
                    case "al9": {
                        let allyData = this.levelData.allies.find(al => al.id == Number(e[2]))

                        if (!allyData) continue
                        let ally = new Ally({
                            scene: this, 
                            x: c*this.tileSize.width + this.tileSize.width/2, 
                            y: r*this.tileSize.height + this.tileSize.height/2, 
                            type: allyData.type,
                            direction: allyData.direction == "left"? -1 : 1,
                            dialog: allyData.dialog
                        })

                        justCreated = [ally]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})

                    }; break;

                    case "bss": {     
                        let bossData = this.levelData.boss
                        let boss = new Boss({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            config: bossData
                        })
                        this.boss = boss

                        justCreated = [boss]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;
                    case "ky1":
                    case "ky2":
                    case "ky3": {
                        let k = new Collectable({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            type: this.worldName + "-lvl"+ this.levelNumber + "-key" + Number(e[2]),
                            behavior: "key"
                        })

                        k.keyNumber = Number(e[2])

                        justCreated = [k]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;

                    case "|01":
                    case "|02":
                    case "|03":
                    case "01|":
                    case "02|":
                    case "03|":
                    case "0|1":
                    case "0|2":
                    case "0|3": {
                        let v
                        let n
                        if (e[0]=="|") {
                            v = 20
                            n = Number(e[2])
                        }
                        if (e[1]=="|") {
                            v = this.tileSize.width/2
                            n = Number(e[2])
                        }
                        if (e[2]=="|") {
                            v = this.tileSize.width -20
                            n = Number(e[1])
                        }

                        if (!this.keysCollected[n-1] && !this.uiScene.keysUsed[n-1]) {
                            let w = this.platforms.create(c*this.tileSize.width + v,
                                r*this.tileSize.height + this.tileSize.height/2,
                                this.levelData.worldName + "-lvl" +this.levelNumber+"-door" + n)

                                let pos = this.getCurrentTile({x: w.x, y: w.y})
                                w.gridElement = this.lvl[pos.y][pos.x]
                            this.doors[n-1] = w
                            justCreated = [w]
                        }

                        
                        //w.depth=2
                    }; break;

                    case "|° ":
                    case " °|":
                    case "|_ ":
                    case " _|":
                    case "...":
                    case " | ":
                    case "|__":
                    case "__|":
                    case "|_|":
                    case "|  ":
                    case "  |":
                    case "|°|":
                    case "°°|":
                    case "|°°":
                    case "°°°":
                    case " ° ":
                    case " _ ":
                    case "___": {
                        let p = this.addPlatform(c, r, e, lvl)
                        justCreated = p
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;
                    case "e00":
                    case "e01":
                    case "e02": 
                    case "e03":
                    case "e04":
                    case "e05":
                    case "e06":
                    case "e07":
                    case "e08":
                    case "e09":
                    case "e10":
                    case "e11":
                    case "e12":
                    case "e13":
                    case "e14":
                    case "e15":
                    case "e16":
                    case "e17":
                    case "e18":
                    case "e19":
                    case "e20": {       
                        let enemyData = this.levelData.enemies.find(enem => enem.id == Number(e[1]+e[2]))
                        
                        let enemy = new Enemy({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            config: enemyData.config,
                            type: "enemy-"+ this.levelData.worldName +"-"+ enemyData.type
                        })

                        justCreated = [enemy]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;
                    
                    case "b01":
                    case "b02":
                    case "b03":
                    case "b04": {
                        let bonusData = this.levelData.bonus.find(bns => bns.id == Number(e[1]+e[2]))

                        let b = new Collectable({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            type: bonusData.type,
                            behavior: "bonus"
                        })

                        justCreated = [b]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;

                    case "fr1":
                    case "fr2":
                    case "fr3": {
                        let fruitData = this.levelData.fruits
                        .find(fr => fr.id == Number(e[2]))

                        let f = new Collectable({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            type: fruitData.type,
                            behavior: "fruit"
                        })

                        justCreated = [f]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;

                    case "ar1":
                    case "ar2": {
                        let artData = this.levelData.artifacts
                        .find(ar => ar.id == Number(e[2]))
                        let ar = new Collectable({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            type: artData.type + "-" + artData.side,
                            artSide: artData.side,
                            behavior: "artifact"
                        })
                        
                        justCreated = [ar]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;

                    case "pow": {
                        let pow = new Collectable({
                            scene: this,
                            x: c*this.tileSize.width + this.tileSize.width/2,                        
                            y: r*this.tileSize.height + this.tileSize.height/2 -10, 
                            type: "power",
                            behavior: "power"
                        })
                        
                        justCreated = [pow]
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;

                    case "|O_":
                    case "_O|":
                    case "_O_":
                    case "end": {
                        let plats
                        if (e.includes("_")) {
                            let pattern = e.split("O").join("_")
                            plats = this.addPlatform(c, r, pattern, lvl)
                        }

                        //if (this.levelData.boss != null && this.bossAlive) continue
                        let end = this.levelEnd.create(
                            c*this.tileSize.width + this.tileSize.width/2,
                            r*this.tileSize.height + this.tileSize.height/2 - 12,
                            this.worldName + "-lvl"+this.levelNumber + "-end"
                        )
                        //end.setScale(0.95)
                        end.body.setSize(90,180)
                        end.body.setAllowGravity(false)

                        let portal = this.add.sprite(end.x-9, end.y+3, "portal-"+this.worldName)
                        portal.play("portal-" + this.worldName + "-anim")
                        portal.setAlpha(0.7)
                        portal.setScale(0.3, 0.33)
                        
                        end.depth = 14
                        portal.depth = 14
                        end.portal = portal

                        if (this.bossAlive && !this.bossDefeated) {
                            portal.alpha = 0
                        }

                        justCreated = [end, portal]
                        if (plats) justCreated = justCreated.concat(plats)
                        this.activeElements.push({elem: justCreated, pos: {x: justCreated.x, y: justCreated.y}})
                    }; break;
                }

                // after switch 
                this.lvl[r][c].element = justCreated
                this.lvl[r][c].active = true
            }
        }

        // ------------------------------------------------- 
        // ------------------ Destruction ------------------ 
        // ------------------------------------------------- 
        for (let r= tile.y-limit.y-1; r<= tile.y + limit.y+1; r++) {
            for (let c= tile.x - limit.x-1; c<= tile.x + limit.x+1; c++) {
                if (!this.lvl[r] || !this.lvl[r][c]) continue

                if (r >= tile.y-limit.y && r <= tile.y + limit.y &&
                c >= tile.x-limit.x && c <= tile.x + limit.x) continue

                if (this.lvl[r][c].element) {
                    this.lvl[r][c].element.forEach(el => {
                        el.destroy()
                    })
                }
                this.lvl[r][c].active = false
            }
        }
        /*for (let e of this.activeElements) {
            if (e.elem.x < this.player.area.left ||
                e.elem.x > this.player.area.right ||
                e.elem.y < this.player.area.up ||
                e.elem.y > this.player.area.down)
            {
                let elementTile = this.getCurrentTile(e.pos)

                if (!this.lvl[elementTile.x] || !this.lvl[elementTile.x][elementTile.y]) continue
                //if (!this.lvl[elementTile.x][elementTile.y].active) continue
                e.elem.destroy()
                this.lvl[elementTile.x][elementTile.y].active = false
                console.log(elementTile, e, this.lvl[elementTile.x][elementTile.y])
                this.activeElements = Utils.removeFromArray(this.activeElements, e)
            }
        }*/







        this.clouds.forEach(c => {
            c.x -= 0.2*c.scale
        })
        // player controls
        if (this.cursors.left.isDown || this.uiScene.joyUI.btnLeft.isDown)
        {
            if (!this.playerHasControl) return
            this.player.moveLeft()
        }
        else if (this.cursors.right.isDown || this.uiScene.joyUI.btnRight.isDown)
        {
            if (!this.playerHasControl) return
            this.player.moveRight()
        }
        else
        {
            this.player.stand()
        }

        if (this.cursors.up.isDown || this.uiScene.joyUI.btnJump.isDown)
        {
            if (!this.playerHasControl) return
            this.player.jump()
        }

        if (this.cursors.down.isDown || this.uiScene.joyUI.btnPow.isDown ||
            this.input.keyboard.keys[32].isDown /*space*/) {
                if (!this.playerHasControl) return
            if (this.playerShootsCooldown) return
            this.playerShootsCooldown = true
            this.player.pow()
        }

        this.enemies.children.entries.forEach(enem => enem.update())
        this.bosses.children.entries.forEach(boss => boss.update())
        this.allies.children.entries.forEach(ally => ally.update())
    }
}
