class DATA {

}
DATA.isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

/* --------------- APP ONFIG ------------------
AnimationTime: tiempo de animacion de la UI, en milisegundos
*/
DATA.animationTime = 300
DATA.scale = 0.8
DATA.debug = false
DATA.debugMode = false
// --------------- GAME CONFIG ----------------
DATA.characterNames = [
    "finn",
    "jake",

    "steven",

    "blossom",
    "bubbles",
    "buttercup",

    "grizzly",
    "panda",
    "polar",

    "gumball",
    "darwin"
]

DATA.cartoonNames = [
    "at",//, // Adventure Time
    "wbb", // We Bare Bears
    "su", // Steven Universe
    "gmb", // The Amazing World of Gumball
    "ppg" // The PowerPuff Girls
]

DATA.charactersByWorld = {
    "at": ["finn", "jake"],
    "wbb": ["grizzly", "panda", "polar"],
    "su": ["steven"],
    "gmb": ["gumball", "darwin"],
    "ppg": ["blossom", "bubbles", "buttercup"]
}

DATA.alliesByWorld = {
    "at": [
        ["bmo", "4"],
        ["bubblegum", "5"], 
        ["cinnamon", "3"], 
        ["earl", "3"], 
        ["horse", "3"], 
        ["lumpy", "3"],
        ["marceline", "3"],
        ["penguin", "3"],
		["pepermint", "4"],
        ["rainbow", "3"]

    ],
    "wbb": [
        ["choe", "2"],
        ["dana", "2"],
        ["yuri", "2"],
        ["charlie", "2"]
    ],
    "su": [
        ["amethyst",  "3"],
        ["connie", "3"],
        ["garnet",  "3"],
        ["greg", "3"],
        ["pearl", "2"]
    ],
    "gmb": [
        ["larry",  "2"],
        ["joe", "2"],
        ["richard", "2"],
        ["carrie", "3"],
        ["sarah", "2"],
        ["granny", "2"]
    ],
    "ppg": [
        ["alcalde", "2"],
        ["donny", "3"],
        ["keane", "3"],
        ["perro", "2"],
		["utonio", "3"]

    ]
}

DATA.omnitrix = {
    "gameLifeCodes": [
        "55a9f4f8994b1bbf2058ea38c8efb6c459000814d5f39c087002571639e6230e", 
        "688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6", 
        "69aef2b97ba47122bfe11d81abb58c91068d331226623b96712e3fa42041539f",
        "14c82eee196cc2cff110099742e04391541288ea6eab0b9551cc2aa0964102fe",
        "0cbfd0bf55a65712b304893755cb56b18f3d923252aedd514e9db8c0d0bafe67",
        "6cc3cbb4f435edac8955de7e11d6a5e5b735cc136b8b511fd9d10bf89b8c3ada",
        "5e7850699e4503280b55ddeb760f39eafa040ddf9685377ebac64b5276efe075",
        "aebe506971bf75867b6ea1c3d33c15b726710a1f4ded94555a24d8b4905e1a5c",
        "87f5e0e83caef0cbd3aa3676717e2b775d30678eddb2b086110f3e48eac39a69",
        "18beb4813723e788a1d79bcbf80802538ec813aa19ded2e9c21cbf08bed6bee3",
        "feb5d083cc8515263a09599285c872ed9b3c3695e0cebc9652b771bf94654ca0",
        "3dc2055ad0f8c0bb08bfead436d8abcd19475d78389490e47f32d0d47e90e94e",
        "75d9a441f28e4204c51d2ac19d98226da7d7666c41cdb18de955e1b8fa737e6c",
        "990d99cb33e90774e5a7d53a366eda42cb71ce0fcb2689ab10d61436a75a1250",
        "a630a9968c6219adb82ce4ed5a90c923891f79117e94e2db0cebceec3391e1f5",
        "282222b4f2274126ed1c8626d2efca185cd77e6a612673a9be65f0477e939ed7",
        "8ba19f12bd34782dd89535eeb736736b77ba15f97cfff7cc3409c898564d73e8",
        "db2ab9d6231f0e0691d3ce6d608356c2c3996e444b54ebf478f137e6d98dca23",
        "f89b732c864e5d5059d06fc6a87cc43958fd15de2c877997e934ddd2ff1da9f1",
        "59536c60cd8308b50c5e484369689e8149e18d599dbddf519b48b61145ba19ce"
    ],

    "lifeLevels": [{
        "difficulty": 4,
        "time": 30,
        "combos": [3]
    }, {
        "difficulty": 4,
        "time": 20,
        "combos": [3]
    }, {
        "difficulty": 5,
        "time": 30,
        "combos": [3]
    }, {
        "difficulty": 5,
        "time": 30,
        "combos": [6]
    }, {
        "difficulty": 6,
        "time": 45,
        "combos": [6]
    }],

    "gamePointCodes": [
        "f6bf7a7dc61599f844f13dc275f3c1608440ad0e1e8c84b52000452c6501d341",
        "849760fea0863a753ce531afa5196801689dd4300c46fdda2f249dc26f174158",
        "f9f9c0e9673592fe5d7fc93cb5e14507556ca5bdf724e25402300f8223b656f3",
        "9baec789551f0a5d6fdc233ecc521376bcf523fd640164e1a291912ab878a5c8",
        "3c96889c58143d76da157589f41d1d69bc769aa5dbf1c74a1661235709408349"
    ],

    "pointsLevels": [{
        "difficulty": 3,
        "time": 30,
        "champs": [6, 2, 5],
        "combos": [3, 5, 6]
    }, {
        "difficulty": 4,
        "time": 35,
        "champs": [1, 5, 3],
        "combos": [5, 6, 8]
    }, {
        "difficulty": 4,
        "time": 40,
        "champs": [5, 1, 8],
        "combos": [3, 8, 9]
    }, {
        "difficulty": 5,
        "time": 50,
        "champs": [8, 3, 6],
        "combos": [3, 5, 9]
    }, {
        "difficulty": 6,
        "time": 59,
        "champs": [2, 6, 1],
        "combos": [3, 5, 9]
    }
    ]
}
DATA.omnitrixConfig = {
    fieldSize: 12,
    fieldSizeV: 6,
    nChamps: 9,
    tamañoFicha: 101,
    tamañoComboW:613,
    tamañoComboH:320,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    marginLeft : 351,
    marginTop : 68
}

