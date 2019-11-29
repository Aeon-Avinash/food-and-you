const axios = require("axios");

exports.getNutrition = async (req, res, next) => {
  let { foodString } = req.query;
  // foodString = encodeURIComponent(foodString);
  // const reqBody = {
  //   ingredientList: foodString,
  //   servings: 1,
  //   includeNutrition: true
  // };
  // const postParserUrl = `https://api.spoonacular.com/recipes/parseIngredients`;
  // const parserRes = await axios.post(postParserUrl, {
  //   params: {
  //     apiKey: process.env.SPOONACULAR_API_KEY
  //   },
  //   data: JSON.stringify(reqBody)
  // });
  // console.log(parserRes.data);

  // if (parserRes.data && parserRes.data[0].original) {
  //   const { id, original } = parserRes.data[0];
  //   console.log({ id, original });
  //   console.log(
  //     `${parserRes.data[0].amount} ${parserRes.data[0].unit} ${parserRes.data[0].originalName}`
  //   );
  // }
  // if (
  //   parserRes.data &&
  //   parserRes.data[0].nutrition &&
  //   parserRes.data[0].nutrition.nutrients[0]
  // ) {
  //   const {
  //     title,
  //     amount,
  //     unit,
  //     percentOfDailyNeeds
  //   } = parserRes.data[0].nutrition.nutrients[0];
  //   console.log({ title, amount, unit, percentOfDailyNeeds });
  // }

  res.json({ message: "Nutrition Controller reached!", query: foodString });
};

exports.getRecipe = async (req, res, next) => {
  let { name } = req.query;
  name = encodeURIComponent(name);
  let cuisine, diet, intolerances;
  if (req.user) {
    cuisine = user.preferences.cuisine.join(",");
    diet = user.preferences.diet.join(",");
    intolerances = user.preferences.intolerances.join(",");
  }

  const getRecipesUrl = `https://api.spoonacular.com/recipes/search`;
  const recipeRes = await axios.post(getRecipesUrl, {
    params: {
      apiKey: process.env.SPOONACULAR_API_KEY,
      query: name,
      number: 10,
      cuisine,
      diet,
      intolerances
    }
  });

  console.log(recipeRes.data);

  res.json({ message: "Recipe Controller reached!" });
};
