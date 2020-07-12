const mongoose = require("mongoose")
const { Schema } = mongoose

const ingredientSchema = new Schema({
	name: { type: String, required: true, lowercase: true }
})

const recipeSchema = new Schema({
	name: { type: String, required: true, lowercase: true },
	ingredients: [ingredientSchema],
	description: String,
	resgion: String,
	created_by: { type: Schema.Types.ObjectId, required: true },
	how_to: { type: String },
	meta: {
		votes: Number,
		favs:  Number
	}
},
{
	timestamps: {createdAt: 'date_created', updatedAt: 'date_updated'}
})
// a user will have a wish list of recipes
// add model contents as appr

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
