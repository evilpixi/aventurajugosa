class OptionsScene extends Phaser.Scene {
    constructor() {
        super("OptionsScene", OptionsScene)

        this.parentScene
    }

    init(data) {
        this.parentScene = data.parentScene
    }

    create() {
        this.scene.bringToTop()
        this.parentScene.scene.pause()
        if (this.parentScene.scene.key == "UIScene") {
            this.parentScene.gameScene.scene.pause()
        }

        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)
        
        let box = new Box(this, 900, 480, {
            title: DATA.text.OptionsScene.title,
            close: !(this.parentScene.scene.key == "UIScene")
        })

        let n = 150
        let btn = {}
        
        btn.bg = this.add.image(box.pos.centerX, box.pos.centerY, "ui-transparent-bg")

        let fromGame = !(this.parentScene.scene.key == "LevelSelectionScene")
        // parent: level select
        if (!fromGame) {
            btn.ranking = new ButtonImage({
                scene: this,
                x: box.pos.centerX - 1*n,
                y: box.pos.centerY + n/2,
                image: "button-opt-ranking",
                clickFunction: ()=> {
                    game.scene.start("RankingScene", {parentScene: this})
                }
            })

            btn.home = new ButtonImage({
                scene: this,
                x: box.pos.centerX - 1*n,
                y: box.pos.centerY - n/2,
                image: "button-opt-homepink",
                clickFunction: ()=> {
                    this.scene.stop()
                    this.parentScene.scene.stop()
                    this.scene.start("SplashScene")
                }
            })
        }

        // parent: game
        else {
            btn.cuadrados = new ButtonImage({
                scene: this,
                x: box.pos.centerX - n/2 - 1*n,
                y: box.pos.centerY - n/2,
                image: "button-opt-levels",
                clickFunction: ()=> {
                    this.parentScene.scene.stop()
                    this.parentScene.gameScene.scene.stop()
                    game.scene.start("LevelSelectionScene")
                    this.scene.stop()
                }
            })

            btn.restart = new ButtonImage({
                scene: this,
                x: box.pos.centerX + n/2,
                y: box.pos.centerY + n/2,
                image: "button-opt-restart",
                clickFunction: ()=> { 
                    this.parentScene.gameScene.scene.stop()
                    this.parentScene.scene.stop()
                    this.scene.start("GameScene")
                    this.scene.stop()
                }
            })
            btn.play = new ButtonImage({
                scene: this,
                x: box.pos.centerX + n/2 + 1*n,
                y: box.pos.centerY + n/2,
                image: "button-opt-play",
                clickFunction: ()=> { 
                    this.parentScene.scene.resume()
                    if (this.parentScene.scene.key == "UIScene") {
                        this.parentScene.gameScene.scene.resume()
                    }
                    this.scene.stop()
                }
            })

            btn.home = new ButtonImage({
                scene: this,
                x: box.pos.centerX - n/2 - 1*n,
                y: box.pos.centerY + n/2,
                image: "button-opt-home",
                clickFunction: ()=> {
                    this.scene.stop()
                    this.parentScene.scene.stop()
                    this.parentScene.gameScene.scene.stop()
                    this.scene.start("SplashScene")
                }
            })
        }
        
        // always
        btn.melody = new ButtonImage({
            scene: this,
            x: box.pos.centerX - (fromGame? n/2 : 0),
            y: box.pos.centerY - n/2,
            image: "button-opt-melody",
            clickFunction: ()=> { console.log("clicked!")}
        })

        btn.sfx = new ButtonImage({
            scene: this,
            x: box.pos.centerX + (fromGame? n/2 : n),
            y: box.pos.centerY - n/2,
            image: "button-opt-sfx",
            clickFunction: ()=> { console.log("clicked!")}
        })

        btn.help = new ButtonImage({
            scene: this,
            x: box.pos.centerX + (fromGame? n/2 + 1*n : n),
            y: box.pos.centerY - (fromGame? n/2 : -n/2),
            image: "button-opt-help",
            clickFunction: ()=> { 
                game.scene.start("HelpScene", {parentScene: this})
            }
        })
        
        btn.archievements = new ButtonImage({
            scene: this,
            x: box.pos.centerX - (fromGame? n/2 : 0),
            y: box.pos.centerY + n/2,
            image: "button-opt-archievements",
            clickFunction: ()=> { 
                this.scene.pause()
                game.scene.start("ArchievementsScene", {parentScene: this})
            }
        })
        
        Object.values(btn).forEach(b => {
            b.x +=20
        })
    }
}