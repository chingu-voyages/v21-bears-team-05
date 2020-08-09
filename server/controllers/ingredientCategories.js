const IngredientCategories = require("../models/ingredientCategories");

/**
 * get ingredients categories from the database
 * @async
 */
const getIngredientCategories = async (req, res, next) => {
  try {
    const categories = await IngredientCategories.find({});

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
/**
 * adds a new ingredient categorie to the database
 * @async
 * @param {ingredient} - ingregient document.
 */
const createIngredientCategorie = async (req, res, next) => {
  const ingredient = req.body;
  try {
    const newCategorie = await IngredientCategories.create({
      name: ingredient.name,
    });
    await newCategorie.save();
    res.status(200).json(newCategorie);
  } catch (error) {
    res.status(500).json({ error });
    next(error);
  }
};

module.exports = {
  getIngredientCategories,
  createIngredientCategorie,
};
