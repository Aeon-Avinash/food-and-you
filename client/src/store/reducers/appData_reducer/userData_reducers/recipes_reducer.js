import {
  // --recipe search
  // -- --edit user saved recipes
  GET_USER_SAVED_RECIPES,
  // -- --send autocomplete query string
  GET_RECIPE_QRY_AUTOCOMPLETE,
  // -- --send recipe search request
  GET_RECIPES,
  // -- --show recipe search result snippets
  GET_RECIPE_DETAIL,
  // -- --show detailed recipe
  SAVE_RECIPE,
  // -- --update recent recipe search list
  UPDATE_RECENT_SEARCH_LIST,
  // -- --update recent recipes list
  UPDATE_RECENT_RECIPES,
  // -- --set current recipes detail
  SET_CURRENT_RECIPES_DETAIL,
  // -- --set current timeline recipes detail
  SET_CURRENT_TIMELINE_RECIPES_DETAIL,
  // -- --clear current recipes data
  CLEAR_CURRENT_RECIPES_DATA,
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
  current: {
    detail: undefined,
    list: undefined,
    suggestions: undefined,
    timelineDetail: undefined
  },
  saved: {
    recentSearches: [],
    recentRecipes: [],
    favoriteRecipes: []
  }
};

const recipesReducer = (recipesState = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT:
      return INIT_STATE;
    case GET_USER_SAVED_RECIPES:
      console.log(payload);
      return updateObjProp(recipesState, payload, "saved");
    case GET_RECIPE_QRY_AUTOCOMPLETE:
      return updateObjProp(recipesState, payload, "current", "suggestions");
    case GET_RECIPES:
      return updateObjProp(recipesState, payload, "current", "list");
    case GET_RECIPE_DETAIL:
      return updateObjProp(recipesState, payload, "current", "detail");
    case UPDATE_RECENT_SEARCH_LIST:
      return updateObjAddToArr(
        recipesState,
        payload,
        "saved",
        "recentSearches"
      );
    //** Update the recent lists and unshift the first list item if length > 10 */
    case UPDATE_RECENT_RECIPES:
      return updateObjAddToArr(recipesState, payload, "saved", "recentRecipes");
    case SAVE_RECIPE:
      return updateObjAddToArr(
        recipesState,
        payload,
        "saved",
        "favoriteRecipes"
      );
    case SET_CURRENT_RECIPES_DETAIL:
      return updateObjProp(recipesState, payload, "current", "detail");
    case SET_CURRENT_TIMELINE_RECIPES_DETAIL:
      return updateObjProp(recipesState, payload, "current", "timelineDetail");
    case CLEAR_CURRENT_RECIPES_DATA:
      return updateObjProp(recipesState, INIT_STATE.current, "current");
    default:
      return recipesState;
  }
};

export default recipesReducer;
