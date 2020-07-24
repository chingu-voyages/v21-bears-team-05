const express = require("express")
const router = express.Router()

const Index = require("../controllers/index")


//  @route  GET /index
//  @desc   get index of top recipes and ingredients
//  @access Public
router.get("/", (req, res) => {
  // get index
})



module.exports = router