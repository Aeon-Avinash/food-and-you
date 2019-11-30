import { combineReducers } from "redux";
import settingsReducer from "./settings_reducer";
import nutritionReducer from "./nutrition_reducer";
import recipesReducer from "./recipes_reducer";

import { INIT_STATE as settingsINIT } from "./settings_reducer";
import { INIT_STATE as nutritionINIT } from "./nutrition_reducer";
import { INIT_STATE as recipesINIT } from "./recipes_reducer";

export const INIT_STATE = {
  settings: settingsINIT,
  nutrition: nutritionINIT,
  recipes: recipesINIT
};

const userDataReducer = combineReducers({
  settings: settingsReducer,
  nutrition: nutritionReducer,
  recipes: recipesReducer
});

export default userDataReducer;
