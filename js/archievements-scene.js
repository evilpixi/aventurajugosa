class ArchievementsScene extends Phaser.Scene {
    constructor() {
        super("ArchievementsScene")

        this.parentScene

        this.starsText
    }
    
    init(data) {
        this.parentScene = data.parentScene
    }

    create() {
        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.events.once('shutdown', ()=>{
            this.parentScene.scene.resume()
        }, this);

        
        let box = new Box(this, gWidth, gHeight, {
            title: DATA.text.ArchievementsScene.title,
            close: false,
            titleSize: 55
        })
        box.title.y += 60
        box.title.imgIzq.y += 60
        box.title.imgDer.y += 60


        this.add.circle(gWidth/2, gHeight*0.35, 120, 0xFDFF7D)

        let pos = {
            star: {
                x: gWidth/2,
                y: gHeight*0.2
            },
            sideBg: {x: gWidth*0.17, y: gHeight*0.47},
            bgScale: {x:0.4, y:1.5},
            sideTitle: 92,
            sideSub: {x:50, y: 60},

            midSide: 165
        }

        let textFormatBig = {
            fontFamily: "nunito",
            fontSize: 32,
            color: "#000",
            align: "center",
            stroke: "#000",
            strokeThickness: 2
        }
        let textFormatMedium = {...textFormatBig}
        textFormatMedium.fontSize = 24
        textFormatMedium.strokeThickness = 1

        API.getArchievements().then(res => {
            let cup = this.add.image(gWidth*0.315, gHeight*0.1, "archievements-cup")
            this.tweens.add({
                targets: cup,
                scale: {from: 0, to: 1.2},
                duration: 300,
                ease: "Back"
            })
            let archs = res
            DATA.archievements = res



            // --- CENTER --------------------------------------------------------------------------

            for (let i=-1; i<=1; i++) {
                let star = this.add.image(gWidth*0.5 + i*135, gHeight*0.32,
                    "level-end-star-on")
                
                if (i==0) {
                    star.setScale(1.3)
                    star.y += 30
                    star.depth = 10
                }
                else {
                    star.setScale(1.05)
                }
            }

            this.starsText = this.add.text(gWidth*0.6-20, 
                gHeight*0.48-20, 
                DATA.countAllStars(DATA.levelProgress) + "/" + (4*5*3), textFormatBig)
                .setOrigin(0.5)
            
            let midTextFormat = {
                fontFamily: "lubalin-graph",
                color: "#000",
                stroke: "#000",
                strokeThickness: 2,
                fontSize: 48,
                align: "center"
            }
            this.add.text(gWidth/2, gHeight*0.54, 
                DATA.text.ArchievementsScene.artifacts,
            midTextFormat).setOrigin(0.5)

            
            midTextFormat.strokeThickness = 1
            midTextFormat.fontSize = 32

            let midNameTextFormat = {...midTextFormat}
            midNameTextFormat.fontSize = 19
            midNameTextFormat.strokeThickness = 0.2

            // pane left
            let objPaneLeft = this.add.image(gWidth/2 - pos.midSide,
                gHeight*0.78, "archievements-object-panel")

            this.add.text(gWidth/2 - pos.midSide,
                gHeight*0.78-112,  DATA.text.ArchievementsScene.artifacts,
                midTextFormat).setOrigin(0.5)

                
            let artifacts = []
            let sideValues = {
                "none": 0,
                "left": 1,
                "right": 1,
                "both": 2
            }
            DATA.artifactNames.forEach(ar => {

                let sides = archs.artifacts.find(x=> x.name == ar).sides

                artifacts.push([
                    this.add.image(objPaneLeft.x,
                        objPaneLeft.y-8,
                        "logros-ui-artifact-" + ar + "-" + sides),

                    this.add.text(objPaneLeft.x,
                        objPaneLeft.y - 67,
                        DATA.artifactNamesSpanish[ar].toUpperCase(),
                        midNameTextFormat).setOrigin(0.5),

                    this.add.text(objPaneLeft.x,
                        objPaneLeft.y + 67,
                        DATA.text.ArchievementsScene.good + sideValues[sides] + "/2",
                        midNameTextFormat).setOrigin(0.5)
                ])
            })
            this.artifactCarousel = new Carousel({
                elements: artifacts
            })
            this.addCarouselButtons(objPaneLeft.x,
                objPaneLeft.y, this.artifactCarousel)



            // pane right
            let objPaneRight = this.add.image(gWidth/2 + pos.midSide,
                gHeight*0.78, "archievements-object-panel")

            this.add.text(gWidth/2 + pos.midSide,
                gHeight*0.78-112,  DATA.text.ArchievementsScene.medals,
                midTextFormat).setOrigin(0.5)

            let medals = []
            let medalsAmounts = [

                archs.fruits.reduce((x,y)=> {
                    return x + y.amount
                }, 0),

                archs.killedEnemies,

                archs.artifacts.reduce((x,y)=> {
                    return x + (y.sides == "both" ? 1 : 0)
                }, 0)
            ]

            DATA.medalNames.forEach((medal,mi) => {

                let max = DATA.gamificationCount.medalsNeed[medal]
                let completed = medalsAmounts[mi] == max ? "" : "-bn"
                medals.push([
                    this.add.image(objPaneRight.x,
                        objPaneRight.y-8,
                        "logros-ui-medalla-r-" + medal + completed).setScale(1),

                    this.add.text(objPaneRight.x,
                        objPaneRight.y - 67,
                        DATA.text.ArchievementsScene.medalNames[medal],
                        midNameTextFormat).setOrigin(0.5),

                    this.add.text(objPaneRight.x,
                        objPaneRight.y + 67,
                        DATA.text.ArchievementsScene.good + medalsAmounts[mi] +"/" + max,
                        midNameTextFormat).setOrigin(0.5)
                ])
            })
            this.medalCarousel = new Carousel({
                elements: medals
            })
            this.addCarouselButtons(objPaneRight.x,
                objPaneRight.y, this.medalCarousel)
            






            // --- RIGHT -----------------------------------------------------------------------
            let bgRight = this.add.image(gWidth - pos.sideBg.x,
                pos.sideBg.y,
                "archievements-bg")

            // ---
            this.add.text(gWidth - pos.sideBg.x, gHeight*0.22 - pos.sideTitle,
                DATA.text.ArchievementsScene.stickers, textFormatBig)
                .setOrigin(0.5)

            let stickers = []
            DATA.stickerNames.forEach((sticker,i) => {
                
                let amount= archs.stickers.find(s => s.name == sticker).amount
                let max = DATA.gamificationCount.bonus[sticker]
                let completed = amount == max ? "" : "-bn"
                stickers.push([
                    this.add.image(gWidth - pos.sideBg.x, gHeight*0.22,
                        "logros-ui-" + sticker + completed).setScale(0.9),

                    this.add.text(gWidth - pos.sideBg.x +pos.sideSub.x, 
                        gHeight*0.22 + pos.sideSub.y,
                        amount+"/" + max, textFormatMedium).setOrigin(0.5)
                ])
            })
            this.stickerCarousel = new Carousel({
                elements: stickers
            })
            this.addCarouselButtons(gWidth - pos.sideBg.x, 
                gHeight*0.22, this.stickerCarousel)

            // ---
            this.add.text(gWidth - pos.sideBg.x, gHeight*0.5 - pos.sideTitle,
                DATA.text.ArchievementsScene.filters, textFormatBig)
                .setOrigin(0.5)

            let filters = []
            
            DATA.filterNames.forEach((filter,i) => {
                let amount = archs.filters.find(f => f.name == filter).amount
                let max = DATA.gamificationCount.bonus[filter]
                let completed = amount == max ? "" : "-bn"
                filters.push([
                    this.add.image(gWidth - pos.sideBg.x, gHeight*0.5,
                        "logros-ui-" + filter + completed).setScale(0.9),

                    this.add.text(gWidth - pos.sideBg.x +pos.sideSub.x, 
                        gHeight*0.5 + pos.sideSub.y,
                        amount + "/" + max, textFormatMedium).setOrigin(0.5)
                ])
            })
            this.filterCarousel = new Carousel({
                elements: filters
            })
            this.addCarouselButtons(gWidth - pos.sideBg.x, 
                gHeight*0.5, this.filterCarousel)

            // ---
            this.add.text(gWidth - pos.sideBg.x, gHeight*0.78 - pos.sideTitle,
                DATA.text.ArchievementsScene.accesories, textFormatBig)
                .setOrigin(0.5)

            let accesories = []
            DATA.accesoryNames.forEach((acc,i) => {
                let amount = archs.accesories.find(a => a.name == acc).amount
                let max = DATA.gamificationCount.bonus[acc]
                let completed = amount == max ? "" : "-bn"
                accesories.push([
                    this.add.image(gWidth - pos.sideBg.x, gHeight*0.78,
                        "logros-ui-" + acc + completed).setScale(0.9),

                    this.add.text(gWidth - pos.sideBg.x +pos.sideSub.x, 
                        gHeight*0.78 + pos.sideSub.y,
                        amount + "/" + max, textFormatMedium).setOrigin(0.5)
                ])
            })
            this.accesoryCarousel = new Carousel({
                elements: accesories
            })
            this.addCarouselButtons(gWidth - pos.sideBg.x, 
                gHeight*0.78, this.accesoryCarousel)





            // --- LEFT --------------------------------------------------------------------------
            let bgLeft = this.add.image(pos.sideBg.x, 
                pos.sideBg.y, 
                "archievements-bg")
            let scorePanel = this.add.image(pos.sideBg.x,
                gHeight*0.2,
                "archievements-score-panel")

            this.add.text(pos.sideBg.x,
                gHeight*0.2-30,
                DATA.text.LevelSelectionScene.points, {
                    fontFamily: "nunito", 
                    align: "center", 
                    fontSize: 27, 
                    color: "#009ddc", 
                    strokeThickness: 3, 
                    stroke: "#009ddc"
                }).setOrigin(0.5)

            this.textScore = this.add.text(pos.sideBg.x,
                gHeight*0.2+30, 
                Utils.makeTextCiphers(DATA.userData ? DATA.userData.score : 0, 6), {
                    fontFamily: "a-hint-of-sass",
                    color: "#000",
                    stroke: "#000",
                    strokeThickness: 2,
                    fontSize: 45
                }).setOrigin(0.5)

                if (!DATA.userData) {
                    API.getUser().then(res => {
                        DATA.userData = res.data
                        this.textScore.setText(Utils.makeTextCiphers(DATA.userData.score))
                    })
                }

            // ---
            this.add.text(pos.sideBg.x, gHeight*0.5 - pos.sideTitle,
                DATA.text.ArchievementsScene.fruits, textFormatBig)
                .setOrigin(0.5)

            let fruits = []
            DATA.fruitNames.forEach((fruit,i) => {
                let amount = archs.fruits.find(f => f.name == fruit).amount
                let max = DATA.gamificationCount.fruits[fruit]
                fruits.push([
                    this.add.image(pos.sideBg.x, gHeight*0.5,
                        "fruit-ui-" + fruit).setScale(1.2),

                    this.add.text(pos.sideBg.x +pos.sideSub.x, 
                        gHeight*0.5 + pos.sideSub.y,
                        amount + "/" + max, textFormatMedium).setOrigin(0.5)
                ])
            })
            this.fruitCarousel = new Carousel({
                elements: fruits
            })
            this.addCarouselButtons(pos.sideBg.x, gHeight*0.5, this.fruitCarousel)

            // ---
            this.add.text(pos.sideBg.x, gHeight*0.78 - pos.sideTitle,
                DATA.text.ArchievementsScene.ben10, textFormatBig)
                .setOrigin(0.5)

            let ben10 = []
            DATA.omnitrix.pointsLevels.forEach((omniLevel,w) => {
                for (let i=0; i<=2; i++) {

                    let champ = omniLevel.champs[i]
                    let matches = omniLevel.combos[i]
                    let world = Utils.toRelative(w*4 +1).split("-")[0]

                    let amount = archs.omnitrix[world][i].amount
                    let completed = amount == matches ? "" : "-bn"
                    ben10.push([
                        this.add.image(pos.sideBg.x, gHeight*0.78,
                            "omni-champ-ui-" + champ + completed).setScale(0.9),
        
                        this.add.text(pos.sideBg.x +pos.sideSub.x, 
                            gHeight*0.78 + pos.sideSub.y,
                            amount+"/" + matches, textFormatMedium).setOrigin(0.5)
                    ])
                }
                
            })
            this.ben10Carousel = new Carousel({
                elements: ben10
            })
            this.addCarouselButtons(pos.sideBg.x, gHeight*0.78, this.ben10Carousel)


        })
        




        //Utils.drawDesignLines(this)

        let closeButton = new ButtonImage({
            scene: this,
            image: "button-close",
            x: gWidth*0.95,
            y: gHeight*0.1,
            clickFunction: ()=>{
                this.scene.stop()
                this.parentScene.scene.resume()
            }
        })
        closeButton.depth = 20
    }

    addCarouselButtons(x,y, carousel, scale) {
        let s = scale || 0.5
        let buttonX = 105
        let prev = new ButtonImage({
            scene: this,
            x: x - buttonX,
            y: y,
            image: "button-prev",
            scale: s,
            clickFunction: ()=> { carousel.prev()}
        })
        let next = new ButtonImage({
            scene: this,
            x: x + buttonX,
            y: y,
            image: "button-next",
            scale: s,
            clickFunction: ()=> { carousel.next()}
        })
    }
}