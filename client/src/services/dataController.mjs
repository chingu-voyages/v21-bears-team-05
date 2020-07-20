import localDB from './localDB'
import serverAPI from './localDB'
// import genTempId from '../utils/genTempId' // TODO

const config = {
    pageLength: 25
}

const data = {
    recipes,
    ingredients,
    users,
    index,
    queue
}

const addData = async ({into, newData}) => {
    const destinationIsValid = checkDestinationIsValid(into)
    if (!destinationIsValid) {
        return destinationIsValid
    }
    data[into] = {...data[into], ...newData}
    addToQueue({destination: into, data: newData})
    await localDB.write({into, data: newData})
    runQueue()
    return true
}

const editData = async ({into, ref, newData}) => {
    const refExists = checkRefExists(ref, into)
    if (!refExists) {
        return refExists
    }
    data[into][ref] = {...data[into][ref], ...newData}
    addToQueue({destination: into, data: newData})
    await localDB.write({into, data: newData})
    runQueue()
    return true
}

const getData = async ({from, ref, page}) => {
    const refExistsInIndex = checkRefExists(ref, "index")
    if (refExistsInIndex) {
        let data = await serverAPI.isOnline() && await Promise.resolve(false) // TODO fetch from sever
        if (data) {
            localDB.write({into: from, data})
        }
        else {

            data = await localDB.read({from, page, pageLength: config.pageLength})
        }
        return data && {data, next: !data || !Array.isArray(data) || data.length < config.pageLength ? "end" : page+1}
    } 
    return false
}

export { addData, getData }

const checkDestinationIsValid = destination => {
    if (!data[into]) {
        console.warn(`No destination/store for ${into}`)
        return false
    }
    return true
}

const checkRefExists = (ref, destination) => {
    const destinationIsValid = checkDestinationIsValid(destination)
    if (!destinationIsValid) {
        return destinationIsValid
    }
    if (!data[destination].hasOwnProperty(ref)) {
        console.warn(`No such data in ${from} with ref ${ref}`)
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

const init = () => {
    // load from storage
    data.recipes = await localDB.read("recipes") || {}
    data.ingredients = await localDB.read("ingredients") || {}
    data.users = await localDB.read("users") || {}
    data.index = await localDB.read("index") || {}
    data.queue = await localDB.read("queue") || []
    // sync from server
    // syncIndex
    // getUser
    // runQueue
}
init()