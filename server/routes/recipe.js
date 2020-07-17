const express = require('express');
const router = express.Router();

const Recipe = require('../controllers/recipe')

//GET project
router.get('/list/:id', (req, res) => {
	const { id } = req.params
  Recipe.listAllUserRecipe(id, res)
})

// POST recipee 
router.post('/:userId', (req, res) => {
  const { userId } = req.params
  Recipe.createRecipe(userId, req, res)
})

// PUT project
router.put('/:id', (req, res) => {
	const { id } = req.params
  Recipe.updateRecipe(id, req, res)
})


// DELETE project 
router.delete('/:id', (req, res) => {
  const { id } = req.params
  Recipe.deleteRecipe(id, req, res)
})




module.exports = router