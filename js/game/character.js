class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "character-" + config.name)
        
        this.sc = config.scene
        this.sc.add.existing(this)
        this.sc.physics.add.existing(this);

        this.idle = false
        this.alreadyStanding = false
        this.waitTime = 0

        this.name = config.name
        this.setCollideWorldBounds(true)
        //this.setScale(DATA.scale*1.2)

        let bodySize = {x: 0, y: 0, off: 0}

        // ppg
        if (["buttercup", "blossom", "bubbles"].includes(this.name)) {
            bodySize.x = 70
            bodySize.y = 130
            bodySize.off = 60
            bodySize.s = 0.87
        }

        // su
        if (this.name == "steven") {
            bodySize.x = 90
            bodySize.y = 150
            bodySize.off = 50
            bodySize.s = 0.8
        }

        // at
        if (this.name == "finn") {
            bodySize.x = 90
            bodySize.y = 150
            bodySize.off = 50
            bodySize.s = 1
        }
        else if (this.name == "jake") {

            bodySize.x = 90
            bodySize.y = 120
            bodySize.off = 80
            bodySize.s = 0.9
        }

        //wbb
        if (["panda", "polar", "grizzly"].includes(this.name)) {
            bodySize.x = 90
            bodySize.y = 150
            bodySize.off = 50
            bodySize.s = 0.84
        }

        // gmb
        if (this.name == "gumball") {
            bodySize.x = 90
            bodySize.y = 150
            bodySize.off = 50
            bodySize.s = 0.8
        }
        if (this.name == "darwin") {
            bodySize.x = 90
            bodySize.y = 150
            bodySize.off = 50
            bodySize.s = 0.8
        }
        
        /*if (this.name = "buttercup") {
            this.scale = DATA.scale*0.9
        }*/
        this.body.setSize(bodySize.x, bodySize.y)
        this.body.setOffset(this.body.offset.x, bodySize.off)
        this.setScale(bodySize.s)
        // 180 x 220
        /*if (this.name == "finn") {
            this.body.setSize(90, 150, false)
        }
        this.body.setOffset(0,20)*/
        this.depth = 15

        // status
        this.onAir = true        
        this.direction = 1
        this.walking = 0
        this.falling = true
        this.shooting = false
        this.oneShotFlag = false

        this.invulnerable = false

        this.status = ""

        this.area = {
            up: this.y - 6*this.sc.tileSize.height,
            down: this.y + 6*this.sc.tileSize.height,
            left: this.x - 10*this.sc.tileSize.width,
            right: this.x + 10*this.sc.tileSize.width
        }
        //this.body.setSize(70,180, true)

        /*this.animate() {
            if()
        }*/

        //----- movement -----

        this.walk = (direction) => {
            this.setVelocityX(direction * DATA.game.walkSpeed)
        }
    }
    moveLeft() {        
        this.direction = -1
        this.walk(-1)
    }
    moveRight() {        
        this.direction = 1
        this.walk(1)
    }
    stand() {
        this.walk(0)
    }
    jump() {     
        if (this.onAir) return   
        this.setVelocityY(-DATA.game.jumpSpeed)
    }
    pow() {
        if (this.sc.uiScene.power < DATA.game.powerPerShoot) {
        }
        else {
            this.shooting = true
            this.oneShotFlag = true
        }
    }
    shoot() {
        this.sc.uiScene.shoot()
        let shoot = this.sc.playerShoots.create(
            this.x,
            this.y,
            this.name.toLowerCase() +"-shoot"
        )
        shoot.body.setAllowGravity(false)
        shoot.setScale(1.2)
        shoot.setFlipX(this.direction == -1? true:false)

        let t = DATA.game.playerShootRange / DATA.game.playerShootSpeed

        this.sc.tweens.add({
            targets: shoot,
            x: this.x + this.direction*DATA.game.playerShootRange,
            duration: t*1000,
            onComplete: ()=> {
                shoot.destroy()
            }
        })
        /*shoot.setVelocityX(this.direction*DATA.game.playerShootSpeed)
        this.sc.time.delayedCall()*/
    }

    setInvulnerable(time) {
        if (this.invulnerable) return
        this.alpha = 0.5
        this.invulnerable = true
        this.sc.time.delayedCall(time, ()=>{
            this.invulnerable = false
            this.alpha = 1
        })
    }

    update(time,delta) {
        this.area = {
            up: this.y - 6*this.sc.tileSize.height,
            down: this.y + 6*this.sc.tileSize.height,
            left: this.x - 10*this.sc.tileSize.width,
            right: this.x + 10*this.sc.tileSize.width
        }

        if (this.startingJump) {            
        }
        this.onAir = !(this.body.touching.down && this.body.velocity.y == 0)// || this.
        
        this.walking = Math.abs(this.body.velocity.x) > 0
        this.falling = this.body.velocity.y > 0
        this.flipX = this.direction == 1? false: true

        this.status = ""

        this.status += this.onAir? "A":"a"
        this.status += this.walking? "W":"w"
        //this.status += this.falling? "F":"f"
        //this.status += this.shooting? "S":"s"

        //console.log(this.status)

        // animate
        if (this.shooting) {
            if (!this.onAir) {
                this.setVelocityX(0)
            }
            if (!this.oneShotFlag) return
            console.log("shoot!")
            this.sc.time.delayedCall(70, ()=> {
                this.shoot()
            }, this)
            this.play(this.name + "-pow", true)
            this.once("animationcomplete", ()=> {
                this.shooting = false
            })
            this.oneShotFlag = false
        }
        else {
            switch (this.status) {
                case "aW": {
                    this.play(this.name + "-walk", true)
                    this.waitTime = 0
                    this.idle = false
                }; break;

                case "Aw":
                case "AW": {
                    this.play(this.name + "-jump", true)
                    this.waitTime = 0
                    this.idle = false
                }; break;

                default: {
                    this.waitTime += delta
                    if (!this.idle && this.waitTime > 3000) {
                        this.idle = true
                        this.play(this.name + "-wait")
                        this.sc.time.delayedCall(2000, ()=>{
                            this.idle = false
                            this.waitTime = 0
                        })
                    }
                    else {
                        if (!this.idle) {
                            this.play(this.name + "-stand", true)
                        }
                    }
                }; break;
            }
        }
        
    }
}