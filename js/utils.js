class Utils {
    static getTitleTextFormat(fontSize, color) {
        return {
            fontFamily: "lubalin-graph",
            align: "center",
            fontSize: fontSize || 40,
            color: color || "#000"
        }
    }
}

Utils.shuffleArray = (array)=> {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let aux = array[i]
        array[i] = array[j]
        array[j] = aux
    }
    return array
}

/* TEMPLATE
button1 = 
new ButtonImage({
    scene: this,
    x:100,
    y:100,
    image: "button-left",
    clickFunction: ()=> { console.log("clicked!")}
})
*/

Utils.toAbsolute = (relativeLevel) => {
    let levelValues = {
        at: 0,
        wbb: 4,
        su: 8,
        gmb: 12,
        ppg: 16
    }
    let world = relativeLevel.split("-")[0]
    let lvl = relativeLevel.split("-")[1]
    return levelValues[world] + Number(lvl)
}
Utils.toRelative = (absoluteLevel) => {
    let levelValues = {
        0: "at",
        4: "wbb",
        8: "su",
        12: "gmb",
        16: "ppg"
    }

    let worldOffset = Math.floor((absoluteLevel-1)/4)*4
    let world = levelValues[worldOffset]
    let lvl = absoluteLevel - worldOffset

    return world + "-" + lvl
}


class ButtonImage extends Phaser.GameObjects.Image {    
    constructor({scene, x=0, y=0, image, 
        text="", 
        textConfig={},
         scale=1, 
         clickFunction = ()=>{}
        }) 
    {
        super(scene, x, y, image)
        scene.add.existing(this)
        
        this.startScale = scale
        this.setScale(this.startScale)

        this.text
        if (text) {
            this.text = scene.add.text(x, y, text, textConfig)
            this.text.setOrigin(0.5)
            this.text.setScale(this.startScale)
        }

        this.setInteractive()
        this.setScrollFactor(0)

        this.isDown = false
        this.on("pointerover", ()=>{
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale*1.1,
                ease: 'Back'
            })
        })
        this.on("pointerout", ()=>{
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale,
                ease: 'Back'
            })
        })
        this.on("pointerdown", ()=>{
            this.isDown = true
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale*0.8,
                ease: 'Back'
            })
        })
        this.on("pointerup", ()=>{
            this.isDown = false
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale,
                ease: 'Back',
                onComplete: clickFunction
            })
        })
    }
}

class Carousel {
    constructor({elements = [], 
        nameList = [], 
        updateFunction = ()=>{}, 
        prevFunction = ()=>{},
        nextFunction = ()=>{},
        autoInitialize = true
    }) {
        this.list = elements
        this.nameList = nameList
        this.active = 0
        this.max = this.list.length-1
        this.prevFunction = prevFunction
        this.nextFunction = nextFunction
        this.updateFunction = updateFunction

        //this.

        if (autoInitialize) this.initialize()
    }
    initialize() {
        for(var i=1; i<this.list.length; i++) {
            this.list[i].forEach(e => {
                e.active = false
                e.alpha = 0
            })
        }
        this.setActive(0)
    }

    add(element, name = null, prevFunction=undefined, nextFunction=undefined) {
        this.list.push(element)
        this.max++
        if (name) {
            this.nameList.push(name)
        }
        this.prevFunction = prevFunction? prevFunction : () => {}
        this.nextFunction = nextFunction? nextFunction : () => {}
    }

    prev() {
        if (this.active == 0) {
            this.setActive(this.max)
        }
        else {
            this.setActive(this.active-1)
        }
        this.prevFunction.call()
    }

    next() {
        if (this.active == this.max) {
            this.setActive(0)
        }
        else {
            this.setActive(this.active+1)
        }
        this.nextFunction.call()
    }

    setActive(index) {
        this.list.forEach(subList => {
            subList.forEach(e => {
                e.active = false
                e.alpha = 0
            })
        })
        /*this.list[this.active].forEach(e => {
            e.active = false
            e.alpha = 0
        })*/
        this.list[index].forEach(e => {
            e.active = true
            e.alpha = 1
        })
        this.active = index
        this.updateFunction.call()
    }

    setActiveByName(name) {
        this.setActive(this.nameList.indexOf(name))
    }
}