DATA.archievements = {}
DATA.levelProgress = {}
DATA.userData = null

DATA.enemiesByWorld = {
    "at": [
        {
            name: "walking",
            behavior: "walking",
            walk: 4,
            die: 2,
            pow: 3
        },
        {
            name: "flying",
            behavior: "flying",
            stand: 4,
            die: 2,
            pow: 3
        }
    ],
    "wbb": [
	        {
            name: "guardia",
            behavior: "sniper",
            stand: 3,
            die: 2,
            pow: 3
         },
        {
            name: "ralph",
            behavior: "sniper",
            stand: 3,
            die: 2,
            pow: 3
        }
    ],
    "su": [
        {
            name: "rubies",
            behavior: "sniper",
            stand: 3,
            die: 2,
            pow: 3
         },
        {
            name: "corrupted",
            behavior: "sniper",
            stand: 3,
            die: 2,
            pow: 3
        }
    ],
    "gmb": [
		        {
            name: "william",
            behavior: "flying",
            stand: 4,
            die: 2,
            pow: 3
         },
        {
            name: "huella",
            behavior: "sniper",
            stand: 3,
            die: 2,
            pow: 3
        }
    ],
    "ppg": [
        {
            name: "arturo",
            behavior: "sniper",
            stand: 4,
            die: 2,
            pow: 3
         },
        {
            name: "peludito",
            behavior: "sniper",
            stand: 4,
            die: 2,
            pow: 3
        }
    ]
}

// --------------- BUSINESS CONFIG ----------------
DATA.stickerNames = [
    "sticker-1",
	"sticker-2",
	"sticker-3",
	"sticker-4"
]
DATA.filterNames = [
    "filter-1"
]
DATA.accesoryNames = [
    "accesorio-1",
	"accesorio-2",
	"accesorio-3",
	"accesorio-4"
]
DATA.bonusNames = DATA.stickerNames.concat(DATA.filterNames.concat(DATA.accesoryNames))

DATA.artifactNames = [
    "blender",
    "shaker", // sin "c" antes de la "k"
    "joystick",
	"headphones", // termina en "s"
	"xbox", // sin guion
	"tablet",
	"lamp",
	"sound",
    "cam",
    "laptop"
]
DATA.artifactNamesSpanish = {
    "blender" : "LICUADORA",
    "shaker": "COCTELERA",
    "joystick": "JOYSTICK",
	"headphones": "AUDÍFONOS",
	"xbox": "X-BOX",
	"tablet": "TABLET",
	"lamp": "LÁMPARA",
	"sound": "PARLANTE",
    "cam": "CÁMARA",
    "laptop": "LAPTOP"
}

DATA.medalNames = [
    "apple",
    "jojo",
    "mixer"
]

DATA.bossAnims = {
    iceking: {
        die: [2, -1],
        stand: [4, -1],
        pow: [3, 0],
        walk: [4, -1]
    },
    jasper: {
        die: [2, -1],
        stand: [3, -1],
        walk: [5, -1],
        pow: [3, 0]
    },
    nom: {
        die: [2, -1],
        stand: [4, -1],
        pow: [3, 0],
        walk: [4, -1]
    },
    rob: {
        die: [2, -1],
        stand: [4, -1],
        pow: [3, 0],
        walk: [4, -1]
    },
    mojo: {
        die: [2, -1],
        stand: [4, -1],
        pow: [3, 0],
        walk: [4, -1]
    }
}
DATA.alienNames = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8"
]

DATA.fruitNames = [
    "red-apple",
    "green-apple",
    "mango",
    "grape",
    "orange",
    "peach",
    "cherry-banana",
    "guava"
]

DATA.text = {}
DATA.levelData = {}
DATA.game = {}


DATA.helpImages = 6