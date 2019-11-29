const express = require("express");
const router = express.Router();
const spoonController = require("../controllers/spoonContollers");

router.get("/nutrition", spoonController.getNutrition);
router.get("/recipe", spoonController.getRecipe);

module.exports = router;
