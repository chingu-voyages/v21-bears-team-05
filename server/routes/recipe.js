const express = require('express');
const router = express.Router();

const Recipe = require('../controllers/recipe')

/* POST recipee */
router.post('/:userId', (req, res) => {
  const { userId } = req.params
  Recipe.createRecipe(userId, req, res)
})

router.put('/:id', (req, res) => {
	const { id } = req.params;
  Recipe.updateRecipe(id, req, res);
})


module.exports = router