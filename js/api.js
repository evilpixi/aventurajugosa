class API {}

// ----------------------------------------------------
// -------------------- GETTERS -----------------------
// ----------------------------------------------------
API.getUser = (data)=> {
    return new Promise((res,rej) => {
        try {
            res(window.parent.getUser(data))
        }
        catch(err) {
            rej("Usuario no encontrado")
        }
        
    })
}

API.getAllLevelsProgress = ()=> {
    return new Promise((res,rej) => {
        try {
            res(window.parent.getAllLevelsProgress())
        }
        catch(err) {
            rej("Niveles no encontrados")
        }
        
    })
}

API.getRanking = (n) => {
    return new Promise((res, rej) => {
        try {
            res(window.parent.getRanking(n))
        }
        catch(err) {
            rej("Jugadores del ranking no encontrados")
        }
    })
}

API.getArchievements = () => {
    return new Promise ((res,rej)=> {
        try {
            window.setTimeout(()=>{
                res(window.parent.getArchievements())
            }, 500)
        }
        catch(err) {
            rej("logros no obtenidos")
        }
    })
}

// ----------------------------------------------------
// -------------------- SETTERS -----------------------
// ----------------------------------------------------
API.setLevelResult = (level_number, level_code, level_collected_data, token) => {
    try {
        window.parent.setLevelResult(level_number, level_code, level_collected_data, token)
    }
    catch(err) {
        console.log("No se pudo enviar:", level_collected_data)
        console.log(err)
    }
}


// ----------------------------------------------------
// -------------------- SECURITY ----------------------
// ----------------------------------------------------
API.initLevel = (level_code) => {
    return new Promise((res,rej) => {
        try {
           res(window.parent.initLevel(level_code))
        }
        catch(err) {
            console.log("init level: Token no recibido")
            rej(err)
        }
    })
}

API.gogoArti = (player_x, player_y, artifact_x, artifact_y, artifact_name, token) => {
    try {
        window.parent.gogoArti(player_x, player_y, artifact_x, artifact_y, artifact_name, token)
    }
    catch(err) {
        console.log("no se pudo enviar el token al juntar el elemento")
        console.log(err)
    }
}