import localDB from './localDB'
import serverAPI from './serverAPI'
import generateTempId from '../utils/generateTempId'

const appState = {}

const addData = async ({into, data}) => { // into: recipes/ingredients/users, data: { id: [UID], ... }
    const destinationIsValid = checkDestinationIsValid(into)
    if (!destinationIsValid) {
        return destinationIsValid
    } 
    if (!data.id) {
        data = {...data, id: generateTempId()}
    }
    else {
        var editing = checkRefExists({ref: data.id, destination: into})
    }
    appState[into] = {...appState[into], ...data}
    addToQueue({destination: into, data})
    await localDB.write({into, data})
    editing ? serverAPI.putData({destination: into, data, ref: data.id}) : serverAPI.postData()
    runQueue()
    return true
}

const getData = async ({from, ref}) => { // from: recipes/ingredients/users, ref: { id: [UID] }
    const refExistsInIndex = checkRefExists({ref, destination: "index"})
    if (refExistsInIndex) {
        let data = await localDB.read({from, ref})
        let lastest = false // TODO compare index lastModified <= data.lastModified, have server add lastModified to data
        if ((!data && await serverAPI.isOnline()) || !lastest) {
            data = await serverAPI.getData({ destination: from, ref })
            if (data) {
                localDB.write({into: from, data})
                return data
            }
            else {
                console.warn(`Unable to find data in ${from} for ${ref}`)
            }
        }
        else {
            
        }
        return data
       
    } 
    console.warn(`Data in ${from} for ${ref} does not exist!`)
    return false
}

export { addData, getData }

const checkDestinationIsValid = destination => {
    if (!appState[destination]) {
        console.warn(`No store for ${destination}`)
        return false
    }
    return true
}

const checkRefExists = ({ref, destination}) => {
    const destinationIsValid = checkDestinationIsValid(destination)
    if (!destinationIsValid) {
        return destinationIsValid
    }
    if (!appState[destination].hasOwnProperty(ref)) {
        console.warn(`No such data in ${destination} with ref ${ref}`)
        return false
    }
}

const addToQueue = ({destination, data}) => {
    localDB.write({into: "queue", data: {destination, data, timeStamp: Date.now()}})
}

const runQueue = async () => { 
    if (await serverAPI.isOnline()) {
        const queue = await localDB.read("queue")
        while (queue.length > 0) {
            const nextOperation = queue.shift()
            const uploaded = true // TODO await upload to external DB 
            if (!uploaded) {
                // try again in a few minutes
                setTimeout(runQueue, 1000*60*2)
            } else {
                localDB.remove({from: "queue", ref: nextOperation.id})
            }
        }
    }
}
runQueue()

const init = async () => {
    // load from storage
    appState.recipes = await localDB.read("recipes") || {}
    appState.ingredients = await localDB.read("ingredients") || {}
    appState.users = await localDB.read("users") || {}
    appState.index = await localDB.read("index") || {}
    appState.queue = await localDB.read("queue") || []
    // sync from server
    // syncIndex
    // getUser
    // runQueue
}
init()