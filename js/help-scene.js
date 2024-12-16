class HelpScene extends Phaser.Scene {
    constructor() {
        super("HelpScene")

        this.parentScene
        this.carousel //= new Carousel([])
    }

    init(data) {
        this.parentScene = data.parentScene
    }

    create() {
        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)
        
        let box = new Box(this, 1000, 550, {
            title: DATA.text.HelpScene.title,
            close: true
        })
        this.add.image(box.pos.centerX, box.pos.down+10, "button-red")
        let textIndex = this.add.text(box.pos.centerX, 
            box.pos.down+11, "0/0", 
            Utils.getTitleTextFormat(40,"#fff"))
        textIndex.setOrigin(0.5)

        let colors = ["#009ddc", "#eb008b", "#1d1d1b"] // cyan / magenta / black
        let textConfigs = []
        for (var i=0; i<3; i++) {
            textConfigs.push({
                fontFamily: "nunito", align: "center", fontSize: 34, color: colors[i], 
                strokeThickness: 3, stroke: colors[i]
            })
        }
        for (var i=0; i<3; i++) {
            textConfigs.push({
                fontFamily: "nunito", align: "center", fontSize: 22, color: colors[i], 
                strokeThickness: 2, stroke: colors[i]
            })
        }
        let pos = {xWide: 290, y: 130, xNarrow: 240}
        let images = [
            /*[
                this.add.image(box.pos.centerX, box.pos.centerY-25, "ui-transparent-bg")
                    .setScale(1.25, 1.1),
                this.add.image(box.pos.centerX, box.pos.centerY-25, "help-image1").setScale(0.9),
                this.add.text(box.pos.centerX, box.pos.down-58, DATA.text.HelpScene.fruitsAndJump, {
                    fontFamily: "nunito", align: "center", fontSize: 32, color:"#ff0086", 
                    strokeThickness: 3, stroke:"#ff0086"
                }).setOrigin(0.5)
            ],
            [
                this.add.image(box.pos.centerX, box.pos.centerY-25, "ui-transparent-bg")
                    .setScale(1.25, 1.1),
                this.add.image(box.pos.centerX, box.pos.centerY-25, "help-image2").setScale(0.9),
                this.add.text(box.pos.centerX, box.pos.down-58, 
                    DATA.text.HelpScene.avoidObstacles, {
                    fontFamily: "nunito", align: "center", fontSize: 32, color:"#ff0086", 
                    strokeThickness: 3, stroke:"#ff0086"
                }).setOrigin(0.5)
            ],
            [
                this.add.image(box.pos.centerX, box.pos.centerY, "ui-transparent-bg")
                    .setScale(1.25, 1.2),
                // titles
                this.add.text(box.pos.centerX -pos.xWide, box.pos.centerY -pos.y, 
                    DATA.text.HelpScene.lifes, textConfigs[0]),
                this.add.text(box.pos.centerX, box.pos.centerY -pos.y, 
                    DATA.text.HelpScene.fruitsCollected, textConfigs[1]),
                this.add.text(box.pos.centerX +pos.xWide, box.pos.centerY -pos.y, 
                    DATA.text.HelpScene.bonus, textConfigs[2]),
                // icons
                this.add.image(box.pos.centerX -pos.xWide, box.pos.centerY-5, "help-heart"),
                this.add.image(box.pos.centerX       , box.pos.centerY-5, "help-fruit"),
                this.add.image(box.pos.centerX +pos.xWide, box.pos.centerY-5, "help-omnitrix"),
                //texts
                this.add.text(box.pos.centerX -pos.xWide, box.pos.centerY +pos.y, 
                    DATA.text.HelpScene.lifesText, textConfigs[3]),
                this.add.text(box.pos.centerX, box.pos.centerY +pos.y, 
                    DATA.text.HelpScene.fruitsCollectedText, textConfigs[4]),
                this.add.text(box.pos.centerX +pos.xWide, box.pos.centerY +pos.y, 
                    DATA.text.HelpScene.bonusText, textConfigs[5]),
            ],
            [
                this.add.image(box.pos.centerX, box.pos.centerY, "ui-transparent-bg")
                    .setScale(1.25, 1.2),
                this.add.text(box.pos.centerX -pos.xNarrow, box.pos.centerY -pos.y-30, 
                    DATA.text.HelpScene.fruits, Utils.getTitleTextFormat(40, colors[1])),
                this.add.text(box.pos.centerX +pos.xNarrow, box.pos.centerY -pos.y-30, 
                    DATA.text.HelpScene.artifacts, Utils.getTitleTextFormat(40, colors[0])),
                this.add.text(box.pos.centerX, box.pos.centerY + pos.y+20, 
                    DATA.text.HelpScene.fruitsAndArtifacts, textConfigs[2]),
                //imgs
                this.add.image(box.pos.centerX -pos.xNarrow, box.pos.centerY-25, "help-fruits"),
                this.add.image(box.pos.centerX +pos.xNarrow, box.pos.centerY-25, "help-artifacts"),
                new ButtonImage({scene: this, x: box.pos.centerX})
            ]*/
        ]
        //images[2].forEach(e => e.setOrigin(0.5))
        //images[3].forEach(e => e.setOrigin(0.5))
        /*for (var i=1; i<=3; i++) {
            let img = this.add.image(box.pos.centerX, box.pos.centerY, "help"+i)
            img.setScale(0.5)
            images.push([img])
        }*/

        for (let i=1; i<=DATA.helpImages; i++) {
            images.push([
                this.add.image(box.pos.centerX, box.pos.centerY-25, "help-image"+[i]).setScale(0.9),
                this.add.text(box.pos.centerX, box.pos.down-58, DATA.text.HelpScene.pages[i-1], {
                    fontFamily: "nunito", align: "center", fontSize: 32, color:"#ff0086", 
                    strokeThickness: 3, stroke:"#ff0086"
                }).setOrigin(0.5)
            ])
        }

        console.log(images)

        this.carousel = new Carousel({
            elements: images,
            autoInitialize: false
        })
        this.carousel.updateFunction = ()=>{
            textIndex.setText(this.carousel.active+1 + "/" + this.carousel.list.length)
        }
        this.carousel.initialize()

        let prevButton = new ButtonImage({
            scene: this,
            x:box.pos.left-25,
            y:box.pos.centerY,
            image: "button-prev",
            clickFunction: ()=> { this.carousel.prev()}
        })
        let nextButton = new ButtonImage({
            scene: this,
            x:box.pos.right+25,
            y:box.pos.centerY,
            image: "button-next",
            clickFunction: ()=> { this.carousel.next()}
        })
    }
}