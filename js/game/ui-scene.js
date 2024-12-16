class UIScene extends Phaser.Scene {
    constructor() {
        super("UIScene")

        this.gameScene
        this.joyUI

        this.hearts
        this.lifes

        this.powerFillBar
        this.power
        this.maxPower

        
        this.scoreText
        this.scoreTextShadow

        this.keys
        this.keysUsed
        
    }
    init(data) {
        this.gameScene = data
    }
    setHearts(amount) {
        if (amount > 3) amount = 3
        for (var i=0; i<this.hearts.length; i++) {
            if (i>=amount) {
                if (this.hearts[i].alpha == 0) continue
                this.tweens.add({
                    targets: this.hearts[i],
                    duration: DATA.animationTime,
                    scale: this.hearts[i]*2,
                    alpha: 0,
                    ease: "Back.easeOut"
                })
            }
            else {
                if (this.hearts[i].alpha == 1) continue
                this.hearts[i].scale = 0
                this.tweens.add({
                    targets: this.hearts[i],
                    duration: DATA.animationTime,
                    scale: 1,
                    alpha: 1,
                    ease: "Back.easeOut"
                })
            }
        }
    }
    /*preload() {
        //this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
    }*/

    damage() {
        if (this.lifes >= 1) {
            this.lifes--
            this.setHearts(this.lifes)
            
            this.gameScene.player
            .setInvulnerable(DATA.game.invulnerableTime)
        }
        else {
            this.gameScene.endLevel(false)
        }
    }

    addPower() {
        this.power += DATA.game.powerFromBubbles
        this.updatePower()
    }

    shoot() {
        this.power -= DATA.game.powerPerShoot
        this.updatePower()
    }

    updatePower() {
        if (this.power > DATA.game.maxPower) {
            this.power = DATA.game.maxPower
        }
        if (this.power < 0) {
            this.power = 0
        }
        this.powerFillBar.setScale(this.power/this.maxPower, 1)
    }
    getKey(index) {
        let key = this.keys[index-1]
        this.tweens.add({
            targets: key,
            duration: 500,
            ease: "Back",
            alpha: 1,
            scale: 1.5,
            onComplete: ()=>{
                this.tweens.add({
                    targets:key,
                    duration: 100,
                    ease: "Quad",
                    scale: 0.8
                })
            }
        })
    }
    useKey(index) {
        let key = this.keys[index-1]
        this.tweens.add({
            targets: key,
            duration: 300,
            ease: "Back",
            scale: 2,
            onComplete: ()=>{
                this.tweens.add({
                    targets:key,
                    delay: 100,
                    duration: 100,
                    ease: "Quad",
                    scale: 2.5,
                    alpha: 0
                })
            }
        })

        this.keysUsed[index-1] = true
    }
    create() {
        this.keysUsed = [false, false, false]
        this.joyUI = {}
        this.power = 0
        this.maxPower = 100
        this.lifes = DATA.game.maxLifes


        let textConfig = {
            fontFamily: "lubalin-graph",
            align: "center",
            fontSize: 40,
            color: "#000"
        }

        const measures = {
            xNarrow: (gWidth/2 - 270-60),
            xWide: gWidth/2 - 110-60,
            yNarrow: gHeight/2 - 170,
            yWide: gHeight*0.415,
            scale: 1.1
        }

        let sc = this.gameScene
        this.keys = []
        for (let i=0; i<=2; i++) {
            let key = this.add.image(gWidth*0.69 +(i)*78, 
            gHeight/2 - measures.yWide,
            sc.worldName + "-lvl"+ sc.levelNumber + "-key" + (i+1))
            .setScale(0.6)
            .setAlpha(0.5)

            this.keys.push(key)
        }

        this.add.text(gWidth/2 - measures.xWide+20, 
            gHeight/2 - measures.yWide, 
            DATA.text.UIScene.level +" "+ this.gameScene.levelNumber,
            textConfig).setOrigin(0, 0.5)

            
        this.hearts = []
        let l = this.lifes > 3? 3 : this.lifes
        for (var i=0; i<l; i++) {
            let h = this.add.image(gWidth*0.13 +i*62, 
                gHeight*0.18,
                "ui-heart") 
                
            h.setScale(1)  
            this.hearts.push(h)
            //this.hearts.
        }
        this.setHearts(this.lifes)


        this.add.image(gWidth/2 - measures.xNarrow + 180+80 -65 +60, 
            gHeight/2 - measures.yWide,
            this.gameScene.worldName + "-ui-power-bar")

        this.powerFillBar = this.add.image(gWidth/2 - measures.xNarrow + 92+80 -65 +60, 
            gHeight/2 - measures.yWide - 1,
            this.gameScene.worldName + "-ui-power-fill").setOrigin(0, 0.5)

        this.add.image(gWidth/2 - measures.xNarrow + 100+80 -65, 
            gHeight/2 - measures.yWide,
            this.gameScene.worldName + "-ui-thunder")

        this.updatePower()

        
        let pause = new ButtonImage({
            scene: this,
            x: gWidth/2 + measures.xWide - 40 - 50,
            y: gHeight/2 - measures.yWide,
            scale: 0.85,
            image: "button-ui-pause",
            clickFunction: ()=> { 
                game.scene.start("OptionsScene", {parentScene: this})
                //this.scene.pause
                //this.gameScene.scene.pause()
            }
        })
        let audio = new ButtonImage({
            scene: this,
            x: gWidth/2 + measures.xWide - 40 + 50,
            y: gHeight/2 - measures.yWide,
            scale: 0.85,
            image: "button-ui-audio",
            clickFunction: ()=> { 
                //this.scene.pause
                //this.gameScene.scene.pause()
            }
        })

        //keyboard
        this.input.keyboard.once("keydown-ESC", ()=>{
            game.scene.start("OptionsScene", {parentScene: this})
        })

        
        // text score
        let scoreTextFormat = {
            fontFamily: "nunito",
            fontSize: 36,
            fontStyle: "bold",
            align: "center",
            color: "#000",
            stroke: "#000",
            strokeThickness: 6
        }

        this.add.text(gWidth/2 - 10, 
            gHeight/2  - measures.yWide,
            DATA.text.UIScene.score,
            scoreTextFormat)
            .setOrigin(0.5)
        
        scoreTextFormat.color = "#fff"
        scoreTextFormat.stroke = "#fff"
        scoreTextFormat.strokeThickness = 2
        this.add.text(gWidth/2 - 10, 
            gHeight/2  - measures.yWide -2,
            DATA.text.UIScene.score,
            scoreTextFormat)
            .setOrigin(0.5)


        // numbers score
        scoreTextFormat.color = "#000"
        scoreTextFormat.stroke = "#000"
        scoreTextFormat.strokeThickness = 3
        scoreTextFormat.fontFamily = "a-hint-of-sass"
        
        this.scoreTextShadow = this.add.text(gWidth*0.62, 
            gHeight/2  - measures.yWide,
            Utils.makeTextCiphers(this.gameScene.score + this.gameScene.bonusScore, 5),
            scoreTextFormat)
            .setOrigin(1, 0.5)
        
        scoreTextFormat.color = "#fff"
        scoreTextFormat.stroke = "#fff"
        scoreTextFormat.strokeThickness = 1
        this.scoreText = this.add.text(gWidth*0.62, 
            gHeight/2  - measures.yWide -2,
            Utils.makeTextCiphers(this.gameScene.score + this.gameScene.bonusScore, 5),
            scoreTextFormat)
            .setOrigin(1, 0.5)


        // left
        this.joyUI.btnLeft = new ButtonImage({
            scene: this, 
            image: this.gameScene.worldName + '-button-left',
            x: gWidth/2 - measures.xWide,
            y: gHeight/2 + measures.yWide- 20,
            scale: measures.scale
        })

        // right
        this.joyUI.btnRight = new ButtonImage({
            scene: this, 
            image: this.gameScene.worldName + '-button-right',
            x: gWidth/2 - measures.xNarrow,
            y: gHeight/2 + measures.yWide- 20,
            scale: measures.scale
        })

        // jump
        this.joyUI.btnJump = new ButtonImage({
            scene: this, 
            image: this.gameScene.worldName + '-button-jump',
            x: gWidth/2 + measures.xNarrow,
            y: gHeight/2 + measures.yWide- 20,
            scale: measures.scale
        })

        // pow
        this.joyUI.btnPow = new ButtonImage({
            scene: this, 
            image: this.gameScene.worldName + '-button-pow',
            x: gWidth/2 + measures.xWide,
            y: gHeight/2 + measures.yNarrow - 20,
            scale: measures.scale
        })

        Object.values(this.joyUI).forEach(b => {
            b.on("pointerover", ()=> {
                b.isDown = true
            })
            b.on("pointerout", ()=> {
                b.isDown = false
            })
        })

        this.joyUI.btnPow.on("pointerout", ()=> {
            this.gameScene.playerShootsCooldown = false
        })


        // hide joy if not mobile
        if (!DATA.isMobile) {
            Object.values(this.joyUI).forEach(e => {
                e.scale = 0;
                e.active = 0
            })
        }
    }

    update() {
        this.scoreText.setText(Utils.makeTextCiphers(this.gameScene.score, 5))
        this.scoreTextShadow.setText(Utils.makeTextCiphers(this.gameScene.score, 5))
    }
}