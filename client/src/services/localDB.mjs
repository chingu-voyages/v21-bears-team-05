import Dexie from 'dexie'

const db = new Dexie('db_v1test')
db.version(1).stores({
    recipe: '++id, title, description, *ingredients',
    ingredient: '++id, title, *catagories',
    user: 'userID, name',
    queque: '++id',
    test: '++id'
})

const write = async (into, data) => {
    try {
        await db[into].add(data)
        return true
    }
    catch (e) {
        console.error(e)
    }
}

const read = async (from, ref) => {
    try {
        let data
        if (!ref) {
            data = await db[from].toArray()
        } else {
            data = await db[from].get(ref)
            if (!data) {
                throw new Error(`Could not get data from ${from} for ref: ${ref} !`)
            }
        } 
        return data
    }
    catch (e) {
        console.error(e)
    }
}

const remove = async (from, ref) => {
    try {
        let data
        if (!ref) {
            await db[from].clear()
        } else {
            await db[from].delete(ref)
        } 
        return data
    }
    catch (e) {
        console.error(e)
    }
}

export default { write, read, remove }