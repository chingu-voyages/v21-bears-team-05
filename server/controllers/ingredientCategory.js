const util = require("util");
const IngredientCategory = require("../models/ingredientCategory");
const Index = require("../models/index");

Index.update = util.promisify(Index.update);

/**
 * adds a new recipe to the database
 * @async
 * @param {userId} title - uuid of recipe creator.
 */
const createIngredientCategory = async (userId, req, res, next) => {
  const ingredientCategory = req.body;
  try {
    const newIngredientCategory = await IngredientCategory.create({
      ...ingredientCategory,
    });
    await newIngredientCategory.save();
    //update index
    await Index.updateOne({}, { $push: { ingredientCategorys: newIngredientCategory.uuid } });
    res
      .status(200)
      .json({ ingredientCategory });
  } catch (error) {
    next(error);
  }
};

/**
 * updates an ingredientCategory
 * @async
 * @param {uuid} uuid - ingredientCategory uuid
 */
const updateIngredientCategory = async (uuid, req, res, next) => {
  const update = req.body;
  try {
    //update target recipe
    await IngredientCategory.findByIdAndUpdate(uuid, update, {
      new: true,
    });

    //send the response
    res.status(200).json({ updatedRecipe });
  } catch (error) {
    next(error);
  }
};

/**
 * Get an ingredientCategory
 * @async
 * @param {uuid} uuid - ingredientCategory uuid
 */
const getIngredientCategory = async (uuid, req, res, next) => {
  try {
    const ingredientCategory = await IngredientCategory.findById(uuid);
    if (!ingredientCategory) {
        return res.status(404).json({ error: "IngredientCategory not found" });
    }
    res.status(200).json(ingredientCategory);
  } catch (error) {
      console.error(error)
  }
};
/**
 * Get all ingredientCategorys from the database
 * @async
 */
const getIngredientCategorys = async (req, res, next) => {
  try {
    let ingredientCategorys = await IngredientCategory.find();

    if (ingredientCategorys.length === 0) {
      return res.status(404).json({ error: "No ingredientCategorys in database" });
    }
    res.status(200).json(ingredientCategorys);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createIngredientCategory,
  updateIngredientCategory,
  getIngredientCategory,
  getIngredientCategorys
};
