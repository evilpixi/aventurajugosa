class RankingScene extends Phaser.Scene {
    constructor() {
        super("RankingScene")

        this.parentScene

        this.playersData
        
        this.currentPage

        this.shownElements

        this.userElements
    }
    
    init(data) {
        this.parentScene = data.parentScene
    }

    create() {
        this.add.rectangle(gWidth/2,gHeight/2,gWidth,gHeight, 0x000000, 0.8).setOrigin(0.5)
        
        // fill data
        this.playersData = []
        for (let i=1; i<=DATA.game.rankingNumber; i++) {
            this.playersData.push({
                name: DATA.text.RankingScene.loadingName,
                imageId: "level-selection-avatar-placeholder",
                score: ". . .",
                medals: [Phaser.Math.Between(0,1), Phaser.Math.Between(0,1), Phaser.Math.Between(0,1)]
            })
        }
        this.currentPage = 0
        this.maxPage = Math.ceil(this.playersData.length/4)-1

        this.scene.bringToTop()
        this.parentScene.scene.pause()
        this.events.once('shutdown', ()=>{ 
            this.parentScene.scene.resume()
        }, this);

        
        let box = new Box(this, 1400, 550, {
            title: DATA.text.RankingScene.title,
            close: true
        })
        let bg = this.add.image(box.pos.centerX, box.pos.centerY+40, "ui-transparent-bg")
        bg.setScale(1.8, 1.3)
        this.add.image(gWidth*0.17, gHeight*0.7, "ranking-gumball")

        // carousel
        let prevButton = new ButtonImage({
            scene: this,
            x: gWidth*(0.89),
            y: gHeight*0.25,
            scale: 0.6,
            image: "button-prev",
            clickFunction: ()=>{
                this.currentPage--
                if (this.currentPage < 0) this.currentPage = this.maxPage
                this.showPage(this.currentPage)
            }
        })
        prevButton.angle = 90
        
        let nextButton = new ButtonImage({
            scene: this,
            x: gWidth*(0.89),
            y: gHeight*0.75,
            scale: 0.6,
            image: "button-next",
            clickFunction: ()=>{
                this.currentPage++
                if (this.currentPage > this.maxPage) this.currentPage = 0
                this.showPage(this.currentPage)
            }
        })
        nextButton.angle = 90


        // shown elements
        this.shownElements = []

        let pos = {
            rankBase: gHeight*0.27,
            rankLine: 120,

            avatar: {
                x: gWidth*0.15,
                y: gHeight*0.27,
            }
        }
        pos.name = {
            x: pos.avatar.x,
            y: pos.avatar.y + 70
        }

        let textFormat = {
            fontFamily: "lubalin-graph",
            fontSize: 38,
            align: "center",
            color: "#000",
            stroke: "#000",
            strokeThickness: 0
        }

        let scoreFormat = {...textFormat}
        scoreFormat.fontFamily = "a-hint-of-sass"
        scoreFormat.strokeThickness = 1
        scoreFormat.fontSize = 42

        let nameSlots = ["yellow", "cyan", "magenta", "yellow"]

        for (let i=0; i<4; i++) {
            this.shownElements.push({
                index: this.add.image(gWidth*0.26, pos.rankBase + (i*pos.rankLine), "ranking-slot-number"),
                indexNumber: this.add.text(gWidth*0.26 +2, pos.rankBase + (i*pos.rankLine)+2, (i+1), textFormat).setOrigin(0.5),
                nameSlot: this.add.image(gWidth*0.43, pos.rankBase + (i*pos.rankLine), "ranking-slot-" + nameSlots[i]).setScale(1.17, 1),
                name: this.add.text(gWidth*0.43, pos.rankBase + (i*pos.rankLine), DATA.text.RankingScene.waitingName, textFormat).setOrigin(0.5),
                score: this.add.text(gWidth*0.7, pos.rankBase + (i*pos.rankLine), 
                "000000 " + DATA.text.RankingScene.points, scoreFormat).setOrigin(1, 0.5),
                medalApple: this.add.image(gWidth*0.74, pos.rankBase + (i*pos.rankLine), "ranking-medal-apple"),
                medalJojo: this.add.image(gWidth*0.74 +70, pos.rankBase + (i*pos.rankLine), "ranking-medal-jojo"),
                medalMixer: this.add.image(gWidth*0.74+70*2, pos.rankBase + (i*pos.rankLine), "ranking-medal-mixer")
            })
        }


        

        this.userElements = {
            avatarPlace: this.add.image(pos.avatar.x, pos.avatar.y, 
                "level-selection-avatar-section").setScale(1.2),

            avatar: this.add.image(pos.avatar.x, pos.avatar.y, 
                "level-selection-avatar-placeholder").setScale(1.2),

            namePlace: this.add.image(pos.name.x, pos.name.y, 
                "level-selection-name-section").setScale(0.6),
            
            nameText: this.add.text(pos.name.x, pos.name.y, 
                DATA.text.LevelSelectionScene.userName, 
                {
                    fontFamily: "lubalin-graph",
                    fontSize: 20,
                    color: "#fff",
                    stroke: "#fff",
                    strokeThickness: 0.5
                }).setOrigin(0.5),
            
            rankText: this.add.text(pos.name.x, pos.name.y+70, 
                DATA.text.RankingScene.rank
                + "\n???", 
                {
                    fontFamily: "lubalin-graph",
                    fontSize: 30,
                    align: "center",
                    color: "#000",
                    stroke: "#000",
                    strokeThickness: 0.5
                }).setOrigin(0.5),
        }
        API.getUser().then(res => {
            this.userElements.avatar.destroy()
            this.userElements.avatar = this.add.image(pos.avatar.x, 
                pos.avatar.y, 
                res.imageId)
            this.userElements.nameText.setText(res.name)
            this.userElements.rankText.setText(DATA.text.RankingScene.rank
                + "\n" + res.score)
        })

        API.getRanking(DATA.game.rankingNumber).then(res => {
            this.playersData = res
            this.showPage(this.currentPage)
        })
    }

    showPage(pageNumber) {
        this.shownElements.forEach((elemArray, i) => {
            elemArray.indexNumber.setText(i + 4*pageNumber + 1)
            elemArray.name.setText(this.playersData[i + 4*pageNumber].name
                + (i + 4*pageNumber + 1))
            elemArray.score.setText(this.playersData[i + 4*pageNumber].score
                + DATA.text.RankingScene.points)

            elemArray.medalApple.alpha = this.playersData[i + 4*pageNumber].medals[0]
            elemArray.medalJojo.alpha = this.playersData[i + 4*pageNumber].medals[1]
            elemArray.medalMixer.alpha = this.playersData[i + 4*pageNumber].medals[2]
        })
    }
}