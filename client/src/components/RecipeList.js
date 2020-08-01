import React, { useEffect, useState } from 'react'
import { lookupIngredient } from "../services/ingredients.mjs";
import "./RecipeList.css";

const RecipesList = ({list, handleSettingRecipe}) => {
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        const processList = async () => {
            const recipes = [];
            const lookupIngredients = async (ingredientRefs) => {
                const ingredients = [];
                for (let ingredientRef of ingredientRefs) {
                  const ingredient = await lookupIngredient(ingredientRef);
                  ingredient && ingredients.push(ingredient);
                }
                return ingredients
            }
            for (let item of list) {
                const ingredients = await lookupIngredients(item.ingredients);
                recipes.push({...item, ingredients})
            }
            setRecipes(recipes)
        }
        list && processList();
    }, [list])
    return (
        <div className="recipe-list"> 
            <h1>Recipes</h1>
            <div className="recipe-list__main">
            { recipes.map((item, i) => (
                <div className="recipe-list__item" key={item.id} onClick={() => handleSettingRecipe(i)}>
                    <h2 className="recipe-list__item__title">{item.title}</h2>
                    <p className="recipe-list__item__description">{item.description || item.ingredients.map(({name}) => name).join(', ')}</p>
                    {item.gallery?.length > 0 ? 
                        <img className="recipe-list__item__image" alt="" src={item.gallery[0].url} /> :
                        <div className="recipe-list__item__placeholder-image">{item.title[0]}</div>
                    }
                </div>
            )) }
            </div>
        </div>
    )
}

export default RecipesList
