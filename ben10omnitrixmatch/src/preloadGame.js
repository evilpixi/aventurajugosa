//var gameLife;
//var level;

var preloadGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function preloadGame()
    {
        Phaser.Scene.call(this, { key: "preloadGame", pack: {
            files:[
                { type: 'image', key: 'fondo', url: 'ben10omnitrixmatch/assets/preload/fondoamarillo.png' },
                { type: 'image', key: 'mnitrix', url: 'ben10omnitrixmatch/assets/preload/mnitrix.png' },
                { type: 'image', key: 'ben', url: 'ben10omnitrixmatch/assets/preload/ben10.png' },
                { type: 'image', key: 'explosion', url: 'ben10omnitrixmatch/assets/preload/explosion.png' },
                { type: 'image', key: 'cannon', url: 'ben10omnitrixmatch/assets/preload/cannonbolt.png' },
                { type: 'image', key: 'bar-bg', url: 'ben10omnitrixmatch/assets/preload/loadingvacio.png' },
                { type: 'image', key: 'loading', url: 'ben10omnitrixmatch/assets/preload/loading.png'},
                { type: 'image', key: '1', url: 'ben10omnitrixmatch/assets/preload/1.png' },
                { type: 'image', key: '2', url: 'ben10omnitrixmatch/assets/preload/2.png' },
                { type: 'image', key: '3', url: 'ben10omnitrixmatch/assets/preload/3.png' },
                { type: 'image', key: '4', url: 'ben10omnitrixmatch/assets/preload/4.png' },
                { type: 'image', key: '5', url: 'ben10omnitrixmatch/assets/preload/5.png' },
                { type: 'image', key: '6', url: 'ben10omnitrixmatch/assets/preload/6.png' },
                { type: 'image', key: '7', url: 'ben10omnitrixmatch/assets/preload/7.png' },
                { type: 'image', key: '8', url: 'ben10omnitrixmatch/assets/preload/8.png' },
                { type: 'image', key: '9', url: 'ben10omnitrixmatch/assets/preload/9.png' },
                { type: 'audio', key: 'intro', url: 'ben10omnitrixmatch/assets/audio/intro.mp3' },
                { type: 'image', key: 'gothamotf', url: 'ben10omnitrixmatch/assets/gothamotf.png' },
                { type: 'json', key: 'gothamotf_json', url: 'ben10omnitrixmatch/assets/gothamotf.json' }
            ]
        }});

    },
   preload: function ()
    {
        this.opts = DATA.omnitrixConfig
        game.scene.sendToBack("preloadGame")
        this.load.image("combo3","ben10omnitrixmatch/assets/combo3.png");
        this.load.image("combo4","ben10omnitrixmatch/assets/combo4.png");
        this.load.image("combogenial","ben10omnitrixmatch/assets/combogenial.png");
        this.load.image("gothamotf","ben10omnitrixmatch/assets/gothamotf.png");
        this.load.json("gothamotf_json","ben10omnitrixmatch/assets/gothamotf.json");
        this.load.image("avir","ben10omnitrixmatch/assets/avir.png");
        this.load.json("avir_json","ben10omnitrixmatch/assets/avir.json");
        this.load.audio("swapChamp", "ben10omnitrixmatch/assets/audio/sfx_1.mp3");
        this.load.audio("combo", "ben10omnitrixmatch/assets/audio/combo.mp3");
        this.load.audio("melody", "ben10omnitrixmatch/assets/audio/melody.mp3");
        this.load.audio("noTimeLeft", "ben10omnitrixmatch/assets/audio/fin_de_partida.mp3");
        this.load.audio("youWin", "ben10omnitrixmatch/assets/audio/ganaste_Omnitrix.mp3");
        this.load.audio("youLosePoints", "ben10omnitrixmatch/assets/audio/perdiste-puntos_Omnitrix.mp3");
        this.load.audio("youLoseLife", "ben10omnitrixmatch/assets/audio/perdiste-vidas_Omnitrix.mp3");
        this.load.image("fondores", "ben10omnitrixmatch/assets/fondores.png");
        this.load.image("fondores2", "ben10omnitrixmatch/assets/fondores2.png");
        this.load.image("objChamps", "ben10omnitrixmatch/assets/objChamps.png");
        this.load.image("objHeart", "ben10omnitrixmatch/assets/objHeart.png");
        this.load.image("okButton", "ben10omnitrixmatch/assets/ok.png");
        this.load.image("seguir", "ben10omnitrixmatch/assets/seguir.png");
        this.load.image("logros","ben10omnitrixmatch/assets/logros.png");
        this.load.image("logrosN","ben10omnitrixmatch/assets/logrosN.png");
        this.load.image("logrosH","ben10omnitrixmatch/assets/logrosH.png");
        this.load.image("logrosHN","ben10omnitrixmatch/assets/logrosHN.png");
        this.load.image("ex","ben10omnitrixmatch/assets/ex.png");
        this.load.image("slash","ben10omnitrixmatch/assets/slash.png");

        
        //game.audioIntro = this.sound.add("intro", {loop: true});
        //game.audioIntro.play();
        
        this.load.spritesheet("champs", "ben10omnitrixmatch/assets/champsres2.png", {
            frameWidth: this.opts.tamañoFicha,
            frameHeight: 96
            
        });
        this.load.spritesheet("champsObj", "ben10omnitrixmatch/assets/champsObj.png", {
            frameWidth: 135,
            frameHeight: 133
            
        });
        this.load.spritesheet("combox3", "ben10omnitrixmatch/assets/combox3.png", {
            frameWidth: this.opts.tamañoComboW,
            frameHeight: this.opts.tamañoComboH
            
        });
        this.load.spritesheet("combox4", "ben10omnitrixmatch/assets/combox4.png", {
            frameWidth: this.opts.tamañoComboW,
            frameHeight: this.opts.tamañoComboH
            
        });
        this.load.spritesheet("genial", "ben10omnitrixmatch/assets/genial.png", {
            frameWidth: this.opts.tamañoComboW,
            frameHeight: this.opts.tamañoComboH
            
        });
        
        this.load.json("json", "ben10omnitrixmatch/src/config.json");


        preloaderfondo = this.add.image(gWidth/2,gHeight/2,"fondo");
        
        explosion = this.add.image(gWidth/2, gHeight/2, "explosion")
        explosion.alpha = 0;
        explosion.scale = 0.25;

        preloaderlogo = this.add.image(gWidth/2,0,"mnitrix")
        preloaderlogo.alpha = 0;
        preloaderlogo.y = -400;   
           

        loadingbar_bg = this.add.image(gWidth/2, 0, "bar-bg");
        loadingbar_bg.alpha = 0;
        loadingbar_bg.y = 240;

        loadingbar = this.add.image(gWidth/2, 0, "loading");
        loadingbar.alpha = 0;
        loadingbar.x = 550;
        loadingbar.y = 240;

        cannon = this.add.image(gWidth/2,gHeight/2,"cannon");
        cannon.alpha = 0;
        cannon.x = 1500; 
            
        ben = this.add.image(345, 0, "ben");
        ben.alpha = 0;
        ben.y = 100;

        i1 = this.add.image(170,450,"1");
        i1.alpha = 0;
        
        i2 = this.add.image(450,50,"2");
        i2.alpha = 0;

        i3 = this.add.image(550,220,"3");
        i3.alpha = 0;

        i4 = this.add.image(525,580,"4");
        i4.alpha = 0;

        i5 = this.add.image(1100,600,"5");
        i5.alpha = 0;

        i6 = this.add.image(1110,300,"6");
        i6.alpha = 0;

        i7 = this.add.image(1120,155,"7");
        i7.alpha = 0;

        i8 = this.add.image(1330,160,"8");
        i8.alpha = 0;

        i9 = this.add.image(1470,430,"9");
        i9.alpha = 0;

        TweenMax.to([i1,i2,i3,i4,i5,i6,i7,i8,i9],0.5,{ delay: 3, alpha:1, ease:Back.easeOut, repeat: -1, yoyo: true})
        TweenMax.to(explosion,2,{delay: 0.5, alpha:1,scale:1, ease:Back.easeOut})
        TweenMax.to(preloaderlogo, 1, {delay: 0.5, alpha:1, y: 300, ease:Back.easeOut});
        TweenMax.to(loadingbar_bg, 0.5, {delay: 1.5, alpha:1, y: 495, ease:Back.easeOut});
        TweenMax.to(loadingbar, 0.5, {delay: 1.5, alpha: 1, y: 500, ease:Back.easeOut});
        TweenMax.to(cannon, .5, {delay:2, alpha:1, x:1325, ease:Bounce.easeOut});
        TweenMax.to(ben, .5, {delay:2.5, alpha: 1, y:420, ease:Bounce.easeOut});
        
        loadingbar.setOrigin(0, 0.5);

        let configGot = this.cache.json.get("gothamotf_json");
        this.cache.bitmapFont.add("gothamotf", Phaser.GameObjects.RetroFont.Parse(this, configGot));

            var percentText = this.make.bitmapText({
                x: gWidth/2,
                y: 300,
                alpha: 0,
                text: "Holis",
                font: "gothamotf",
                size: "20"
            });
            percentText.setOrigin(0.5, 0.5);
            
            this.load.on('progress', function (value) {
                loadingbar.setCrop(0, 0, 531 * value, 33);
                percentText.setText(parseInt(value * 100) + '%');
            });
    

            for (var i = 0; i < 1000; i++) {
                this.load.image('mnitrix'+i, 'ben10omnitrixmatch/assets/preload/mnitrix.png');
            }
            TweenMax.to(percentText, 0.5, {delay: 1.5, alpha:1, y: 497, ease:Back.easeOut})
    },
    create: function() {

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillRect(0, 0, gWidth, gHeight);
        this.tweens.add({
            targets: [this.graphics],
            alpha: {from: 0, to: 1},
            duration: 1000/*,
            callbackScope: this,
            onComplete: function(){
                game.scene.stop();
                game.scene.start('PlayGame');
            }*/
        });
    },

    loadLevel: function(levelNumber, isGameLife){
        /*if (object.bool){
            if (lifeGame){
                var code = game.cache.json.get("json").gameLifeCodes[object.level - 1];
                var isItTheSame = code.localeCompare(object.code);
            } else {
                var code = game.cache.json.get("json").gamePointCodes[(object.level / 4) - 1];
                var isItTheSame = code.localeCompare(object.code);
            }
            if (!isItTheSame){
                level = object.level;
                gameLife = lifeGame;
                game.scene.stop();
                game.scene.start('PlayGame');
            } else {
                console.log("The secure code is not the same. \nSecure code: \n" + code + "\nCode recived: \n" + object.code);
            }
        }*/
        let level = levelNumber;
        let gameLife = isGameLife;
        game.scene.stop();

        let omni = game.scene.start('PlayGame', {
            isGameLife: gameLife, 
            level: level
        });

        game.scene.bringToTop("PlayGame")
    }
});