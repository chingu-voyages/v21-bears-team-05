import localDB from './localDB'

const isOnline = async () => {
    // TODO check if able to connect
    return false
}

const addToQueue = (destination, data) => {
    localDB.queque.add({destination, data, timeStamp: Date.now()})
}

const runQueue = async () => { 
    if (await isOnline()) {
        const queue = await localDB.read("queue")
        while (queue.length > 0) {
            const nextOperation = queue.shift()
            const uploaded = true // TODO await upload to external DB 
            if (!uploaded) {
                // try again in a few minutes
                setTimeout(runQueue, 1000*60*2)
            } else {
                localDB.remove("queue", nextOperation.id)
            }
        }
    }
}
runQueue()
 
const addData = async (what, data) => {
    addToQueue(what, data)
    await localDB.write(what, data)
    runQueue()
}

const getData = async (from, ref) => {
    const data = await isOnline() && await Promise.resolve(false) // TODO fetch from sever
    if (data) {
        await localDB.write(from, data)
        return data
    }
    else {
        return localDB.read(from, ref)
    }
}


export { addData, getData }