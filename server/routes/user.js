const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

router.get('/:id', (req, res) => {
	//  const user = req.user;
  const { id } = req.params
  User.findUserById(id, res)
})

module.exports = router