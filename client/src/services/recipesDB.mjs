import search from "../utils/search.mjs"
import { addData, getData } from "./dataController.mjs"

const searchRecipes = async ({query, ingredientsList, page}) => {
    let dataSet = getData({from: "recipe", query})
    if (ingredientsList) {
        dataSet = getRecipes({ingredientsList})
    }
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
        return [...matches[container].map(result => result.path[0])]
    }).flat())
    return [...matchSet].map(recipeKey => dataSet[recipeKey])
}

const getRecipes = async ({ingredientsList, page, recipeData}) => {
    const dataSet = recipeData ? recipeData : await getData({from: "recipe", ref: {ingredientsList}, page})
    const searchOptions = {
        output: {
            recipesWithLessOrEqualIngredients: {
                type: "object",
                within: "ingredients",
                compareFunc: (query, {value}) => {
                    const ingredientsArr = Object.values(value).map(ingredient => ingredient.title)
                    return ingredientsArr.every(q => query.includes(q))
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
    return matches?.recipesWithLessOrEqualIngredients?.map(result => result.path[1]) || []
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

const addRecipe = async ({title, description, time, ingredients, steps, author}) => {
    return addData({into: "recipe", data: {title, description, time, ingredients, steps, author}})
}

export {searchRecipes, getRecipes, getNOfRecipes, addRecipe}
