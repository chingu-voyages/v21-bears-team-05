function randomHexColour(darkest = "0000AA", lightest = "FF0000") {
    const randomN = getRandomInt(parseInt(darkest, 16), parseInt(lightest, 16))
    const hexValue = randomN.toString(16)
    const colourValue = "0".repeat(6 - hexValue.length)+hexValue
    return "#"+colourValue
}

const foodItems = ['pizza', 'sandwhich', 'pie', 'bread']
const ingredients = ['basil', 'egg', 'chilli', 'pepper', 'salt', 'cheese']
function randomFood() {
    const ingredient1 = ingredients[getRandomInt(0, foodItems.length)];
    const ingredient2 = ingredients[getRandomInt(0, foodItems.length)];
    return {
        colour: randomHexColour(),
        title: foodItems[getRandomInt(0, foodItems.length)],
        ingredients: `${ingredient1} ${ingredient1 === ingredient2 ? 'and more' : 'and'} ${ingredient2}`
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

function lilysSillyFunction() {
    return randomFood()
}

module.exports = lilysSillyFunction