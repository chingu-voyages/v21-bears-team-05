import { addData, getData } from "./dataController.mjs"

const userID = 0 // TODO get from auth

const updateUserData = async ({data}) => {
    const currentUserData = await getUserData()
    await addData({ into: "user", data: { ...currentUserData, ...data } })
    return true
}

const getUserData = async () => {
    let user = await getData({ from: "user", ref: { userID } })
    if (!user.data[0]) {
        await newUser({userID: 0})
        user = await getData({ from: "user", ref: { userID } })
    }
    return user.data[0]
}

const updateCupboard = async (cupboard) => {
    await updateUserData({ data: { cupboard } })
    return true
}

const getCupboard = async () => {
    const data = await getUserData()
    return data.cupboard || []
}

const newUser = async ({userID}) => {
    await addData({ into: "user", data: { userID } })
    return true
}

export { updateCupboard, getCupboard, updateUserData, getUserData }
