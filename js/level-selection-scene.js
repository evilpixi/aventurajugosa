class LevelSelectionScene extends Phaser.Scene {
    constructor() {
        super("LevelSelectionScene") 

        //this.levelNumber
        this.worldName

        this.userData
        this.avatar
        this.avatarPlaceholder
        this.avatarPos
        this.textName
        this.textScore

        this.levelElements
        this.carousel
        this.btnRank
    }

    create() {
        let txt = DATA.text.LevelSelectionScene
        let box = new Box(this,
            gWidth,
            gHeight,
            {
                title: txt.title,
                titleSize: 56
            }
        )
        let title = { x: 180, y: 115}



        box.title.x += title.x
        box.title.imgIzq.x += title.x
        box.title.imgDer.x += title.x

        box.title.y += title.y 
        box.title.imgIzq.y += title.y
        box.title.imgDer.y += title.y

        new ButtonImage({
            scene: this,
            x: gWidth*(0.5 + 0.32+0.03),
            y: gHeight*0.1,
            scale: 1,
            image: "button-ui-audio",
            clickFunction: ()=>{
            }
        })
        new ButtonImage({
            scene: this,
            x: gWidth*(0.5 + 0.38+0.03),
            y: gHeight*0.1,
            scale: 1,
            image: "button-ui-options",
            clickFunction: ()=>{
                game.scene.start("OptionsScene", {parentScene: this})
            }
        })

        this.avatarPos = {x: gWidth*0.09, y: gHeight*0.22}

        this.add.image(gWidth*0.195, gHeight*0.22, 
            "level-selection-name-section")
        this.textName = this.add.text(gWidth*0.195, gHeight*0.22, 
            DATA.text.LevelSelectionScene.userName, 
            {
                fontFamily: "lubalin-graph",
                fontSize: 36,
                color: "#fff",
                stroke: "#fff",
                strokeThickness: 0.5
            }).setOrigin(0.5)

        this.add.image(this.avatarPos.x, this.avatarPos.y, 
            "level-selection-avatar-section")
        this.avatarPlaceholder = this.add.image(this.avatarPos.x, this.avatarPos.y, 
            "level-selection-avatar-placeholder")

        this.add.image(gWidth*0.165, gHeight*0.46, 
            "level-end-score-panel")
        .setScale(1.7, 1.85)
        this.add.text(gWidth*0.165, gHeight*0.41,
            DATA.text.LevelSelectionScene.points, {
                fontFamily: "nunito", 
                align: "center", 
                fontSize: 34, 
                color: "#009ddc", 
                strokeThickness: 3, 
                stroke: "#009ddc"
            }).setOrigin(0.5)

        this.textScore = this.add.text(gWidth*0.165, gHeight*0.52, 
            "000000", {
                fontFamily: "a-hint-of-sass",
                color: "#000",
                stroke: "#000",
                strokeThickness:2,
                fontSize: 65
            }).setOrigin(0.5)

        new ButtonImage({
            scene: this,
            x: gWidth*0.114,
            y: gHeight*0.74,
            image: "button-level-selection-archievements",
            clickFunction: ()=> {
                game.scene.start("ArchievementsScene", {parentScene: this})
            }
        })

        this.btnRank = {}
        this.btnRank.on = new ButtonImage({
            scene: this,
            x: gWidth*0.22,
            y: gHeight*0.74,
            image: "button-level-selection-ranking",
            clickFunction: ()=> {
                game.scene.start("RankingScene", {parentScene: this})
            }
        })
        this.btnRank.on.setAlpha(0)

        this.btnRank.off = this.add.image(gWidth*0.22, gHeight*0.74, 
            "button-level-selection-ranking-bn")

            


        // ---------- this.carousel ------------
        let elements = []
        this.levelElements = {}
        DATA.cartoonNames.forEach(cn => {

            this.levelElements[cn] = []

            let world = [
                this.add.image(gWidth*0.61, gHeight*0.55, "world-bg-"+cn),
                this.add.image(gWidth*0.425, gHeight*0.44, "world-logo-"+cn)
                .setScale(0.9),
                this.add.image(gWidth*0.425, gHeight*0.7, "world-char-"+cn)
                .setScale(0.7)
            ]
            
            for (let i=1; i<=4; i++) {
                let btnPos = {
                    x: gWidth * (i%2!=0? 0.62 : 0.78),
                    y: gHeight* (i<=2? 0.4 : 0.68),
                    starX: 30,
                    starY: 60,
                    star0Y: 10,
                    starScale: 0.27,
                    star0Scale: 1.2
                }
                
                let ii = i

                // button OK
                let btn = new ButtonImage({
                    scene: this,
                    x: btnPos.x,
                    y: btnPos.y,
                    image: "button-level"+i,
                    clickFunction: ()=> {
                        game.scene.start("CharacterSelectionScene", {
                            worldName: this.worldName,
                            parentScene: this,
                            levelNumber: ii
                        })
                    }
                })
                world.push(btn)

                // button block
                let btnBlock = this.add.image(btnPos.x, btnPos.y, "button-level"+i+"-bn")
                world.push(btnBlock)

                //let stars = 0
                // let starsObjects = []
                // starsObjects.push(
                //     this.add.image(btnPos.x - btnPos.starX, 
                //         btnPos.y + btnPos.starY,
                //         "level-end-star-" + (stars>0? "on": "off"))
                //         .setScale(btnPos.starScale)
                // )
                // starsObjects.push(
                //     this.add.image(btnPos.x, 
                //         btnPos.y + btnPos.starY + btnPos.star0Y,
                //         "level-end-star-" + (stars>1? "on": "off"))
                //         .setScale(btnPos.starScale*btnPos.star0Scale)
                // )
                // starsObjects.push(
                //     this.add.image(btnPos.x + btnPos.starX, 
                //         btnPos.y + btnPos.starY,
                //         "level-end-star-" + (stars>2? "on": "off"))
                //         .setScale(btnPos.starScale)
                // )

                // starsObjects[1].depth = 3

                /*starsObjects.forEach((s,i) => {
                    world.push(s)
                })*/

                this.levelElements[cn].push({
                    available: btn,
                    unavailable: btnBlock
                })
            }

            elements.push(world)
        })

        Object.values(this.levelElements).forEach(levelButtons => {
            levelButtons.forEach(lvlBtns => {
                lvlBtns.available.setVisible(false)
                lvlBtns.available.setActive(false)
            })
        })

        
        
        
        // ----

        this.add.image(gWidth*0.425, gHeight*0.32, "level-selection-world-word")

        this.carousel = new Carousel({
            elements: elements
        })
        
        this.carousel.updateFunction = ()=> {
            this.worldName = DATA.cartoonNames[this.carousel.active]
        }
        let bgMovX = 100
        this.carousel.prevFunction = ()=> {
            let bg = this.carousel.list[this.carousel.active][0]
            bg.x += bgMovX
            bg.alpha = 0
            this.tweens.add({
                targets: bg,
                duration: 100,
                ease: "Back",
                x: bg.x - bgMovX,
                alpha: 1
            })

            let chr = this.carousel.list[this.carousel.active][2]
            this.tweens.add({
                targets: chr,
                duration: 75,
                ease: "Back",
                scale: {from: 0.4, to: 0.7},
                alpha: {from: 0, to: 1}
            })
        }
        this.carousel.nextFunction = ()=> {
            let bg = this.carousel.list[this.carousel.active][0]
            bg.x -= bgMovX
            bg.alpha = 0
            this.tweens.add({
                targets: bg,
                duration: 100,
                ease: "Back",
                x: bg.x + bgMovX,
                alpha: 1
            })

            let chr = this.carousel.list[this.carousel.active][2]
            this.tweens.add({
                targets: chr,
                duration: 75,
                ease: "Back",
                scale: {from: 0.4, to: 0.7},
                alpha: {from: 0, to: 1}
            })
        }
        this.carousel.initialize()

        API.getAllLevelsProgress().then(res => {
            let levelProgress = res.data
            DATA.levelProgress = res.data

            let worldNames = ["at", "wbb", "su", "gmb", "ppg"]

            worldNames.forEach((cn,j) => {
                levelProgress[cn].forEach((lvl,i) => {
                    this.levelElements[cn][i].available.setVisible(levelProgress[cn][i].unlocked)
                    this.levelElements[cn][i].available .setActive(levelProgress[cn][i].unlocked)
                    
                    this.levelElements[cn][i].unavailable.setVisible(!levelProgress[cn][i].unlocked)
                    this.levelElements[cn][i].unavailable .setActive(!levelProgress[cn][i].unlocked)

                    if (levelProgress[cn][i].unlocked) {

                        let starsObjects = []

                        let btnPos = {
                            starX: 30,
                            starY: 60,
                            star0Y: 10,
                            starScale: 0.27,
                            star0Scale: 1.2
                        }
                        btnPos.x = gWidth * ((i+1)%2!=0? 0.62 : 0.78)
                        btnPos.y = gHeight* ((i+1)<=2? 0.4 : 0.68)

                        starsObjects.push(
                            this.add.image(btnPos.x - btnPos.starX, 
                                btnPos.y + btnPos.starY,
                                "level-end-star-" + (levelProgress[cn][i].stars>0? "on": "off"))
                                .setScale(btnPos.starScale)
                        )
                        starsObjects.push(
                            this.add.image(btnPos.x, 
                                btnPos.y + btnPos.starY + btnPos.star0Y,
                                "level-end-star-" + (levelProgress[cn][i].stars>1? "on": "off"))
                                .setScale(btnPos.starScale*btnPos.star0Scale)
                        )
                        starsObjects.push(
                            this.add.image(btnPos.x + btnPos.starX, 
                                btnPos.y + btnPos.starY,
                                "level-end-star-" + (levelProgress[cn][i].stars>2? "on": "off"))
                                .setScale(btnPos.starScale)
                        )

                        starsObjects[1].depth = 3
                        this.carousel.list[j] = this.carousel.list[j].concat(starsObjects)
                    }

                    this.carousel.setActive(this.carousel.active)
                })
            })
        })

        new ButtonImage({
            scene: this,
            x: gWidth*0.33,
            y: gHeight*0.55,
            scale: 0.9,
            image: "button-prev",
            clickFunction: ()=>{
                this.carousel.prev()
            }
        })

        new ButtonImage({
            scene: this,
            x: gWidth*0.89,
            y: gHeight*0.55,
            scale: 0.9,
            image: "button-next",
            clickFunction: ()=>{
                this.carousel.next()
            }
        })

        
        //keyboard
        this.input.keyboard.once("keydown-SPACE", ()=>{
            this.scene.start("CharacterSelectionScene", {
                worldName: this.worldName,
                parentScene: this,
                levelNumber: 1
            })
            this.scene.stop()
        })
        //keyboard
        this.input.keyboard.once("keydown-ONE", ()=>{
            this.scene.start("CharacterSelectionScene", {
                worldName: this.worldName,
                parentScene: this,
                levelNumber: 1
            })
            this.scene.stop()
        })
        //keyboard
        this.input.keyboard.once("keydown-TWO", ()=>{
            this.scene.start("CharacterSelectionScene", {
                worldName: this.worldName,
                parentScene: this,
                levelNumber: 2
            })
            this.scene.stop()
        })
        //keyboard
        this.input.keyboard.once("keydown-THREE", ()=>{
            this.scene.start("CharacterSelectionScene", {
                worldName: this.worldName,
                parentScene: this,
                levelNumber: 3
            })
            this.scene.stop()
        })
        //keyboard
        this.input.keyboard.once("keydown-FOUR", ()=>{
            this.scene.start("CharacterSelectionScene", {
                worldName: this.worldName,
                parentScene: this,
                levelNumber: 4
            })
            this.scene.stop()
        })

        this.input.keyboard.on("keydown-LEFT", ()=>{
            this.carousel.prev()
        })
        this.input.keyboard.on("keydown-RIGHT", ()=>{
            this.carousel.next()
        })

        // HTTP
        //API.getUser().then(res => this.setUserData(res))
        try {
            API.getUser({nickname: "John"})
            .then(res => {
                this.setUserData(res.data)
                DATA.userDATA = res.data
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    setUserData(userData) {
        this.userData = userData
        this.avatarPlaceholder.alpha = 0

        this.textName.setText(userData.name.toUpperCase())
        this.textScore.setText(Utils.makeTextCiphers(userData.score, 6))
        this.add.image(this.avatarPos.x, this.avatarPos.y, userData.imageId)

        this.btnRank.on.alpha  = userData? 1 : 0
        this.btnRank.off.alpha = userData? 0 : 1
    }
    
}