Utils.makeTextCiphers = (number, ciphers)=> {
    let textNumber = "" + number
    let leftZeros = ""
    let neededZeros = ciphers - textNumber.length

    for (let i=0; i < neededZeros; i++) {
        leftZeros += "0"
    }
    return leftZeros + textNumber
}

Utils.numberWithThoursandsSeparator = (number)=> {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

class Box {
    constructor(scene, width, height, config) {
        this.width = width
        this.height = height
        this.title
        let pos = {
            centerX: config.startX || gWidth/2,
            centerY: config.startY || gHeight/2,
            bl: 61,
            br: 50,
            bu: 50,
            bd: 57
        }
        
        pos.left = pos.centerX - width/2,
        pos.right = pos.centerX + width/2,
        pos.up = pos.centerY - height/2,
        pos.down = pos.centerY + height/2,

        this.pos = pos
        this.isDialog = config.isDialog
        let template = this.isDialog? "box-dialog" : "box"
        
        this.components = {
            ul: scene.add.tileSprite(pos.left, pos.up, pos.bl, pos.bu, template, "up-left"),
            ur: scene.add.tileSprite(pos.right, pos.up, pos.br, pos.bu, template, "up-right"),
            dl: scene.add.tileSprite(pos.left, pos.down, pos.bl, pos.bd, template, "down-left"),
            dr: scene.add.tileSprite(pos.right, pos.down, pos.br, pos.bd, template, "down-right"),
            su: scene.add.tileSprite(pos.centerX, pos.up, width, pos.bu, template, "up-side"),
            sd: scene.add.tileSprite(pos.centerX, pos.down, width, pos.bd, template, "down-side"),
            sl: scene.add.tileSprite(pos.left, pos.centerY, pos.bl, height, template, "left-side"),
            sr: scene.add.tileSprite(pos.right, pos.centerY, pos.br, height, template, "right-side"),
            c: scene.add.tileSprite(pos.centerX, pos.centerY, width, height, template, "center")
        }

        if (config.title) {
            this.title = scene.add.text(pos.centerX, 
                pos.up - 15, 
                config.title, 
                Utils.getTitleTextFormat(config.titleSize))
            
            this.title.setOrigin(0.5)
            this.title.y += this.title.height/2 
            this.title.imgIzq = scene.add.image(this.title.x - this.title.width/2 - 30, this.title.y, "title-decoration-left")
            this.title.imgDer = scene.add.image(this.title.x + this.title.width/2 + 30, this.title.y, "title-decoration-right")
        }

        if (config.close) {
            this.components.close = new ButtonImage({
                scene: scene,
                x: pos.right + 20,
                y: pos.up - 20,
                image: "button-close",
                scale: 1.3,
                clickFunction: ()=> {
                    scene.scene.stop()
                    scene.scene.resume(scene.parentScene)
                }
            })
        }
        /*this.components.su.setScale(width/100, 1)
        this.components.sd.setScale(width/100, 1)
        this.components.sl.setScale(1, height/100)
        this.components.sr.setScale(1, height/100)
        this.components.c.setScale(width/100, height/100)*/
    }

    destroy() {
        Object.values(this.components).forEach(c => {
            c.destroy()
        })
        if (this.title) {
            this.title.imgIzq.destroy()
            this.title.imgDer.destroy()
            
            this.title.destroy()
        }
    }
}

// Design
Utils.drawDesignLines = (scene)=> {
    let graphics = scene.add.graphics()
    let lineVertical
    let lineHorizontal
    let lineSubHorizontal
    for (var i = 1; i<=9; i++) {
        lineVertical = new Phaser.Geom.Line(gWidth*i/10, 0, gWidth*i/10, gHeight)
        lineHorizontal = new Phaser.Geom.Line(0, gHeight*i/10, gWidth, gHeight*i/10)
        
        lineSubVertical = new Phaser.Geom.Line(gWidth*(i+0.5)/10, 0, gWidth*(i+0.5)/10, gHeight)
        
        graphics.lineStyle(1, 0x00aa00)
        graphics.strokeLineShape(lineVertical)
        graphics.strokeLineShape(lineHorizontal)
        graphics.lineStyle(1, 0x005500)
        graphics.strokeLineShape(lineSubVertical)

        scene.add.text(gWidth*0.08, gHeight*i/10 - 18, "0."+i).setScale(1.3)
        scene.add.text(gWidth*i/10 - 5, 15, "0."+i).setScale(1.3)
    }
}

Utils.removeFromArray = (anArray, obj)=> {
    let i = anArray.indexOf(obj)
    if (i == -1) return anArray
    let a = anArray
    var l=anArray.length;
    if (l)
    {
        while (i<l){
            a[i++] = a[i];
        }--a.length;
    }
    return a
}


function reflectLevel(levelCode, room, variant = 1, mode = "h") {

    let world = levelCode.split("-")[0]
    let lvl = levelCode.split("-")[1]
    let levelData = DATA.levelData[world][Number(lvl)-1].structure[room]

    if (["rooms1", "rooms2", "rooms3"].includes(room)) {
        levelData = levelData[variant-1]
    }

    let reflectedLevel = []
    
    for (let r=0; r<levelData.length; r++) {

        if (mode == "h") {

            let elements = levelData[r].split(",").reverse().join(",")

            reflectedLevel.push('"' + elements + '"')
        }
        else if (mode == "v") {

            reflectedLevel.push(levelData[levelData.length-i-1])
        }
        
    }
    //return reflectedLevel

    let reflectedText = reflectedLevel.join("\n")
    console.log(reflectedText)
}

function countRoomRet(levelCode, roomCode,variant = 1) {
    let returnText = ""
    let world = levelCode.split("-")[0]
    let levelNumber = levelCode.split("-")[1]

    let level = DATA.levelData[world][levelNumber-1]
    let room = level.structure[roomCode]
    if (["rooms1", "rooms2", "rooms3"].includes(roomCode)) {
        room = room[variant-1]
    }

    // enemies:
    returnText += "---------- Enemies ----------\n"
    returnText += "CODE\tCOUNT\tTYPE\n"
    let enemiesCount = {}
    level.enemies.forEach(en => {

        let id = "e0" + en.id
        if (id.length == 4) id = "e" + id.split("e0")[1]

        enemiesCount[id] = 0

        room.forEach(row => {
            enemiesCount[id] += (row.match(new RegExp(id)) || []).length
        })

        returnText += `${id}:\t ${enemiesCount[id]}\t\t${en.type}\n`
    })

    // bonus
    returnText += "\n---------- Bonus ----------\n"
    returnText += "CODE\tCOUNT\tTYPE\n"
    let bonusCount = {}
    level.bonus.forEach(b => {
        let id = "b0" + b.id
        if (id.length == 4) id = "b" + id.split("b0")[1]

        bonusCount[id] = 0

        room.forEach(row => {
            bonusCount[id] += (row.match(new RegExp(id)) || []).length
        })

        returnText += `${id}:\t ${bonusCount[id]}\t\t${b.type}\n`
    })

    // fruits
    returnText += "\n---------- Fruits ----------\n"
    returnText += "CODE\tCOUNT\tTYPE\n"
    let fruitCount = {}
    level.fruits.forEach(fr => {
        let id = "fr" + fr.id

        fruitCount[id] = 0

        room.forEach(row => {
            fruitCount[id] += (row.match(new RegExp(id)) || []).length
        })

        returnText += `${id}:\t ${fruitCount[id]}\t\t${fr.type}\n`
    })

    // Artifacts
    returnText += "\n---------- Artifacts ----------\n"
    returnText += "CODE\tCOUNT\tTYPE\tSIDE\n"
    let artCount = {}
    level.artifacts.forEach(ar => {
        let id = "ar" + ar.id

        artCount[id] = 0

        room.forEach(row => {
            artCount[id] += (row.match(new RegExp(id)) || []).length
        })

        returnText += `${id}:\t ${artCount[id]}\t\t${ar.type}\t${ar.side}\n`
    })

    // Allies
    returnText += "\n---------- Allies ----------\n"
    returnText += "CODE\tCOUNT\tTYPE\n"
    let allyCount = {}
    level.allies.forEach(al => {
        let id = "al" + al.id

        allyCount[id] = 0

        room.forEach(row => {
            allyCount[id] += (row.match(new RegExp(id)) || []).length
        })

        returnText += `${id}:\t ${allyCount[id]}\t\t${al.type}\n`
    })

    return returnText
}

function countRoom(levelCode, roomCode, variant=1) {
    console.log(countRoomRet(levelCode, roomCode,variant))
}