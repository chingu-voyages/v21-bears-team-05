import search from "../utils/search.mjs"
import { addData, getData } from "./dataController.mjs"

const searchRecipes = async ({query, ingredientsList, page}) => {
    const dataSet = ingredientsList ? getRecipes({ingredientsList}) : data
    const searchOptions = {
        output: {
            recipeTitlesThatStartWithQuery: {
                type: "string",
                within: "title",
                flags: "iy"
            }, 
            recipeTitlesThatContainQuery: {
                type: "string",
                within: "title",
                flags: "i"
            },
            recipeDescriptionsThatContainQuery: {
                type: "string",
                within: "description",
                flags: "i"
            }
        },
        recursive: true
    }
    const matches = search(
        query, 
        dataSet, 
        searchOptions
    )
    const matchSet = new Set(Object.keys(matches).map(container => {
        return [...matches[container].map((result => result.path[0]))]
    }).flat())
    return [...matchSet].map(recipeKey => dataSet[recipeKey])
}

const getRecipes = ({ingredientsList, page}) => {
    const dataSet = data
    const searchOptions = {
        output: {
            recipesWithLessOrEqualIngredients: {
                type: "object",
                within: "ingredients",
                compareFunc: (query, {value}) => {
                    const ingredientsArr = Object.values(value).map(ingredient => ingredient.title)
                    return query.every(q => ingredientsArr.includes(q))
                } 
            }
        },
        recursive: true
    }
    const matches = search(
        ingredientsList, 
        dataSet, 
        searchOptions
    )
    return matches.recipesWithLessOrEqualIngredients || []
}

const getNOfRecipes = async ({ingredientsList}) => {
    const nextPage = async ({total = 0, page = 1}) => {
        total += await getRecipes({ingredientsList, page}).length || 0
        if (page !== "end") {
            return nextPage({total, page: page+1})
        }
        return total
    } 
    return nextPage()
} 

export {searchRecipes, getRecipes, getNOfRecipes}

const data = (function dummyData() { /* TODO insert into localDB for testing, later replace with call to backend */
    return {
        0: {
            title: 'Fried Egg',
            description: 'Crack open an egg!',
            time: {
                working: {
                    min: 1,
                    value: 'minutes'
                },
                cooking: {
                    max: 3,
                    value: 'minutes'
                }
            },
            ingredients: {
                0: {
                    title: 'egg',
                    qty: 1,
                    value: 'medium'
                },
                1: {
                    title: 'butter',
                    qty: 1,
                    value: 'knob',
                    alternatives: [
                        { 
                            title: 'oil',
                            qty: 1,
                            value: 'tablespoon'
                        }
                    ]
                }
            },
            steps: [
                `Heat <--ingredient1--> in a frying pan on medium heat.`,
                `Crack open <--ingredient0--> into frying pan.`,
                `With a spoon continually baste <--ingredient0--> with hot <--ingredient1--> to cook envenly (alternatively cover pan with a lid)`
                `When all the egg whites have turned opaque, using a spatula gently remove <--ingredient0-->`
            ],
            author: 'userId0'
        },
        2: {
            title: 'Quick Fresh Homemade Pizza',
            description: 'Thin crispy based italian style pizza, made at home using a frying pan/oven cooking combination',
            time: {
                working: {
                    min: 10,
                    value: 'minutes'
                },
                cooking: {
                    approx: 10,
                    value: 'minutes'
                }
            },
            ingredients: {
                0: {
                    title: 'mozzarella',
                    qty: 50,
                    value: 'gram',
                    alternatives: [
                        'cheese'
                    ]
                },
                1: {
                    title: 'tinned tomatos',
                    qty: 50,
                    value: 'mililitre',
                    alternatives: [
                        'passata',
                        'tomato sauce'
                    ]
                },
                2: {
                    title: '00 flour',
                    qty: 75,
                    value: 'gram',
                    alternatives: [
                        'flour'
                    ]
                },
                3: {
                    title: 'instant yeast',
                    qty: 0.25,
                    value: 'teaspoon'
                },
                4: {
                    title: 'olive oil',
                    qty: 0.25,
                    value: 'tablespoon',
                    alternatives: [
                        'oil',
                        'cooking oil',
                        'sunflower oil'
                    ]
                },
                5: {
                    title: 'salt',
                    qty: 0.25,
                    value: 'teaspoon'
                },
                6: {
                    title: 'sugar',
                    qty: 0.25,
                    value: 'teaspoon'
                },
                7: {
                    title: 'warm water',
                    qty: 50,
                    value: 'mililitre'
                }
            },
            steps: [
                `Pop <--ingredient1--> into a pan. Leave to simmer until reduced to a thick consistency. Stir to prevent burning the bottom.`,
                `In a large bowl stir together <--ingredient2-->, <--ingredient3-->, <--ingredient5-->, and <--ingredient6-->.`,
                `Make a crater in the center and pour in <--ingredient4--> and <--ingredient7-->. Mix with wooden spoon until you have soft wet dough.`,
                `Set your oven to 240C/fan 220C/gas 8`,
                `Tip onto a floured surface and kneed until smooth (5 mins)`,
                `Chop or grate <--ingredient0--> to your liking and prepare any optional toppings you want to add`,
                `When your <--ingredient1--> sauce is reduced to a thick consistency take off the heat`,
                `Heat a cast iron frying pan (or other non teflon pan) on full heat`,
                `Roll out the dough as thin as you're able. Roll in the edges (will form crust) if your base is too big to fit in your largest frying pan.`,
                `Throw your base into the extra hot frying pan, turn occasionally, until the bottom is crisp and/or large bubbles form`,
                `Spread on your <--ingredient1--> sauce, your <--ingredient0-->, and any optional topping`,
                `Pop into oven for about 5 minutes`,
                `Take out of oven and enjoy!`
            ],
            author: 'userId0'
        },
    }
})()