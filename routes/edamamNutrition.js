const express = require("express");
const router = express.Router();
const edamamController = require("../controllers/edamamControllers");

router.get("/nutrition", edamamController.getNutrition);
router.get("/recipe", edamamController.getRecipe);

module.exports = router;
