const mongoose = require("mongoose")
const { Schema } = mongoose

const ingredientSchema = new Schema({
	name: { type: String, required: true, lowercase: true }
})


// a user will have a wish list of recipes
// more keys will be added

const recipeSchema = new Schema({
	name: { type: String, required: true, lowercase: true },
	ingredients: [ingredientSchema],
	description: String,
	resgion: String,
	created_by: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	how_to: { type: String },
	meta: {
		votes: Number,
		favs:  Number
	}
},
{
	timestamps: {createdAt: 'date_created', updatedAt: 'date_updated'}
})


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe 
