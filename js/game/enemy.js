class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, data.type)
        this.enemOriginX = data.x
        this.enemOriginY = data.y
        this.type = data.type
        this.name = this.type.split("-")[2]
        this.enemyWorld = this.type.split("-")[1]

        this.behavior = DATA.enemiesByWorld[this.enemyWorld]
                        .find(en => en.name==this.name).behavior
        this.direction = data.config.direction == "right"? 1: -1    
        if (this.behavior == "flying") {
            this.setFlipX(this.direction == 1)
        }

        this.shootEvent
        this.isShooting = false
        this.shootObject
        this.shootOrigin = {x: 0, y: 0}




        this.killed = false
        //this.config
        this.config = JSON.parse(JSON.stringify(Enemy.def))
        if (data.config) {
            this.config.walkWidth = data.config.walkWidth || Enemy.def.walkWidth
            this.config.walkSpeed = data.config.walkSpeed || Enemy.def.walkSpeed
            this.config.scale = data.config.scale || Enemy.def.scale
            this.config.flyHeight = data.config.flyHeight || Enemy.def.flyHeight
            this.config.flySpeed = data.config.flySpeed || Enemy.def.flySpeed
            this.config.shoot = data.config.shoot //Enemy.def.shoot
            if (this.config.shoot) {
                Object.assign(this.config.shoot, data.config.shoot)
            }
            else {
                this.config.shoot = null
            }
        }
        
        this.sc = data.scene
        this.sc.add.existing(this)
        this.sc.physics.add.existing(this);

        let pos = this.sc.getCurrentTile({x: this.x, y: this.y})
        this.gridElement = this.sc.lvl[pos.y][pos.x]

        // smashh
        this.smash = this.sc.enemySmash.create(this.x, 
            this.y - this.height/2+130, "enemy-smash")
        this.smash.setScale(0.9, 3)
        this.smash.enemy = this
        this.smash.alpha = DATA.debugMode ? 0.1 : 0
        this.smash.body.setAllowGravity(false)
        this.smash.body.checkCollision.right = false
        this.smash.body.checkCollision.left = false
        this.smash.body.checkCollision.down = false



        this.sc.enemies.add(this)
        if (this.behavior == "flying") {
            this.body.setAllowGravity(false)
            this.sc.tweens.add({
                targets: this,
                duration: 1000*this.config.flyHeight/(this.config.flySpeed),
                y: data.y + this.config.flyHeight,
                yoyo: 1,
                repeat: -1,
                ease: "Sine.easeInOut"
            })
        } else if (this.behavior == "walking") {
            this.setVelocityX(this.config.walkSpeed * this.direction)
        }
        if (this.behavior == "walking" || this.behavior == "sniper") {
            
            this.sc.physics.add.collider(this, this.sc.platforms)
            this.body.setSize(120,120, true)
            this.body.setOffset(30, 90)
        }
        this.setScale(this.config.scale)
        this.depth = 14
        //if (this.type )

        if (this.config.shoot) {
            let cfg = this.config.shoot
            let t = cfg.distance/cfg.speed

            if (this.name == "corrupted") {
                this.shootOrigin.y = 30
                this.shootOrigin.x = this.direction*20
            }
            this.shootEvent = this.sc.time.addEvent({
                delay: cfg.cooldown,
                loop: true,
                callback: ()=> {
                    if (this.killed) return

                    this.isShooting = true
                    if (game.anims.anims.entries[this.type+"-pow"]) {

                        this.play(this.type + "-pow", true) 


                        this.once("animationcomplete", ()=> {
                            /*let choosenAnimation = 
                                this.behavior == "walking" ? 
                                "-walk" : 
                                "-stand"
                            this.play(this.type + choosenAnimation)*/

                            this.isShooting = false

                            let shoot = this.sc.enemyShoots.create(
                                this.x + this.shootOrigin.x,
                                this.y + this.shootOrigin.y,
                                "enem-shoot"
                            )
                            this.shootObject = shoot
                            shoot.body.setAllowGravity(false)
                            shoot.setFlipX(this.direction == 1? true:false)
        
                            this.sc.tweens.add({
                                targets: shoot,
                                x:  (cfg.aimToPlayer ?
                                    this.sc.player.x :
                                    this.x + this.direction*cfg.distance
                                ),
                                y: (cfg.aimToPlayer ?
                                    this.sc.player.y :
                                    this.y
                                ),
                                duration: t*1000,
                                onComplete: ()=> {
                                    shoot.destroy()
                                }
                            })
        
                            if (cfg.aimToPlayer) {
                                shoot.setFlipX((this.sc.player.x > this.x? true: false))
                            }
                        })
                    }
                    
                }
            })
        }

        this.on("destroy", ()=>{
            if (this.shootEvent) this.shootEvent.remove()
            this.smash.destroy()

        })
    }

    getKilled() {
        if (this.killed) return
        this.killed = true
        this.sc.enemiesKilled++
        this.sc.score += DATA.game.score.enemy
        this.gridElement.alive = false
        
        if (this.shootObject) this.shootObject.destroy()

        this.play(this.type + "-die")
        this.sc.time.delayedCall(1000, () => {
            this.destroy()
        })
    }

    getSmashed(player) {
        if (player.body.bottom <= this.smash.y && player.body.velocity.y > 0)
        {
            this.getKilled()
        }
    }

    update() {
        this.smash.x = this.x
        this.smash.y = this.y - this.height/2 +60
            + (this.behavior == "flying"? 0 : 30)

        if (this.killed) return
        if (this.behavior == "walking") {
            if (!this.isShooting) this.play(`${this.type}-walk`, true)

            if (this.enemOriginX - this.x > this.config.walkWidth) {
                this.direction = 1
            } else if (this.enemOriginX - this.x < -this.config.walkWidth) {
                this.direction = -1
            }
            this.setVelocityX(this.config.walkSpeed * this.direction)
            this.setFlipX(this.direction == 1 ? true : false)
        }
        else {
            if (!this.isShooting) this.play(`${this.type}-stand`, true)
        }
    }
}
Enemy.def = {
    walkWidth: 200,
    walkSpeed: 30,
    scale: 1,
    flyHeight: 300,
    flySpeed: 200,
    shoot: {
        active: false,
        speed: 250,
        distance: 500,
        cooldown: 2000,
        aimToPlayer: false
    }
}