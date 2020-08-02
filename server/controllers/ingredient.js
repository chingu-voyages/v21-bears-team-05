const Ingredient = require("../models/ingredients");

/**
 * get ingredients from the database
 * @async
 */
const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};
/**
 * adds a new ingredient to the database
 * @async
 * @param {ingredient} - ingregient document.
 */
const createIngredient = async (req, res, next) => {
  const ingredient = req.body;

  try {
    const newIngredient = await Ingredient.create({
      ...ingredient,
    });
    await newIngredient.save();
    res.status(200).json(newIngredient);
  } catch (error) {
    res.status(500).json({ error });
    next(error);
  }
};
/**
 * Get ingredients categories from the database
 * @async
 */
const ingredientCategories = async (req, res, next) => {
  try {
    //  Return unique categorie
    const categories = await Ingredient.find({}).distinct("categories");
    const parsedCategories = categories.map((cat) => {
      return {
        id: Math.random(),
        name: cat,
      };
    });
    res.status(200).json(parsedCategories);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createIngredient,
  getIngredients,
  ingredientCategories,
};
