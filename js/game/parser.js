class LevelParser {}

// gets a level room and returns it as matrix of words
LevelParser.parse = (room) => {
    let m = room.length
    let n = room[0].length

    let count = {
        enemies: 0
    }

    // iterate all strings (rows)
    let levelObjects = []
    for (let r=0; r<m; r++) {

        // iterate all letters (columns)
        let rowObjects = []
        let row = room[r]
        let word = ""
        let c = 0

        do {
            char = row[c]
            if (char === "," || c==n) {

                rowObjects.push({
                    type: word,
                    active: false,
                    alive: true
                })
                word = ""

                if (word[0] == "e") {
                    count.enemies++
                }
            }
            else {
                word += char
            }
            c++
        } while (c<=n)
        levelObjects.push(rowObjects)

    }

    console.log(count)
    return levelObjects
}

// gets a level data and returns an strcuture level
LevelParser.getLevelStructure = (levelData, variants) => {
    let rowsAmount = levelData.structure.startRoom.length
    let columnsAmount = levelData.structure.startRoom.length[0]

    // create the first structure from the startRoom and the finalRoom
    let levelStructure = [...LevelParser.parse(levelData.structure.startRoom)]
    let finalStructure = [...LevelParser.parse(levelData.structure.finalRoom)]

    // shuffle a copy of the rooms and add them to the structure
    let rooms = []
    let rawRooms
    
    for (let roomId=1; roomId <= 3; roomId++) {
        if (variants) {
            rawRooms = levelData.structure["rooms"+roomId]
            rooms.push(LevelParser.parse(rawRooms[variants[roomId-1]]))
        } 
        else {
            rawRooms = Utils.shuffleArray([...levelData.structure["rooms"+roomId]])
            rooms.push(LevelParser.parse(rawRooms[0]))
        }
    }

    /*for (let i = 0; i<levelData.rooms1.length; i++) {
        rooms.push(LevelParser.parse(rawRooms[i]))
    }*/

    // for each row concat the structure
    for(let r = 0; r<levelStructure.length; r++) {

        // concat each room to the startRoom
        for (let i = 0; i<rooms.length; i++) {
            levelStructure[r] = levelStructure[r].concat(rooms[i][r])
        }

        // concat the boss room
        levelStructure[r] = levelStructure[r].concat(finalStructure[r])
    }

    return levelStructure
}
/*
LevelParser.create = (scene, lvl) => {
    // for every row
    for(let r = 0; r<lvl.length; r++) {

        // for every column
        for (let c = 0; c<lvl[r].length; c++) {

            let e = lvl[r][c]

            if (e === "   ") continue

            else if (e === "___") {
                scene.addPlatform()
            }
        }
    }

}*/

