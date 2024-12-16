class Collectable extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        super(data.scene, data.x, data.y, 
        (data.behavior == "key" ? "" : "game-") +
        (data.behavior == "fruit"? "fruit-" : "")+
        (data.behavior == "artifact"? "artifact-" : "")+
        data.type +
        (data.behavior == "power" ? ("-" + data.scene.worldName) : ""))
        //this.originX = data.x
        this.type = data.type
        this.behavior = data.behavior
        if (this.behavior == "artifact") {
            this.artSide = data.artSide || data.type.split("-")[1]
        }
        
        this.sc = data.scene
        this.sc.add.existing(this)
        this.sc.physics.add.existing(this);
        this.sc.bonus.add(this)

        if (this.behavior == "key") {
            this.keyNumber = Number(data.type[data.type.length-1])
        }
        
        let pos = this.sc.getCurrentTile({x: this.x, y: this.y})
        this.gridElement = this.sc.lvl[pos.y][pos.x]

        this.body.setAllowGravity(false)
        
        this.setScale(DATA.scale)
        //this.refreshBody()

        this.collected = false

        this.sc.tweens.add({
            targets: this,
            y: this.y+30,
            duration: 1500,
            repeat: -1,
            ease: "Sine.easeInOut",
            yoyo: true
        })
    }

    getCollected() {
        this.gridElement.alive = false

        if (this.collected) return
        this.collected = true
        if (this.behavior == "bonus") {
            this.sc.score += DATA.game.score.bonus
            this.destroy()
        }
        else if (this.behavior == "power") {
            this.sc.uiScene.addPower()
            this.destroy()
        }
        else if (this.behavior == "artifact") {
            API.gogoArti(this.sc.player.x, this.sc.player.y, 
                this.x, this.y, 
                this.type, 
                this.sc.securityToken)
            this.destroy()
        }
        else if (this.behavior == "key") {
            this.sc.keysCollected[this.keyNumber-1] = true

            this.destroy()
            //if (this.sc.doors[this.keyNumber-1]) this.sc.doors[this.keyNumber-1].destroy()
            this.sc.uiScene.getKey(this.keyNumber)
        }
        else if (this.behavior == "fruit") {
            this.play("game-fruit-" + this.type + "-explode")
            this.on("animationcomplete", ()=> {
                this.sc.score += DATA.game.score.fruit
                this.destroy()
            })
        }

        this.sc.collected[this.type]++
    }

    update() {
    }
}