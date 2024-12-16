let GET_USER_DATA = true
let GET_ALL_LEVELS_PROGRESS = true
let GET_RANKING = true
let GET_ARCHIEVEMENTS = true

let SET_LEVEL_RESULT = true

let INIT_LEVEL = true
let GOGO_ARTI = true



if (GET_USER_DATA) {
    window.parent.getUser = (data) => {
        return { 
            data: {
    
                name: "John Cena",
                imageId: "5",
                score: 314,
                rank: 69
            }
        }
    }
}

if (GET_ALL_LEVELS_PROGRESS) {
    window.parent.getAllLevelsProgress = () => {
        return { 
            data: {
                at: [
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 1},
                    {unlocked: true, stars: 1},
                    {unlocked: true, stars: 0}
                ],
                wbb: [
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 1},
                    {unlocked: true, stars: 0},
                    {unlocked: true, stars: 0}
                ],
                su: [
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 2},
                    {unlocked: true, stars: 0}
                ],
                gmb: [
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 1},
                    {unlocked: true, stars: 0},
                    {unlocked: true, stars: 0}
                ],
                ppg: [
                    {unlocked: true, stars: 3},
                    {unlocked: true, stars: 1},
                    {unlocked: true, stars: 0},
                    {unlocked: true, stars: 0}
                ],
            }
        }
    }
}


if (GET_RANKING) {
    window.parent.getRanking = (users_amount) => {
        let names = ["Luz", "Amity", "Eda", "King", "Willow", "Gus", "Tato", "Gaston", "Gabriel", "Lua", "Lilith", "Steve", "Obama", "Kim jong Un"]
        let users = []
        for (let i = 1; i<=users_amount; i++) {
            users.push({
                name: names[Phaser.Math.Between(0,names.length-1)]
                +Phaser.Math.Between(0,999),
                imageId: "level-selection-avatar-placeholder",
                accesoryId: "",
                score: 15250 - i*76,
                medals: [Phaser.Math.Between(0,1), 
                    Phaser.Math.Between(0,1), 
                    Phaser.Math.Between(0,1)]
            })
        }
        return users
    }
}

if (GET_ARCHIEVEMENTS) {
    window.parent.getArchievements = () => {
        return {
            filters: [
                {
                    name:     "filter-1",
                    amount:   25
                },
            ],
            stickers: [
                {
                    name:     "sticker-1",
                    amount:   25
                },
                {
                    name:     "sticker-2",
                    amount:   20
                },
                {
                    name:     "sticker-3",
                    amount:   20
                },
                {
                    name:     "sticker-4",
                    amount:   25
                },
            ],
            accesories: [
                {
                    name:     "accesorio-1",
                    amount:   20
                },
                {
                    name:     "accesorio-2",
                    amount:   10
                },
                {
                    name:     "accesorio-3",
                    amount:   30
                },
                {
                    name:     "accesorio-4",
                    amount:   25
                },
            ],  
            artifacts: [
                {
                    name: "blender",
                    sides: "left"
                },
                {
                    name: "shaker",
                    sides: "none"
                },
                {
                   name: "joystick",
                   sides: "left"
                },
                {
                    name: "headphones",
                    sides: "right"
                },
                {
                    name: "xbox",
                    sides: "both"
                },
                {
                    name: "tablet",
                    sides: "both"
                },
                {
                    name: "lamp",
                    sides: "none"
                },
                {
                    name: "sound",
                    sides: "left"
                },
                {
                    name: "cam",
                    sides: "right"
                },
                {
                    name: "laptop",
                    sides: "right"
                },
            ],
            omnitrix: {
                at: [
                    {
                        champ: 6,
                        amount: 3
                    },
                    {
                        champ: 2,
                        amount: 5
                    },
                    {
                        champ: 5,
                        amount: 0
                    }
                ],
                wbb: [
                    {
                        champ: 1,
                        amount: 2
                    },
                    {
                        champ: 5,
                        amount: 3
                    },
                    {
                        champ: 3,
                        amount: 0
                    }
                ],
                su: [
                    {
                        champ: 5,
                        amount: 3
                    },
                    {
                        champ: 1,
                        amount: 3
                    },
                    {
                        champ: 8,
                        amount: 0
                    }
                ],
                gmb: [
                    {
                        champ: 8,
                        amount: 2
                    },
                    {
                        champ: 3,
                        amount: 3
                    },
                    {
                        champ: 6,
                        amount: 0
                    }
                ],
                ppg: [
                    {
                        champ: 2,
                        amount: 2
                    },
                    {
                        champ: 1,
                        amount: 3
                    },
                    {
                        champ: 6,
                        amount: 0
                    }
                ],
            },
            fruits: [
                {
                    name: "red-apple",
                    amount: 1000
                },
                {
                    name: "green-apple",
                    amount: 715
                },
                {
                    name: "mango",
                    amount: 2016
                },
                {
                    name: "grape",
                    amount: 216
                },
                {
                    name: "orange",
                    amount: 1130
                },
                {
                    name: "peach",
                    amount: 3804
                },
                {
                    name: "cherry-banana",
                    amount: 2580
                },
                {
                    name: "guava",
                    amount: 1311
                }
            ],
      
            medals: {
                gold: false,
                silver: false,
                bronze: true
            },
            killedEnemies: 4615
        }
    }
}



// setters
if (SET_LEVEL_RESULT) {
    window.parent.setLevelResult = (level_number, level_code, level_collected_data, token) => {
        console.log("Nivel nro:", level_number, "\n", "code:", level_code)
        console.log("Elemento Enviado:", level_collected_data)
        console.log("Token:", token)
    }
}

// security
if (INIT_LEVEL) {
    window.parent.initLevel = (level_code) => {
        
        class Token {
            constructor() {
                this.time = new Date()
                this.code = Phaser.Math.Between(1000, 1999)
            }
        }
        return new Token()
    }
}

if (GOGO_ARTI) {
    window.parent.gogoArti = (player_x, player_y, artifact_x, artifact_y, artifact_name, token) => {
        console.log(`artefacto ${artifact_name} recogido en (${artifact_x}, ${artifact_y})` +
        `\npor el jugador en (${player_x}, ${player_y})`)
        console.log(token)
    }
}