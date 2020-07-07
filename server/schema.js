const { buildSchema } = require('graphql')

module.exports = buildSchema(`
        type Query {
            pretendRecipe: Recipe
        },
        type Recipe {
            colour: String,
            title: String,
            ingredients: String
        }
    `)