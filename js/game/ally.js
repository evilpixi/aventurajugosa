class Ally extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.type)
        
        this.dialog = config.dialog

        this.sc = config.scene
        this.sc.add.existing(this)
        this.sc.physics.add.existing(this);

        let pos = this.sc.getCurrentTile({x: this.x, y: this.y})
        this.gridElement = this.sc.lvl[pos.y][pos.x]
        //this.y += this.sc.tileSize.height/2 - 10

        this.sc.allies.add(this)
        this.direction = config.direction || 1

        if (this.direction == 1) {
            this.setFlipX(true)
        }
        
        this.body.setAllowGravity(false)

        this.name = config.type
        this.setScale(1)
        //this.setOrigin(0.5, 0)
        this.message = config.message || ""
        this.depth = 4

        this.showingMessage = false

        this.txt
        this.textBox

        this.playAnim()
    }
    playAnim() {
        if (!this.scene) return
        this.play(this.name + "-anim")
        this.once("animationcomplete", ()=> {
            this.play(this.name + "-stand")
            this.sc.time.delayedCall(2000 + Phaser.Math.Between(0,2000),()=>{
                if (this) this.playAnim()
            })
        })
    }

    showMessage(dialogConfig) {
        
        this.txt = this.sc.add.text(
            this.x + (this.direction)*dialogConfig.x, 
            this.y - dialogConfig.y,
            dialogConfig.text,
            Utils.getTitleTextFormat(30))
            .setOrigin(0.5)

        this.textBox = new Box(this.sc, this.txt.width+20, this.txt.height+20, {
            close: false, 
            startX: this.txt.x, 
            startY: this.txt.y,
            isDialog: true
        })

        Object.values(this.textBox.components).forEach(c => {
            c.depth = 1050
        })
        this.txt.depth = 1051
    }

    hideMessage() {
        this.showingMessage = false
        this.txt.destroy()
        this.textBox.destroy()
    }

    update() {
        let distance = Phaser.Math.Distance.Between
        if (distance(this.sc.player.x, this.sc.player.y,
                this.x, this.y) < 350)
        {
            if (this.showingMessage) return
            this.showingMessage = true
            this.showMessage(this.dialog)
        }
        else {
            if (!this.showingMessage) return
            this.hideMessage()
            this.showingMessage = false
        }
    }
}