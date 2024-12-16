window.onload = ()=>{
    try{
        CNData.test = true;
        CNTrack.setup("promo:aj_2020")
    } catch(err){
        console.log(err);
    }
    validatePortrait();
}
window.onresize = ()=>{
    validatePortrait();
}
function validatePortrait()
{
    if (window.innerWidth < window.innerHeight && DATA.isMobile)  // if portrait
    {
        divgirar.style.display = 'inline-block';
        if (document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].classList)
        {
            document.getElementsByTagName("canvas")[0].classList.add('canvashide'); // hide canvas
        }
    } 
    else // if landscape
    {
        divgirar.style.display = 'none';
        if (document.getElementsByTagName("canvas")[0] && document.getElementsByTagName("canvas")[0].classList)
        {
            document.getElementsByTagName("canvas")[0].classList.remove('canvashide'); // show canvas
        }
    }
}

// --------------------- GAME CONFIG --------------------- 
var gWidth = 1624
var gHeight = 750
var gDV

let gameConfig = {
    type: Phaser.CANVAS,
    scale: {
        parent: 'first-div',
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gWidth,
        height: gHeight
    },
    autoStart: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: DATA.debugMode,
            gravity: {y: 1700}
        }
    },
    render: {
        antialias: true
    }
}

// --------------------- SCENES --------------------- 

let game = new Phaser.Game(gameConfig)
game.scene.add("BootScene", BootScene)
game.scene.add("SplashScene", SplashScene)
game.scene.add("HelpScene", HelpScene)
game.scene.add("UIScene", UIScene)
game.scene.add("GameScene", GameScene)
game.scene.add("OptionsScene", OptionsScene)
game.scene.add("LevelEndScene", LevelEndScene)
game.scene.add("LevelSelectionScene", LevelSelectionScene)
game.scene.add("CharacterSelectionScene", CharacterSelectionScene)
game.scene.add("RankingScene", RankingScene)
game.scene.add("ArchievementsScene", ArchievementsScene)

// ---- omnitrix
game.scene.add("preloadGame", preloadGame)
game.scene.add("PlayGame", playGame)
game.scene.start("preloadGame")

let gs
game.scene.start("BootScene")

function level(level, variant1, variant2, variant3, characterName="finn") {
    if (!DATA.debugMode) return
    game.scene.start("GameScene", {
        worldName: level.split("-")[0],
        levelNumber: level.split("-")[1],
        character: characterName,
        variants: [variant1-1, variant2-1, variant3-1]
    })
    game.scene.getScene("SplashScene").scene.stop()
}

