import {
  // --nutritional search
  // -- --edit user saved nutrition
  GET_USER_SAVED_NUTRITION,
  // -- --send nutritional search request
  GET_NUTRITION,
  // -- --save parsed search request
  SAVE_NUTRITION_ANALYSIS,
  // -- --update recent nutrition query list
  UPDATE_RECENT_QUERY_LIST,
  // -- --show nutrition detail
  SET_SHOW_NUTRITION_DETAIL,
  // -- --show recipe detail
  SET_SHOW_RECIPE_DETAIL,
  // -- --clear current nutrition data
  CLEAR_CURRENT_NUTRITION_DATA,
  // -- --logout
  LOGOUT
  // -- --logout from all devices
} from "../../../actions/actionTypes";

import {
  updateObjProp,
  updateObjAddToArr
  // updateObjRemoveFromArrByAccessor,
  // updateArrInObjAddOrReplaceByAccessor
} from "../../../../utils/updateObjHelpers";

export const INIT_STATE = {
  current: undefined,
  saved: {
    recentSearches: [],
    savedAnalysis: []
  },
  showNutritionDetail: false,
  showRecipeDetail: false
};

const nutritionReducer = (nutritionState = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT:
      return INIT_STATE;
    case GET_USER_SAVED_NUTRITION:
      return updateObjProp(nutritionState, payload, "saved");
    case GET_NUTRITION:
      return updateObjProp(nutritionState, payload, "current");
    case SAVE_NUTRITION_ANALYSIS:
      return updateObjAddToArr(
        nutritionState,
        payload,
        "saved",
        "savedAnalysis"
      );
    //** Update the nutrition query list and unshift the first list item if length > 50 */
    case UPDATE_RECENT_QUERY_LIST:
      return updateObjAddToArr(
        nutritionState,
        payload,
        "saved",
        "recentSearches"
      );
    case CLEAR_CURRENT_NUTRITION_DATA:
      return updateObjProp(nutritionState, INIT_STATE.current, "current");
    case SET_SHOW_NUTRITION_DETAIL:
      return updateObjProp(nutritionState, payload, "showNutritionDetail");
    case SET_SHOW_RECIPE_DETAIL:
      return updateObjProp(nutritionState, payload, "showRecipeDetail");
    default:
      return nutritionState;
  }
};

export default nutritionReducer;
