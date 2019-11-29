const axios = require("axios");

exports.getNutrition = async (req, res, next) => {
  let { foodString } = req.query;
  foodString = encodeURIComponent(foodString);
  const getParserUrl = `https://api.edamam.com/api/food-database/parser`;
  const parseRes = await axios.get(getParserUrl, {
    params: {
      app_id: process.env.EDAMAM_FOOD_SEARCH_APP_ID,
      app_key: process.env.EDAMAM_FOOD_SEARCH_KEY,
      ingr: foodString
    }
  });
  console.log(parseRes.data);

  if (parseRes.data && parseRes.data.parsed && parseRes.data.parsed[0].food) {
    const { foodId } = parseRes.data.parsed;
    console.log("parsed", { foodId });
    console.log("parsed measure:", parseRes.data.parsed[0].measure);
  }
  if (parseRes.data && parseRes.data.hints && parseRes.data.hints[0].food) {
    const { foodId } = parseRes.data.hints;
    console.log("hints", { foodId });
    console.log("hints measure_0:", parseRes.data.hints[0].measuparseRes[0]);
  }

  const ingredients = [];
  if (parseRes.data && parseRes.data.parsed && parseRes.data.hints) {
    parseRes.data.parsed.forEach((item, index) => {
      ingredients.push({
        quantity: parseRes.data.parsed[index].quantity || 1,
        measureURI:
          parseRes.data.parsed[index].measure.uri ||
          parseRes.data.hints[index].measuparseRes[index].uri,
        foodId:
          parseRes.data.parsed[index].foodId || res.data.hints[index].foodId
      });
    });
  }

  const postNutritionUrl = `https://api.edamam.com/api/food-database/parser`;
  const nutriRes = await axios.post(postNutritionUrl, {
    params: {
      app_id: process.env.EDAMAM_FOOD_SEARCH_APP_ID,
      app_key: process.env.EDAMAM_FOOD_SEARCH_KEY
    },
    data: JSON.stringify(ingredients)
  });

  console.log(nutriRes.data);
  if (nutriRes.data && nutriRes.data.calories) {
    console.log("calories:", nutriRes.data.calories);
  }

  return res.json({ message: "Nutrition Controller reached!" });
};

exports.getRecipe = async (req, res, next) => {
  let { name } = req.query;
  name = encodeURIComponent(name);

  let params = new URLSearchParams();
  params.append(app_id, process.env.EDAMAM_FOOD_SEARCH_APP_ID);
  params.append(app_key, process.env.EDAMAM_FOOD_SEARCH_KEY);
  params.append(q, name);
  if (req.user) {
    user.preferences.cuisine.forEach(c => params.append("cuisineType", c));
    user.preferences.diet.forEach(d => params.append("diet", d));
    user.preferences.intolerances.forEach(i => params.append("health", i));
  }

  const getRecipesUrl = `https://api.edamam.com/search`;
  const recipeRes = await axios.get(getRecipesUrl, {
    params: params
  });
  console.log(recipeRes.data);

  return res.json({ message: "Recipe Controller reached!" });
};
