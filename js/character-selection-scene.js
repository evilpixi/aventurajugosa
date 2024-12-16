class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super("CharacterSelectionScene")
        
        this.worldName
        this.parentScene
        this.currentCharacter
        this.levelNumber
    }

    init(d) {
        this.worldName = d.worldName
        this.parentScene = d.parentScene
        this.levelNumber = d.levelNumber
    }

    create() {
        this.scene.bringToTop()

        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)

        let box = new Box(this, 1350, 600, {
            title: DATA.text.CharacterSelectionScene.title,
            close: true,
            titleSize: 60
        })
        this.add.image(gWidth/2, gHeight*0.53, "ui-transparent-bg")
        .setScale(1.4, 1.21)

        this.currentCharacter = 0
        let characters = DATA.charactersByWorld[this.worldName]
        let elems =[]
        characters.forEach(char => {
            elems.push([
                this.add.image(gWidth/2, gHeight*0.52, "charselect-"
                + this.worldName + "-" + char)
            ])
        })
        let carousel = new Carousel({
            elements: elems
        })
        carousel.updateFunction = ()=>{
            this.currentCharacter = carousel.active
        }

        new ButtonImage({
            scene: this,
            x: gWidth*(0.5 + 0.35),
            y: gHeight*0.2,
            scale: 1,
            image: "button-ui-audio",
            clickFunction: ()=>{
            }
        })


        if (characters.length > 1) {
            new ButtonImage({
                scene: this,
                x: gWidth*(0.5 - 0.2),
                y: gHeight/2,
                scale: 1,
                image: "button-prev",
                clickFunction: ()=>{
                    carousel.prev()
                }
            })

            new ButtonImage({
                scene: this,
                x: gWidth*(0.5 + 0.2),
                y: gHeight/2,
                scale: 1,
                image: "button-next",
                clickFunction: ()=>{
                    carousel.next()
                }
            })
        }

        new ButtonImage({
            scene: this,
            x: gWidth*0.864,
            y: gHeight*0.75,
            scale: 1.35,
            image: "button-opt-play",
            clickFunction: ()=> {
                this.scene.stop()
                this.parentScene.scene.stop()

                game.scene.start("GameScene", {
                    worldName: this.worldName,
                    levelNumber: this.levelNumber,
                    character: characters[this.currentCharacter]
                })
            }
        })


        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.stop()
            this.parentScene.scene.stop()

            game.scene.start("GameScene", {
                worldName: this.worldName,
                levelNumber: this.levelNumber,
                character: characters[this.currentCharacter]
            })
        })

        this.input.keyboard.once("keydown-ESC", ()=>{
            this.scene.stop()
            this.parentScene.scene.resume()
        })

        this.input.keyboard.on("keydown-LEFT", ()=>{
            carousel.prev()
        })
        this.input.keyboard.on("keydown-RIGHT", ()=>{
            carousel.next()
        })
    }
}