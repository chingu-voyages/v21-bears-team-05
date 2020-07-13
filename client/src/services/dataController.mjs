import localDB from './localDB'

const config = {
    pageLength: 25
}

const isOnline = async () => {
    // TODO check if able to connect
    return false
}

const addToQueue = ({destination, data}) => {
    localDB.write({into: "queue", data: {destination, data, timeStamp: Date.now()}})
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
                localDB.remove({from: "queue", ref: nextOperation.id})
            }
        }
    }
}
runQueue()
 
const addData = async ({into, data}) => {
    addToQueue({destination: into, data})
    await localDB.write({into, data})
    runQueue()
    return true
}

const getData = async ({from, ref, page}) => {
    let data = await isOnline() && await Promise.resolve(false) // TODO fetch from sever
    if (data) {
        localDB.write({into: from, data})
    }
    else {
        data = await localDB.read({from, ref, page, pageLength: config.pageLength})
    }
    return {data, next: data.length < config.pageLength ? "end" : page+1}
}


export { addData, getData }