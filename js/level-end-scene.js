class LevelEndScene extends Phaser.Scene {
    constructor() {
        super("LevelEndScene")
        this.parentScene
        this.win

        this.star1
        this.star2
        this.star3

        this.bonusScore
        this.score
        this.omnitrixMatchScore
        this.totalScore
        this.fruitCount
    }

    init(data) {
        this.parentScene = data.parentScene
        this.win = data.win
    }

    create() {
        //score data
        this.bonusScore = 0
        this.parentScene.bonusNames.forEach(b => {
            this.bonusScore += this.parentScene.collected[b]*DATA.game.score.bonus
        })
        /*this.parentScene.artifactNames.forEach(ar => {
            this.bonusScore += this.parentScene.collected[ar]*DATA.game.score.artifact
        })*/

        this.score = 0
        this.fruitCount = []
        this.parentScene.fruitNames.forEach(fr => {
            this.score += this.parentScene.collected[fr]*DATA.game.score.fruit
        })
        this.score += this.parentScene.enemiesKilled*DATA.game.score.enemy

        this.omnitrixMatchScore = 0

        this.totalScore = this.score 
            + this.bonusScore 
            + this.omnitrixMatchScore





        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)

        let box = new Box(this, 1380, 550, {
            titleSize: 50,
            title: this.win? DATA.text.LevelEndScene.titleWin : DATA.text.LevelEndScene.titleLost,
            close: false
        })

        this.add.image(gWidth/2, gHeight*0.53, "ui-transparent-bg")
        .setScale(1.4, 1.21)

        // images 
        this.add.image(gWidth*0.15, gHeight*0.63,
            "level-end-" + (this.win? "win" : "lost") +
            "-char-" + this.parentScene.characterName)


        // stars
        this.add.circle(gWidth/2, gHeight*0.33, 70, 0xffffff).setAlpha(0.4)

        let pos = {
            side: 100,
            up: 12,
            scale: 0.9,
            lowScale: 0.78
        }

        this.star1 = this.win
        this.star2 = this.win
        this.star3 = this.win

        this.add.image(gWidth/2 -pos.side, gHeight*0.32-pos.up,
            "level-end-star-" + (this.star1? "on" : "off"))
            .setScale(pos.lowScale)
        this.add.image(gWidth/2 +pos.side, gHeight*0.32-pos.up,
            "level-end-star-" + (this.star3? "on" : "off"))
            .setScale(pos.lowScale)
        this.add.image(gWidth/2, gHeight*0.32,
            "level-end-star-" + (this.star2? "on" : "off"))
            .setScale(pos.scale)




        // score stuff
        let colors = {
            magenta: "#ED008C",
            black: "#000",
            white: "#fff",
            cyan: "#00ADEE",
            purple: "#9E005D"
        }
        let textFormat = {
            fontFamily: "nunito",
            align: "center",
            fontSize: 30,
            color: colors.magenta,
            stroke: colors.magenta,
            strokeThickness: 4
        }

        if (!this.win) {
            textFormat.fontSize = 55
            this.add.text(gWidth/2,
                gHeight*0.6,
                DATA.text.LevelEndScene.noLifes,
                textFormat)
            .setOrigin(0.5)
        }

        if (this.win) {
            this.add.image(gWidth*0.15, gHeight*0.3, "level-end-score-panel")
            this.add.text(gWidth*0.15, gHeight*0.3-20, 
                DATA.text.LevelEndScene.accumulate,{
                    fontFamily: "nunito",
                    align: "center",
                    fontSize: 19,
                    color: colors.cyan,
                    stroke: colors.cyan,
                    strokeThickness: 2
                }).setOrigin(0.5)
            this.add.text(gWidth*0.15, gHeight*0.3+25, 
                "000000",{
                    fontFamily: "a-hint-of-sass",
                    align: "center",
                    fontSize: 40,
                    fontStyle: "bold",
                    color: colors.black,
                    stroke: colors.black,
                    strokeThickness: 1
                }).setOrigin(0.5)

            // fruit 
            let fruitPos = {
                x: gWidth*0.315,
                y: gHeight*0.435,
                side: 100,
                text: 35,
                scale: 0.8
            }
            let archPos = {
                x: gWidth*(1-0.315),
                y: gHeight*0.435,
                side: 120,
                text: 35
            }

            this.add.image(fruitPos.x -fruitPos.side, 
                fruitPos.y, 
                "fruit-ui-" + this.parentScene.fruitNames[0])
                .setScale(fruitPos.scale)
            this.add.image(fruitPos.x, 
                fruitPos.y, 
                "fruit-ui-" + this.parentScene.fruitNames[1])
                .setScale(fruitPos.scale)
            this.add.image(fruitPos.x +fruitPos.side, 
                fruitPos.y, 
                "fruit-ui-" + this.parentScene.fruitNames[2])
                .setScale(fruitPos.scale)

            let textFruitFormat = {...textFormat}
            textFruitFormat.color = colors.white
            textFruitFormat.stroke = colors.black
            textFruitFormat.fontSize = 33
            textFruitFormat.fontStyle = "bold"
            textFruitFormat.strokeThickness = 7

            this.add.text(fruitPos.x - fruitPos.side,
                fruitPos.y + fruitPos.text,
                "x" + this.parentScene.collected[this.parentScene.fruitNames[0]],
                textFruitFormat)
                .setOrigin(0.5)
            this.add.text(fruitPos.x,
                fruitPos.y + fruitPos.text,
                "x" + this.parentScene.collected[this.parentScene.fruitNames[1]],
                textFruitFormat)
                .setOrigin(0.5)
            this.add.text(fruitPos.x + fruitPos.side,
                fruitPos.y + fruitPos.text,
                "x" + this.parentScene.collected[this.parentScene.fruitNames[2]],
                textFruitFormat)
                .setOrigin(0.5)

            textFormat.color = colors.purple
            textFormat.fontSize = 32
            textFormat.strokeThickness = 3

            this.add.text(fruitPos.x, 
                fruitPos.y - 70,
                DATA.text.LevelEndScene.fruits,
                textFormat)
                .setOrigin(0.5)




            // archievements
            textFormat.color = colors.cyan
            textFormat.stroke = colors.cyan

            this.add.text(gWidth*(1 - 0.315), 
                fruitPos.y - 70,
                DATA.text.LevelEndScene.archievements,
                textFormat)
                .setOrigin(0.5)

            







            // scores
            let textPos = {
                x: fruitPos.x,
                y: gHeight*0.56,
                line: 50,
                xRight: archPos.x
            }

            textFormat.fontSize = 25
            textFormat.strokeThickness = 3


            textFormat.color = colors.cyan
            textFormat.stroke = colors.cyan

            this.add.text(textPos.x, textPos.y, 
                DATA.text.LevelEndScene.yourScore,
                textFormat)
                .setOrigin(0, 0.5)

            this.add.text(textPos.xRight, textPos.y, 
                this.score,
                textFormat)
                .setOrigin(1, 0.5)
            

            textFormat.color = colors.purple
            textFormat.stroke = colors.purple

            this.add.text(textPos.x, textPos.y + textPos.line, 
                DATA.text.LevelEndScene.bonus,
                textFormat)
                .setOrigin(0, 0.5)

            this.add.text(textPos.xRight, textPos.y + textPos.line, 
                this.bonusScore,
                textFormat)
                .setOrigin(1, 0.5)
            


            textFormat.color = colors.black
            textFormat.stroke = colors.black

            if (this.parentScene.levelNumber % 4 == 0) {
                this.add.text(textPos.x, textPos.y + 2*textPos.line, 
                    DATA.text.LevelEndScene.omnitrix,
                    textFormat)
                    .setOrigin(0, 0.5)
    
                this.add.text(textPos.xRight, textPos.y + 2*textPos.line, 
                    this.omnitrixMatchScore,
                    textFormat)
                    .setOrigin(1, 0.5)

            }
            

            textFormat.color = colors.magenta
            textFormat.stroke = colors.magenta
            textFormat.fontSize = 35
            this.add.text(textPos.x, textPos.y + 3*textPos.line, 
                DATA.text.LevelEndScene.total,
                textFormat)
                .setOrigin(0, 0.5)

            this.add.text(textPos.xRight, textPos.y + 3*textPos.line, 
                this.totalScore,
                textFormat)
                .setOrigin(1, 0.5)

            
        }


        // buttons
        new ButtonImage({
            scene: this,
            x: gWidth*0.82,
            y: gHeight*0.2,
            image: "button-ui-audio",
            clickFunction: ()=> {

            }
        })

        new ButtonImage({
            scene: this,
            x: gWidth*0.755,
            y: gHeight*0.67,
            image: "button-opt-levels",
            clickFunction: ()=> {
                this.scene.stop()
                this.parentScene.scene.restart()
            }
        })

        if (this.win) {
            
            let levelEndDTO = {}

            levelEndDTO.fruits = []
            this.parentScene.fruitNames.forEach(fr => {
                levelEndDTO.fruits.push({
                    name: fr,
                    amount: this.parentScene.collected[fr]
                })
            })

            levelEndDTO.bonus = []
            this.parentScene.bonusNames.forEach(b => {
                levelEndDTO.bonus.push({
                    name: b,
                    amount: this.parentScene.collected[b]
                })
            })

            let art = this.parentScene.artifactNames[0]
            levelEndDTO.artifact = {
                name: art.split("-")[0],
                side: art.split("-")[1],
                amount: this.parentScene.collected[art]
            }

            levelEndDTO.enemies = this.parentScene.enemiesKilled

            levelEndDTO.omnitrix = this.parentScene.omnitrixCollected || []



            console.log(levelEndDTO)


            // services
            let levelValues = {
                at: 0,
                wbb: 4,
                su: 8,
                gmb: 12,
                ppg: 16
            }

            API.setLevelResult(
                this.parentScene.levelNumber + levelValues[this.parentScene.worldName], 
                this.parentScene.worldName + "-" + this.parentScene.levelNumber,
                levelEndDTO)



            new ButtonImage({
                scene: this,
                x: gWidth*0.864,
                y: gHeight*0.75,
                scale: 1.35,
                image: "button-opt-play",
                clickFunction: ()=> {
                    this.scene.stop()
                    this.parentScene.scene.restart()
                }
            })

            new ButtonImage({
                scene: this,
                x: gWidth*0.845,
                y: gHeight*0.53,
                scale: 1,
                image: "button-opt-restart",
                clickFunction: ()=> {
                    this.scene.stop()
                    this.parentScene.scene.restart()
                }
            })
        }
        else {
            new ButtonImage({
                scene: this,
                x: gWidth*0.864,
                y: gHeight*0.75,
                scale: 1.35,
                image: "button-opt-restart",
                clickFunction: ()=> {
                    this.scene.stop()
                    this.parentScene.scene.restart()
                }
            })
        }
        //Utils.drawDesignLines(this)
    }
}