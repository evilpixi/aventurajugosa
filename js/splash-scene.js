class SplashScene extends Phaser.Scene {
    constructor() {
        super("SplashScene")
    }

    create() {
        this.add.image(gWidth/2, gHeight/2, "splash-bg")
        
        // --- buttons ---
        let buttonTextConfig = {
            fontFamily: "lubalin-graph",
            align: "center",
            fontSize: 40,
            color: "#fff"
        }

        new ButtonImage({
            scene: this,
            x:gWidth*(0.5 - 0.1),
            y:gHeight*0.8,
            image: "splash-button-play",
            text: DATA.text.SplashScene.buttonPlay,
            textConfig: buttonTextConfig,
            clickFunction: ()=> { 
                //this.scene.start("GameScene")
                //this.scene.start("LevelSelectionScene")
                game.scene.start("LevelSelectionScene")
                this.scene.pause()
            }
        })

        new ButtonImage({
            scene: this,
            x:gWidth*(0.5 + 0.1),
            y:gHeight*0.8,
            image: "splash-button-how-to-play",
            text: DATA.text.SplashScene.buttonHowToPlay,
            textConfig: buttonTextConfig,
            clickFunction: ()=> { 
                game.scene.start("HelpScene", { parentScene: this})
            }
        })
        
        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.start("LevelSelectionScene")
            this.scene.stop()
        })


        // OMNITRIX CALL
        /*
        let niveles = [4, 8, 12, 16, 20]
        niveles.forEach((lvl,i) => {
            new ButtonImage({
                scene: this,
                x:gWidth*0.7,
                y:gHeight*(0.2 + 0.12*i),
                image: "splash-button-how-to-play",
                text: "Nivel " + lvl,
                textConfig: buttonTextConfig,
                clickFunction: ()=> { 
                    this.scene.stop()
                    // ---------------------------------------
                    // ---------------------------------------
                    //
                    // Aqui es donde hago las llamadas
                    // lvl es cada uno de los niveles
                    let omni = game.scene.getScene("preloadGame")
                    omni.loadLevel(lvl, false)
                }
            })
        })*/
    }
}