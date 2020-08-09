const util = require("util");
const Ingredient = require("../models/ingredient");
const Index = require("../models/index");

Index.update = util.promisify(Index.update);

/**
 * adds a new recipe to the database
 * @async
 * @param {userId} title - uuid of recipe creator.
 */
const createIngredient = async (userId, req, res, next) => {
  const ingredient = req.body;
  try {
    const newIngredient = await Ingredient.create({
      ...ingredient,
    });
    await newIngredient.save();
    //update index
    await Index.updateOne({}, { $push: { ingredients: newIngredient.uuid } });
    res.status(200).json({ ingredient });
  } catch (error) {
    /*
     *  It seems that we're unable to check for duplicate data on the first time
     *  we create them, only try / catch will get hem
     *   So on duplicate error (11000), we return the object
     */
    if (error.code === 11000) {
      res.status(200).json({ ingredient });
      next();
    } else {
      next(error);
    }
  }
};

/**
 * updates an ingredient
 * @async
 * @param {uuid} uuid - ingredient uuid
 */
const updateIngredient = async (uuid, req, res, next) => {
  const update = req.body;
  try {
    //update target recipe
    await Ingredient.findByIdAndUpdate(uuid, update, {
      new: true,
    });

    //send the response
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    next(error);
  }
};

/**
 * Get an ingredient
 * @async
 * @param {uuid} uuid - ingredient uuid
 */
const getIngredient = async (uuid, req, res, next) => {
  try {
    const ingredient = await Ingredient.findOne({ uuid });
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    console.error(error);
  }
};
/**
 * Get all ingredients from the database
 * @async
 */
const getIngredients = async (req, res, next) => {
  try {
    let ingredients = await Ingredient.find();

    if (ingredients.length === 0) {
      return res.status(404).json({ error: "No ingredients in database" });
    }
    res.status(200).json(ingredients);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createIngredient,
  updateIngredient,
  getIngredient,
  getIngredients,
};
