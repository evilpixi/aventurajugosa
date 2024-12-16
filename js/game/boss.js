class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, "boss-" + data.config.type)
        this.direction = -1
        
        this.type = data.config.type
        this.sc = data.scene
        this.sc.add.existing(this)
        this.sc.physics.add.existing(this);
        this.sc.bosses.add(this)

        this.shootOrigin = {
            x: 0,
            y: 0
        }

        let pos = this.sc.getCurrentTile({x: this.x, y: this.y})
        this.gridElement = this.sc.lvl[pos.y][pos.x]

        this.condFunction
        this.condEvent

        this.config = data.config.config

        this.bossArea = {
            left: this.x - this.config.area.left * 200,
            right: this.x + this.config.area.right * 200,
            up: this.y - this.config.area.up * 200,
            down: this.y + this.config.area.down * 200
        }

        this.direction = -1

        //this.setScale(this.config.scale)
        //this.depth = this.sc.player.depth

        if (!this.sc.bossAwake) {
            this.sc.bossAwake = true
            this.sc.bossLife = this.config.lifes
        }


        // behavior
        this.currentPattern = ""
        this.patternRunning = false
        this.patterns = []

        if (this.type == "iceking") {
            this.body.setAllowGravity(false)
            this.setScale(1.92)
            this.body.setSize(150,120, true)
            this.body.setOffset(15,82)

            this.patterns = []
            Object.entries(this.config.patterns).forEach(entry => {
                for (let i=1; i<= entry[1]; i++) {
                    this.patterns.push(entry[0])
                }
            })
        }
        else if (this.type == "mojo") {
            this.body.setAllowGravity(true)
            this.sc.physics.add.collider(this.sc.bosses, this.sc.platforms)

            this.body.setSize(200,200, true)
            
            this.setScale(1.92)
            //this.body.setOffset(150,130)

            this.patterns = []
            console.log(Object.entries(this.config.patterns))
            Object.entries(this.config.patterns).forEach(entry => {
                for (let i=1; i<= entry[1]; i++) {
                    this.patterns.push(entry[0])
                }
            })
        }
        else if (this.type == "nom") {
            this.body.setAllowGravity(true)
            this.sc.physics.add.collider(this.sc.bosses, this.sc.platforms)

            /*this.setScale(0.82)
            this.body.setSize(100,100, true)
            this.body.setOffset(70,200)

            this.shootOrigin = {x: 0, y: 50}*/

            this.patterns = []
            Object.entries(this.config.patterns).forEach(entry => {
                for (let i=1; i<= entry[1]; i++) {
                    this.patterns.push(entry[0])
                }
            })
        }
        else if (this.type == "jasper") {
            this.body.setAllowGravity(true)
            this.sc.physics.add.collider(this.sc.bosses, this.sc.platforms)

            
            /*this.setScale(1.92)
            this.body.setSize(110,180, true)
            this.body.setOffset(30,40)*/

            this.patterns = []
            console.log(Object.entries(this.config.patterns))
            Object.entries(this.config.patterns).forEach(entry => {
                for (let i=1; i<= entry[1]; i++) {
                    this.patterns.push(entry[0])
                }
            })
        }
        else if (this.type == "rob") {
            this.body.setAllowGravity(true)
            this.sc.physics.add.collider(this.sc.bosses, this.sc.platforms)

            this.body.setSize(100,180, true)
            this.body.setOffset(73,110)

            this.patterns = []
            console.log(Object.entries(this.config.patterns))
            Object.entries(this.config.patterns).forEach(entry => {
                for (let i=1; i<= entry[1]; i++) {
                    this.patterns.push(entry[0])
                }
            })
        }

        //if (this.type )

        /*this.on("destroy", ()=>{
            this.sc.enemiesKilled++
            this.shootEvent.remove()
            this.sc.score += DATA.game.score.enemy
        })*/
    }

    getDamage() {
        this.sc.score += DATA.game.score.enemy*10
        this.gridElement.alive = false

        this.sc.bossLife--
        console.log("remaining life:", this.sc.bossLife)
        if (this.sc.bossLife == 0) {
            this.sc.bossDefeated = true
            this.patternRunning = false
            this.currentPattern = "die"

            this.setVelocityX(0)
            this.setVelocityY(0)

            if (this.sc.levelEnd.children.entries[0]) {
                this.sc.tweens.add({
                    targets: this.sc.levelEnd.children.entries[0].portal,
                    alpha: 0.7,
                    duration: 200
                })
            }
        }
    }

    executePattern(pattern) {
        this.patternRunning = true

        switch(pattern) {
            case "relax": { this.stand( this.config.cooldown || DATA.game.bosses.timeBetweenPatterns) }; break;
            case "stand": { this.stand( this.config.standTime || DATA.game.bosses.standTime) }; break;
            case "shoot": { this.shoot() }; break;
            case "walk": { this.walk() }; break;
        }
    }

    update() {
        if (!this.sc.bossDefeated) {
            if (!this.currentPattern) {
                this.currentPattern = this.patterns[
                    Phaser.Math.Between(0, this.patterns.length-1)]
            }
            else {
                if (!this.patternRunning) {
                    this.executePattern(this.currentPattern)
                }
            }
    
            
            if (["stand", "", "relax"].includes(this.currentPattern)) {
                this.play("boss-" + this.type + "-stand", true)
            }
            else if (this.currentPattern == "walk") {
                this.play("boss-" + this.type + "-walk", true)
            }
            else if (["shoot"].includes(this.currentPattern)) {
                this.play("boss-" + this.type + "-pow", true)
            }
    
            this.executeCondition()
        }
        if (this.currentPattern == "die") {
            this.play("boss-" + this.type + "-die", true)

            this.sc.bossDefeated = true
            this.sc.tweens.add({
                targets: this,
                delay: 1200,
                alpha: 0,
                duration: 350,
                onComplete: ()=> {
                    this.destroy()
                }
            })
        }
    }

    executeCondition() {
        if (!this.condFunction) return
        if (this.condFunction()) {
            this.eventFunction.call()
            this.condFunction = undefined
            this.eventFunction = undefined
        }
    }
    // -----------------------------------------
    // --------------- PATTERNS ----------------
    // -----------------------------------------
    stand(time) {
        this.sc.time.delayedCall(time, ()=> {
            if (!(this.currentPattern=="relax")) {
                this.currentPattern = "relax"
            }
            else {
                this.currentPattern = ""
            }
            this.patternRunning = false
        })
    }
    shoot() {
        
        this.play("boss-" + this.type + "-pow", false)
        this.once("animationcomplete", ()=> {
            let shoot = this.sc.enemyShoots.create(
                this.x + this.shootOrigin.x,
                this.y + this.shootOrigin.y,
                "boss-" + this.type + "-shoot"
            )
            shoot.body.setAllowGravity(false)
            shoot.setFlipX(this.direction == 1? true:false)

            this.sc.tweens.add({
                targets: shoot,
                x:  this.x + this.direction*2000,
                y: this.y,
                duration: 2*1000,
                onComplete: ()=> {
                    shoot.destroy()
                }
            })

            this.currentPattern = "relax"
            this.patternRunning = false
        })
    }

    walk() {
        this.body.setVelocityX(this.direction * this.config.walkSpeed)
        
        this.condFunction = ()=> {
            return (this.x < this.bossArea.left &&
                    this.direction == -1) || 
                   (this.x > this.bossArea.right &&
                    this.direction == 1)
        }
        this.eventFunction = ()=> {
            this.setVelocityX(0)
            this.direction = this.x < this.bossArea.left ? 1 : -1
            this.setFlipX(this.direction == 1)
            
            this.currentPattern = "relax"
            this.patternRunning = false
        }

    }
}