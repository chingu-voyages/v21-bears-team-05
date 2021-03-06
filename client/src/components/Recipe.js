import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { lookupIngredient } from "../services/ingredients.mjs";
import Gallery from "./Gallery";
import { getRecipe } from "../services/recipes";
import "./Recipe.css";

const Recipe = ({ recipeId, handlePrev, handleNext }) => {
  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    delta: 50,
  });
  const [recipeData, setRecipeData] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  useEffect(() => {
    let data;
    const getRecipeData = async () => {
      data = await getRecipe(recipeId);
      data?.ingredients && lookupIngredients();
      data?.gallery && setGalleryList(data.gallery);
      setRecipeData(data);
    };
    const lookupIngredients = async () => {
      const ingredients = [];
      for (let item of data.ingredients) {
        const ingredient = await lookupIngredient(item.uuid);
        ingredient && ingredients.push({ ...item, ...ingredient });
      }
      setIngredients(ingredients);
    };
    recipeId && getRecipeData();
  }, [recipeId]);
  return recipeData ? (
    <article
      className="recipe"
      style={{ background: recipeData.colour }}
      {...handlers}
    >
      <h1 className="recipe__title">{recipeData.title}</h1>
      <main className="recipe__main">
        <Gallery
          key={"gallery" + recipeData.uuid}
          {...{
            galleryList,
            ingredients,
            setGalleryList,
            recipeId: recipeData.uuid,
          }}
        />
        <div className="recipe__main__content">
          <p className="recipe__description">{recipeData.description}</p>
          <section className="recipe__ingredients">
            <h2 className="recipe__section__title">Ingredients:</h2>
            <ul className="recipe__ingredients__list">
              {ingredients.map((ingredient) => (
                <li key={ingredient.uuid}>
                  {ingredient?.amount?.quantity} {ingredient?.amount?.value}{" "}
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </section>
          <section className="recipe__instructions">
            <h2 className="recipe__section__title">Instructions:</h2>
            <ol className="recipe__instructions__list">
              {recipeData?.instructions?.map((step) => (
                <li key={recipeData.uuid + step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </article>
  ) : (
    <div>
      No more recipes to show, please try adding more ingredients to your
      cupboard.
    </div>
  );
};

export default Recipe;
