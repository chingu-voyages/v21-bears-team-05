import search from "../utils/search.mjs"
import { addData, getData } from "./dataController.mjs"

const searchRecipes = async ({query, ingredients, page}) => {
    let dataSet = getData({from: "recipe", query})
    if (ingredients) {
        dataSet = getRecipes({ingredients})
    }
    const searchOptions = {
        output: {
            recipeNamesThatStartWithQuery: {
                type: "string",
                within: "name",
                flags: "iy"
            }, 
            recipeNamesThatContainQuery: {
                type: "string",
                within: "name",
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
    return {data: [...matchSet].map(recipeKey => dataSet[recipeKey]), next: dataSet.next}
}

const getRecipes = async ({ingredients, page, recipeData}) => {
    const dataSet = recipeData ? recipeData : await getData({from: "recipe", ref: {ingredients}, page})
    const searchOptions = {
        output: {
            recipesWithLessOrEqualIngredients: {
                type: "array",
                within: "ingredients",
                compareFunc: (query, {value}) => {
                    const ingredientsArr = query.map(ingredient => ingredient.title)
                    return value.map(val => val.title).every(q => ingredientsArr.includes(q))
                } 
            }
        },
        recursive: true
    }
    const matches = search(
        ingredients, 
        dataSet, 
        searchOptions
    )
    return {data: matches?.recipesWithLessOrEqualIngredients?.map(result => result.path[1]) || [], next: dataSet.next}
}

const getNOfRecipes = async ({ingredients}) => {
    const nextPage = async ({total, page}) => {
        const recipes = await getRecipes({ingredients, page})
        total += await recipes?.data?.length || 0
        if (recipes.next && recipes.next !== "end") {
            return nextPage({total, page: recipes.next})
        }
        return total
    } 
    return nextPage({total: 0, page: 0})
} 

const addRecipe = async (recipe) => {
    return addData({into: "recipe", data: recipe})
}

export {searchRecipes, getRecipes, getNOfRecipes, addRecipe}
