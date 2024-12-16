var HORIZONTAL = 1;
var VERTICAL= 2;

var playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function playGame()
    {
        Phaser.Scene.call(this, { key: "PlayGame"})
    },
    init( objectPassedAsParameter) {
        this.gameLife = objectPassedAsParameter.isGameLife
        this.levelNumber = objectPassedAsParameter.level
    },
        create(){
            this.hArr = [];
            /*this.maxScorePoss = 0;
            this.scoreMatchesArr = [];
            this.colorMatchesArr = [];
            this.requiremetsCompleted = false;
            this.score = 0;*/
            this.opts = DATA.omnitrixConfig

            this.score = 0;
            this.maxScorePoss = 0;
            this.colorMatchesArr = [];
            this.scoreMatchesArr = [];
            this.combosLeft = [0, 0, 0];
            this.completedMatches = 0;
            this.requiremetsCompleted = false;
            jsonConfig = DATA.omnitrix//this.cache.json.get("json");
            if (this.gameLife){
                this.fondo = this.add.image(gWidth/2,gHeight/2,"fondores2");
                this.levels = jsonConfig.lifeLevels[Math.floor((this.levelNumber / 4) - 0.1)];
                this.initialTime = this.levels.time;
            } else {
                this.fondo = this.add.image(gWidth/2,gHeight/2,"fondores");

                console.log(this.levelNumber)
                console.log(jsonConfig)
                console.log(jsonConfig.pointsLevels)

                this.levels = jsonConfig.pointsLevels[(this.levelNumber / 4) - 1];
                for (let i = 0; i < this.levels.combos.length; i ++){this.maxScorePoss += (this.levels.combos[i] * 50);}
                this.initialTime = this.levels.time;
            }
            this.combo3 = this.add.image(960, 370, "combo3").setDepth(101).setAlpha(0);
            this.combo4 = this.add.image(960, 370, "combo4").setDepth(102).setAlpha(0);
            this.combogenial = this.add.image(960, 370, "combogenial").setDepth(103).setAlpha(0);
    
            let configGot = this.cache.json.get("gothamotf_json");
            this.cache.bitmapFont.add("gothamotf", Phaser.GameObjects.RetroFont.Parse(this, configGot));
            let configAvi = this.cache.json.get("avir_json");
            this.cache.bitmapFont.add("avir", Phaser.GameObjects.RetroFont.Parse(this, configAvi));
            
            this.graphics = this.add.graphics();
            
            scoreBoard = this.make.bitmapText({
                x: 215,
                y: 192,
                text: this.score,
                font: 'gothamotf',
                size: "25",
                origin: {x: 0.5, y:0.5}
            });

            let champsPool = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            let champs = [];
            if (this.gameLife) {
                // random right now
                this.levels.champs = [1, 2, 3]
            }
            champs = this.levels.champs;
            this.champsToCombo = [];
            this.champsToRandomize = [];

            for (let i = 0; i < 3; i++){
                this.champsToCombo.push(champs[i]);
                this.champsToRandomize.push(champs[i]);
                champsPool[champs[i]] = null;
            }

            do {
                let randomPos = Phaser.Math.Between(0, champsPool.length);
                if (champsPool[randomPos] != null){
                    this.champsToRandomize.push(champsPool[randomPos]);
                    champsPool[randomPos] = null;
                }
            }
            while(this.champsToRandomize.length < this.levels.difficulty);
            this.hArr = this.champsToCombo;

            textTime = this.make.bitmapText({
                text: this.initialTime,
                font: 'gothamotf',
                size: "35"
            });
            if (this.gameLife){
                textTime.x = 87
                scoreBoard.x = -50;
                this.champsToRandomize[this.champsToRandomize.length - 1] = 9;
                this.champsToCombo = [];
                this.champsToCombo.push(9);
            }
            
            this.comboRequirement = this.combosRequiredImgs(215, 300, this.champsToCombo, this.levels.combos, 101, false);
            
            this.audioMelody = this.sound.add("melody", {loop: false});
            this.audioCombo = this.sound.add("combo", {loop: false});
            this.audioSwap = this.sound.add("swapChamp", {loop: false});
            this.audioNoTimeLeft = this.sound.add("noTimeLeft", {loop: false});
            this.audioWinGame = this.sound.add("youWin", {loop: false});
            this.audioLosePoints = this.sound.add("youLosePoints", {loop: false});
            this.audioLoseLife = this.sound.add("youLoseLife", {loop: false});
    
            this.canPick = true;
            this.dragging = false;
           

            this.drawField();
            this.selectedChamp = null;
            this.input.on("pointerdown", this.champSelect, this);
            this.input.on("pointermove", this.startSwipe, this);
            this.input.on("pointerup", this.stopSwipe, this);
            
            
            var containerTimer = this.add.container(47, 167);
            containerTimer.add([textTime]);

            this.showObjectives(this.champsToCombo, this.levels.combos);


        },
        formatTime(seconds){
    
            var partInSeconds = seconds%60;
            
            partInSeconds = partInSeconds.toString().padStart(2,'0');
            
            return partInSeconds;
        },
        
        onEvent(){
            this.initialTime -= 1; // One second
            textTime.setText(this.formatTime(this.initialTime));
            if(this.formatTime(this.initialTime) == 0){
                textTime.setText("0");
                this.initialTime += 1;
                //this.scene.start("logrosGame");
                //this.scene.stop();
                this.audioNoTimeLeft.play();
                this.finishGame();
            }
        },

        finishGame(){
            //This will run once the objectives are completed or the time reaches 0
            this.canPick = false;
            timedEvent.paused = true;
            this.graphics.setAlpha(0.5);
            this.graphics.depth = 1999;
            let containerChampsObj = this.add.container(0, 0);





            if (this.gameLife){
                if (this.requiremetsCompleted){
                    //This will run if the objectives were complete on the this.gameLifes
                    this.fondo = this.add.image(0, 0, "logrosH");
                    this.audioWinGame.play();
                } else {
                    //This will run if the objectives weren't complete on the this.gameLifes
                    this.fondo = this.add.image(0, 0, "logrosHN");
                    this.audioLoseLife.play();
                }
                this.score = "";
            } 
            
            
            else {
                containerChampsObj = this.showEndObjetives(0, -25, this.hArr, this.levels.combos);
                containerChampsObj.depth = 2001;
                if (this.requiremetsCompleted){
                    //This will run if the objectives were complete on the gamePoints
                    this.fondo = this.add.image(0, 0, "logros");
                    this.audioWinGame.play();
                } else {
                    //This will run if the objectives weren't complete on the game Points
                    this.fondo = this.add.image(0, 0, "logrosN");
                    this.audioLosePoints.play();
                }
                //Info about the game just played
                console.log("Array de Randoms: " + this.hArr); 
                //this.hArr is the random characters used on the game
                
                console.log("Maximo this.score posible: " + this.maxScorePoss); //this.maxScorePoss is the maximum this.score possible to get if the player did all combos of 5 (which should be impossible)
                //This for shows in console the characters who combo (only if they are in the objectives) and the this.score won for that combo
                for (let i = 0; i < this.colorMatchesArr.length; i++){
                    //this.colorMatchesArr is the array with the characters who did combo
                    //this.scoreMatchesArr is the array with the this.score won for those combos
                    console.log("Match color " + this.colorMatchesArr[i] + " sumó " + this.scoreMatchesArr[i] + " al this.score");
                }
                //The variable this.score has the final this.score of the game
                console.log("Total this.score: " + this.score);
            }


            
            var textFinalScore;
            textFinalScore = this.make.bitmapText({
                x: 0,
                y: 150,
                text: this.score,
                font: 'avir',
                size: "50",
                origin: {x: 0.5, y:0.5}
            });
        
            var nextLevelButton = this.add.image(0, 240, "seguir");
            nextLevelButton.setInteractive();
            nextLevelButton.on('pointerdown', () => {
                //This will run once the button "Seguir jugando" is pressed, it disables the button, pauses the background music and here it should load the base game
                nextLevelButton.disableInteractive();
                this.audioMelody.pause();
                this.scene.start("preloadGame");
                this.scene.stop();

                if (this.gameLife) {
                    game.scene.getScene("GameScene")
                    .continuePlaying(this.requiremetsCompleted, this.score)
                }
                else {
                    game.scene.getScene("GameScene")
                    .omnitrixSetScore(this.colorMatchesArr, this.scoreMatchesArr)
                }
            });

            //Animations of the button
            nextLevelButton.on('pointerover', () => {
                this.tweens.add({
                    targets: nextLevelButton,
                    scale: {from:0.75, to: 1.25},
                    ease: "Back",
                    duration: 250
                });
            });
            nextLevelButton.on('pointerout', () => {
                this.tweens.add({
                    targets: nextLevelButton,
                    scale: {from:1.25, to: 1},
                    ease: "Back",
                    duration: 250
                });
            });

            //Animations of the "Logros" with the final this.score and objectives
            this.container = this.add.container(gWidth/2, gHeight/2);
            this.container.depth = 2000;
            this.container.add([this.fondo, textFinalScore, nextLevelButton, containerChampsObj]);
            this.tweens.add({
                targets: this.container,
                scale: { from: 0, to: 1},
                alpha: { from: 0.5, to: 1},
                ease: 'Bounce',      
                duration: 1000
            });
        },
        
        drawField(){       
            
            this.gameArray = [];
            this.poolArray = [];
            this.champGroup = this.add.group();
            for(let i = 0; i < this.opts.fieldSizeV; i ++){
                this.gameArray[i] = [];
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    let champ = this.add.sprite(this.opts.tamañoFicha * j + this.opts.tamañoFicha / 2, this.opts.tamañoFicha * i + this.opts.tamañoFicha / 2, "champs");
                    this.champGroup.add(champ);
                    var container = this.add.container(this.opts.marginLeft, this.opts.marginTop);
                    container.add([champ]);
                    do{
                        //It gets a random position between 0 and the length of the champsToRandomize (the champs that will spawn on the field)
                        let randomPosition = Phaser.Math.Between(0, this.champsToRandomize.length - 1);
                        //Uses that random position to choose one of the champs to spawn
                        let randomColor = this.champsToRandomize[randomPosition];
                        champ.setFrame(randomColor);
                        this.gameArray[i][j] = {
                            champColor: randomColor,
                            champSprite: champ,
                            isEmpty: false
                        }
                    } while(this.isMatch(i, j));
                }
            }
        },
        isMatch(row, col){
             return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
        },
        isHorizontalMatch(row, col){
             return this.champAt(row, col).champColor == this.champAt(row, col - 1).champColor && this.champAt(row, col).champColor == this.champAt(row, col - 2).champColor;
        },
        isVerticalMatch(row, col){
             return this.champAt(row, col).champColor == this.champAt(row - 1, col).champColor && this.champAt(row, col).champColor == this.champAt(row - 2, col).champColor;
        },
        champAt(row, col){
            if(row < 0 || row >= this.opts.fieldSizeV || col < 0 || col >= this.opts.fieldSize){
                return -1;
            }
            return this.gameArray[row][col];
        },
        champSelect(pointer){
            if(this.canPick && !this.requiremetsCompleted){
                this.dragging = true;
                let row = Math.floor(pointer.y / this.opts.tamañoFicha-this.opts.marginTop/this.opts.tamañoFicha);
                let col = Math.floor(pointer.x / this.opts.tamañoFicha-this.opts.marginLeft/this.opts.tamañoFicha);
                let pickedChamp = this.champAt(row, col)
                if(pickedChamp != -1){
                    if(this.selectedChamp == null){
                        pickedChamp.champSprite.setScale(1.2);
                        pickedChamp.champSprite.setDepth(1);
                        this.selectedChamp = pickedChamp;
                    }
                    else{
                        if(this.areTheSame(pickedChamp, this.selectedChamp)){
                            this.selectedChamp.champSprite.setScale(1);
                            this.selectedChamp = null;
                        }
                        else{
                            if(this.areNext(pickedChamp, this.selectedChamp)){
                                this.selectedChamp.champSprite.setScale(1);
                                this.swapChamps(this.selectedChamp, pickedChamp, true);
                            }
                            else{
                                this.selectedChamp.champSprite.setScale(1);
                                pickedChamp.champSprite.setScale(1.2);
                                this.selectedChamp = pickedChamp;
                            }
                        }
                    }
                }
            }
        },
        startSwipe(pointer){
            if(this.dragging && this.selectedChamp != null){
                let deltaX = pointer.downX - pointer.x;
                let deltaY = pointer.downY - pointer.y;
                let deltaRow = 0;
                let deltaCol = 0;
                if(deltaX > this.opts.tamañoFicha / 2 && Math.abs(deltaY) < this.opts.tamañoFicha / 4){
                    deltaCol = -1;
                }
                if(deltaX < -this.opts.tamañoFicha/ 2 && Math.abs(deltaY) < this.opts.tamañoFicha / 4){
                    deltaCol = 1;
                }
                if(deltaY > this.opts.tamañoFicha / 2 && Math.abs(deltaX) < this.opts.tamañoFicha / 4){
                    deltaRow = -1;
                }
                if(deltaY < -this.opts.tamañoFicha / 2 && Math.abs(deltaX) < this.opts.tamañoFicha / 4){
                    deltaRow = 1;
                }
                if(deltaRow + deltaCol != 0){
                    let pickedChamp = this.champAt(this.getChampRow(this.selectedChamp) + deltaRow, this.getChampCol(this.selectedChamp) + deltaCol);
                    if(pickedChamp != -1){
                        this.selectedChamp.champSprite.setScale(1);
                        this.swapChamps(this.selectedChamp, pickedChamp, true);
                        
                    }
                }
            }
        },
        stopSwipe(){
            this.dragging = false;
        },
        areTheSame(champ1, champ2){
            return this.getChampRow(champ1) == this.getChampRow(champ2) && this.getChampCol(champ1) == this.getChampCol(champ2);
        },
        getChampRow(champ){
            return Math.floor(champ.champSprite.y / this.opts.tamañoFicha);
        },
        getChampCol(champ){
            return Math.floor(champ.champSprite.x / this.opts.tamañoFicha);
        },
        areNext(champ1, champ2){
            return Math.abs(this.getChampRow(champ1) - this.getChampRow(champ2)) + Math.abs(this.getChampCol(champ1) - this.getChampCol(champ2)) == 1;
        },
        swapChamps(champ1, champ2, swapBack){
            this.swappingChamps = 2;
            this.canPick = false;
            this.dragging = false;
            let fromColor = champ1.champColor;
            let fromSprite = champ1.champSprite;
            let toColor = champ2.champColor;
            let toSprite = champ2.champSprite;
            let champ1Row = this.getChampRow(champ1);
            let champ1Col = this.getChampCol(champ1);
            let champ2Row = this.getChampRow(champ2);
            let champ2Col = this.getChampCol(champ2);
            this.gameArray[champ1Row][champ1Col].champColor = toColor;
            this.gameArray[champ1Row][champ1Col].champSprite = toSprite;
            this.gameArray[champ2Row][champ2Col].champColor = fromColor;
            this.gameArray[champ2Row][champ2Col].champSprite = fromSprite;
            this.tweenChamp(champ1, champ2, swapBack);
            this.tweenChamp(champ2, champ1, swapBack);
            this.audioSwap.play();
    
        },
        tweenChamp(champ1, champ2, swapBack){
            let row = this.getChampRow(champ1);
            let col = this.getChampCol(champ1);
            this.tweens.add({
                targets: this.gameArray[row][col].champSprite,
                x: col * this.opts.tamañoFicha + this.opts.tamañoFicha / 2,
                y: row * this.opts.tamañoFicha + this.opts.tamañoFicha / 2,
                duration: this.opts.swapSpeed,
                callbackScope: this,
                onComplete: function(){
                    this.swappingChamps --;
                    if(this.swappingChamps == 0){
                        if(!this.matchInBoard() && swapBack){
                            this.swapChamps(champ1, champ2, false);
                        }
                        else{
                            if(this.matchInBoard()){
                                this.handleMatches();
                            }
                            else{
                                this.canPick = true;
                                this.selectedChamp = null;
                            }
                        }
                    }
                }
            });
        },
        
        
        matchInBoard(){
            for(let i = 0; i < this.opts.fieldSizeV; i ++){
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    if(this.isMatch(i, j)){
                        return true;
                    }
                }
            }
            return false;
        },
        handleMatches(){
            this.removeMap = [];
            for(let i = 0; i < this.opts.fieldSize; i ++){
                this.removeMap[i] = [];
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    this.removeMap[i].push(0);
                }
            }
            if (!this.requiremetsCompleted){
                this.markMatches(HORIZONTAL);
                this.markMatches(VERTICAL);
            }
            this.destroyChamps();
        },
        markMatches(direction){
            var timeline = this.tweens.createTimeline() ;
            timeline.add({
            targets: this.combo3,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',      
            duration: 250,
            repeat: 0,
            yoyo: true           
            
            })
            var timeline2 = this.tweens.createTimeline() ;
            timeline2.add({
            targets: this.combo4,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',      
            duration: 250,
            repeat: 0,
            yoyo: true           
            
            })
            var timeline3 = this.tweens.createTimeline() ;
            timeline3.add({
            targets: this.combogenial,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',      
            duration: 250,
            repeat: 0,
            yoyo: true           
            
            })
            for(let i = 0; i < this.opts.fieldSize; i ++){
                let colorStreak = 1;
                let currentColor = -1;
                let startStreak = 0;
                let colorToWatch = 0;
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    if(direction == HORIZONTAL){
                        colorToWatch = this.champAt(i, j).champColor;
                    }
                    else{
                        colorToWatch = this.champAt(j, i).champColor;
                    }
                    if(colorToWatch == currentColor){
                        colorStreak ++;
                    }
                    if(colorToWatch != currentColor || j == this.opts.fieldSize - 1){
                        if(colorStreak >= 3){
                            if(direction == HORIZONTAL){
                                
                                if(colorStreak==3){
                                   
                                    this.combosRequiredNumbs(currentColor, 30);
                                    
                                    timeline.play();
    
                                }else if(colorStreak==4){
                                    
                                    this.combosRequiredNumbs(currentColor, 40);
                                    
                                    timeline2.play();
                                        
                                }else if(colorStreak<=5){
        
                                    this.combosRequiredNumbs(currentColor, 50);
                                    
                                    timeline3.play();
                                }   
                                this.audioCombo.play();
                            }
                            else if (direction == VERTICAL) {
                                if(colorStreak==3){
                                    
                                    this.combosRequiredNumbs(currentColor, 30);
                                   
                                    timeline.play();
    
                                }else if(colorStreak==4){
                                  
                                    this.combosRequiredNumbs(currentColor, 40);
                                    
                                    timeline2.play();
    
                                }else if(colorStreak<=5){
                                  
                                    this.combosRequiredNumbs(currentColor, 50);
                                    
                                    timeline3.play();
                                }   
                                this.audioCombo.play();
                            }
                            for(let k = 0; k < colorStreak; k ++){
                                if(direction == HORIZONTAL){
                                    this.removeMap[i][startStreak + k] ++;
                                    
                                }
                                else if (direction == VERTICAL){
                                    this.removeMap[startStreak + k][i] ++;
                                    
                                }
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = colorToWatch;
                    }
                }
            }
        },
        destroyChamps(){
            let destroyed = 0;
            for(let i = 0; i < this.opts.fieldSizeV; i ++){
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    if(this.removeMap[i][j] > 0){
                        destroyed ++;
                        this.tweens.add({
                            targets: this.gameArray[i][j].champSprite,
                            scale: {from: 1.5, to: 0},
                            alpha: 0.5,
                            duration: this.opts.destroySpeed,
                            callbackScope: this,
                            onComplete: function(){
                                destroyed --;
                                this.gameArray[i][j].champSprite.visible = false;
                                this.poolArray.push(this.gameArray[i][j].champSprite);
                                if(destroyed == 0){
                                    this.makeChampsFall();
                                    this.replenishField();
                                }
                            }
                        });
                        this.gameArray[i][j].isEmpty = true;
                    }
                }
            }
        },
        makeChampsFall(){
            for(let i = this.opts.fieldSizeV - 2; i >= 0; i --){
                for(let j = 0; j < this.opts.fieldSize; j ++){
                    if(!this.gameArray[i][j].isEmpty){
                        let fallTiles = this.holesBelow(i, j);
                        if(fallTiles > 0){
                            this.tweens.add({
                                targets: this.gameArray[i][j].champSprite,
                                y: this.gameArray[i][j].champSprite.y + fallTiles * this.opts.tamañoFicha,
                                duration: this.opts.fallSpeed * fallTiles
                            });
                            this.gameArray[i + fallTiles][j] = {
                                champSprite: this.gameArray[i][j].champSprite,
                                champColor: this.gameArray[i][j].champColor,
                                isEmpty: false
                            }
                            this.gameArray[i][j].isEmpty = true;
                        }
                    }
                }
            }
        },
        holesBelow(row, col){
            let result = 0;
            for(let i = row + 1; i < this.opts.fieldSizeV; i ++){
                if(this.gameArray[i][col].isEmpty){
                    result ++;
                }
            }
            return result;
        },
        replenishField(){
            let replenished = 0;
            for(let j = 0; j < this.opts.fieldSize; j ++){
                let emptySpots = this.holesInCol(j);
                if(emptySpots > 0){
                    for(let i = 0; i < emptySpots; i ++){
                        replenished ++;
                        //It gets a random position between 0 and the length of the champsToRandomize (the champs that will spawn on the field)
                        let randomPosition = Phaser.Math.Between(0, this.champsToRandomize.length - 1);
                        //Uses that random position to choose one of the champs to spawn
                        let randomColor = this.champsToRandomize[randomPosition];
                        this.gameArray[i][j].champColor = randomColor;
                        this.gameArray[i][j].champSprite = this.poolArray.pop()
                        this.gameArray[i][j].champSprite.setFrame(randomColor);
                        this.gameArray[i][j].champSprite.visible = true;
                        this.gameArray[i][j].champSprite.x = this.opts.tamañoFicha * j + this.opts.tamañoFicha / 2;
                        this.gameArray[i][j].champSprite.y = this.opts.tamañoFicha / 2 - (emptySpots - i) * this.opts.tamañoFicha;
                        this.gameArray[i][j].champSprite.alpha = 1;
                        this.gameArray[i][j].champSprite.scale = 1;
                        this.gameArray[i][j].isEmpty = false;
                        this.tweens.add({
                            targets: this.gameArray[i][j].champSprite,
                            y: this.opts.tamañoFicha * i + this.opts.tamañoFicha / 2,
                            duration: this.opts.fallSpeed * emptySpots,
                            callbackScope: this,
                            onComplete: function(){
                                replenished --;
                                if(replenished == 0){
                                    if(this.matchInBoard()){
                                        this.time.addEvent({
                                            delay: 250,
                                            callback: this.handleMatches()
                                        });
                                    }
                                    else{
                                        this.canPick = true;
                                        this.selectedChamp = null;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        },
        holesInCol(col){
            var result = 0;
            for(let i = 0; i < this.opts.fieldSizeV; i ++){
                if(this.gameArray[i][col].isEmpty){
                    result ++;
                }
            }
            return result;
        },

        combosRequiredImgs(gridStartX, gridStartY, champsArr, comboArr, xGap, bigScale){
            let containerCombos = this.add.container(gridStartX, gridStartY);
            //Stores the position, champColor, number of combos left and if it's completed on an Array
            this.combosArray = [];
            //Arranges the champs and the numbers on the positions
            for (let i = 0; i < champsArr.length / 3; i++){
                switch(champsArr.length - 3 * i){
                    /*case 2:
                        for (let j = 0; j < 2; j++){
                            this.combosArray[(i * 3) + j] = {
                                xPos: 51 + gridStartX + 101 * j,
                                yPos: gridStartY + 100 * i,
                                champColor: champsArr[(i * 3) + j],
                                comboAmount: comboArr[(i * 3) + j],
                                completed: false
                            }
                        }
                        break;*/

                    case 1:
                        this.combosArray[i * 3] = {
                            xPos: xGap - 150,
                            yPos: 100 * i,
                            champColor: champsArr[i * 3],
                            comboAmount: comboArr[i * 3],
                            completed: false
                        }
                        break;

                    default:
                        for (let j = 0; j < 3; j++){
                            this.combosArray[(i * 3) + j] = {
                                xPos: xGap * j - 150,
                                yPos: 100 * i,
                                champColor: champsArr[(i * 3) + j],
                                comboAmount: comboArr[(i * 3) + j],
                                completed: false
                            }
                        }
                        break;
                }
            }
            for (let i = 0; i < this.combosArray.length; i++){
                let ArrPos = this.combosArray[i];
                //let xPos = ArrPos.xPos + gridStartX + 40;
                //let yPos = ArrPos.yPos + gridStartY + 50;
                //let champ = this.add.sprite(ArrPos.xPos, ArrPos.yPos, "champs");
                //this.combosArray[i].text = this.add.text(xPos, yPos, this.combosArray[i].comboAmount, {fontSize: '30px', fill: '#000'});
                //this.combosArray[i].text.setOrigin(0.5, 0.5);
                //champ.setFrame(ArrPos.champColor);
                containerCombos.add([this.add.sprite(ArrPos.xPos, ArrPos.yPos, "champs").setFrame(ArrPos.champColor)]);
                containerCombos.list[i + (1 * i)].name = ArrPos.champColor;
                if (bigScale){containerCombos.list[i + (1 * i)].setScale(1.25, 1.25);}
                //containerCombos.add([this.add.text(ArrPos.xPos + 40, ArrPos.yPos + 60, ArrPos[i].comboAmount, {fontSize: '30px', fill: '#000'}).setOrigin(0.5, 0.5)]);
                containerCombos.add([this.make.bitmapText({x: ArrPos.xPos + 10, y: ArrPos.yPos + 10,text: this.combosArray[i].comboAmount, font: 'avir', size: "40"})]);
            }
            for (let i = 0; i < this.combosArray.length; i++){
                let ArrPos = this.combosArray[i];
                containerCombos.add([this.add.sprite(ArrPos.xPos + 2, ArrPos.yPos + 33, "ex")]);
                containerCombos.list[containerCombos.length - 1].setScale(0.4, 0.4);
            }
            return containerCombos;
        },

        combosRequiredNumbs(champColor, scoreWon){
            //This function is called every time a combo of 3, 4 5 or more is done
            //This checks the amount of combos left to complete, adds this.score if you do a combo and stops checking once it got to 0, so it stops adding this.score too
            for (let i = 0; i < this.comboRequirement.list.length / 2; i++){
                if (champColor === this.comboRequirement.list[i + (1 * i)].name && !this.combosArray[i].completed){
                    this.colorMatchesArr.push(champColor);
                    this.scoreMatchesArr.push(scoreWon);
                    this.combosArray[i].comboAmount -= 1;
                    this.combosLeft[i] += 1;
                    if (this.combosArray[i].comboAmount === 0){
                        this.combosArray[i].completed = true;
                        this.completedMatches++;
                        if (this.completedMatches === this.combosArray.length){
                            this.requiremetsCompleted = true;
                        }
                    }
                    //Changes the text of the combos left everytime a champ is deleted
                    this.score += scoreWon;
                    scoreBoard.setText(this.score.toString());
                    this.comboRequirement.list[i + 1 +(1 * i)].setText(this.combosArray[i].comboAmount.toString());
                    if (this.requiremetsCompleted){
                        this.finishGame();
                    }
                }
            }
        },

        showObjectives(champs, combos){
            this.canPick = false;
            this.graphics.fillStyle(0x000000, 1);
            this.graphics.fillRect(0, 0, gWidth, gHeight);
            if (this.gameLife){
                this.fondo = this.add.image(gWidth/2, gHeight/2 - 50, "objHeart");
                var combosContainer = this.combosRequiredImgs(gWidth/2, 410, champs, combos, 150, true);
            } else {
                this.fondo = this.add.image(gWidth/2, gHeight/2 - 50, "objChamps");
                var combosContainer = this.combosRequiredImgs(gWidth/2, 410, champs, combos, 150, true);
            }
            var okButton = this.add.image(gWidth/2, 553, "okButton");
            okButton.alpha = 0;
            combosContainer.alpha = 0;
            this.fondo.alpha = 0;

            this.graphics.depth = 1;
            this.fondo.depth = 2;
            okButton.depth = 3;
            combosContainer.depth = 4;

            let animasTimeLine = this.tweens.createTimeline();

            animasTimeLine.add({
                targets: this.graphics,
                alpha: 0.5,
                duration: 250
            });

            animasTimeLine.add({
                targets: this.fondo,
                alpha: {from: 0, to: 1},
                scale: {from: 0.5, to: 1},
                duration: 300,
                ease: 'Bounce'
            });

            animasTimeLine.add({
                targets: combosContainer,
                alpha: {from: 0, to: 1},
                scale: {from: 0.5, to: 1},
                duration: 300,
                ease: 'Bounce'
            });

            animasTimeLine.add({
                targets: okButton,
                alpha: {from: 0, to: 1},
                scale: {from: 0.5, to: 1},
                duration: 300,
                ease: 'Bounce',
                onComplete: function(){
                    okButton.setInteractive();
                }
            });
            
            okButton.on('pointerover', () => {
                this.tweens.add({
                    targets: okButton,
                    scale: {from:0.75, to: 1.25},
                    ease: "Back",
                    duration: 250
                });
            });
            okButton.on('pointerout', () => {
                this.tweens.add({
                    targets: okButton,
                    scale: {from:1.25, to: 1},
                    ease: "Back",
                    duration: 250
                });
            });
            okButton.on('pointerdown', () => {
                okButton.disableInteractive();
                this.tweens.add({
                    targets: [this.graphics, this.fondo, combosContainer, okButton],
                    alpha: 0,
                    duration: 500,
                    callbackScope: this,
                    callbackScope: this,
                    onComplete: function(){
                        okButton.destroy();
                        combosContainer.destroy();
                        this.fondo.destroy();
                        this.canPick = true;
                        //game.audioIntro.pause();
                        this.audioMelody.play();
                        timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
                    }
                });
            });

            animasTimeLine.play();
        },

        showEndObjetives(xPos, yPos, champs, combos){
            var container = this.add.container(xPos, yPos);
            container.add([this.add.sprite(-200, 0, "champsObj").setFrame(champs[0])]);
            container.add([this.add.sprite(0, 0, "champsObj").setFrame(champs[1])]);
            container.add([this.add.sprite(200, 0, "champsObj").setFrame(champs[2])]);
            container.add([this.add.sprite(-165, 50, "slash").setScale(0.4, 0.4)]);
            container.add([this.make.bitmapText({x: -160, y: 35,text: combos[0], font: 'avir', size: "30"})]);
            container.add([this.make.bitmapText({x: -200, y: 35,text: this.combosLeft[0], font: 'avir', size: "30"})]);
            container.add([this.add.sprite(35, 50, "slash").setScale(0.4, 0.4)]);
            container.add([this.make.bitmapText({x: 40, y: 35,text: combos[1], font: 'avir', size: "30"})]);
            container.add([this.make.bitmapText({x: 0, y: 35,text: this.combosLeft[1], font: 'avir', size: "30"})]);
            container.add([this.add.sprite(235, 50, "slash").setScale(0.4, 0.4)]);
            container.add([this.make.bitmapText({x: 240, y: 35,text: combos[2], font: 'avir', size: "30"})]);
            container.add([this.make.bitmapText({x: 200, y: 35,text: this.combosLeft[2], font: 'avir', size: "30"})]);

            return container;
        }
    
})
