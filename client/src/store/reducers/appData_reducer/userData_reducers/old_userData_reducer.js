import {
  // -- --fetch preferences
  GET_USER_SETTINGS,
  EDIT_USER_SETTINGS,
  // --nutritional search
  // -- --send nutritional search request
  GET_NUTRITION,
  // -- --save parsed search request
  SAVE_NUTRITION_QRY,
  // -- --save nutrition analysis
  SAVE_NUTRITION_RES,
  // --recipe search
  // -- --send autocomplete query string
  GET_RECIPE_QRY_AUTOCOMPLETE,
  // -- --update autocomplete dropdown list
  SET_RECIPE_AUTOCOMPLETE_LIST,
  // -- --send recipe search request
  GET_RECIPES,
  // -- --show recipe search result snippets
  GET_RECIPE_DETAIL,
  // -- --show detailed recipe
  SAVE_RECIPE,
  // -- --change password
  RESET_PASSWORD
} from "../../../actions/actionTypes";

import {
  updateObjProp,
  updateObjAddToArr
} from "../../../../utils/updateHelpers";

export const INIT_STATE = {
  userId: undefined,
  settings: {},
  current: {
    query: undefined,
    suggestions: []
  },
  saved: {
    queries: [],
    nutrition: [],
    recipes: []
  }
};

const userDataReducer = (state = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_SETTINGS:
      return { ...state, ...payload };
    case EDIT_USER_SETTINGS:
      return updateObjProp(state, payload, "settings");
    // { ...state, settings: state.settings.map(updates => {}) };
    // payload ---> { updates: {}}
    case GET_NUTRITION:
      return updateObjProp(state, payload, "current", "query");
    // {
    //   ...state,
    //   current: { ...state.current, [state.current.query]: payload }
    // };
    case SAVE_NUTRITION_QRY:
      return updateObjAddToArr(state, payload, "saved", "queries");
    // {
    //   ...state,
    //   saved: { ...state.saved, queries: [...state.saved.queries, payload] }
    // };
    case SAVE_NUTRITION_RES:
      return updateObjAddToArr(state, payload, "saved", "nutrition");
    // {
    //   ...state,
    //   saved: {
    //     ...state.saved,
    //     nutrition: [...state.saved.nutrition, payload]
    //   }
    // };
    case GET_RECIPE_QRY_AUTOCOMPLETE:
      return updateObjProp(state, payload, "current", "query");
    // {
    //   ...state,
    //   current: { ...state.current, [state.current.query]: payload }
    // };
    case SET_RECIPE_AUTOCOMPLETE_LIST:
      return updateObjProp(state, payload, "current", "suggestions");
    // {
    //   ...state,
    //   current: { ...state.current, [state.current.suggestions]: payload }
    // };
    case GET_RECIPES:
      return updateObjProp(state, payload, "current", "query");
    // {
    //   ...state,
    //   current: { ...state.current, [state.current.query]: payload }
    // };
    case GET_RECIPE_DETAIL:
      return updateObjProp(state, payload, "current", "query");
    // {
    //   ...state,
    //   current: { ...state.current, [state.current.query]: payload }
    // };
    case SAVE_RECIPE:
      return updateObjAddToArr(state, payload, "saved", "recipe");
    // {
    //   ...state,
    //   saved: { ...state.saved, recipes: [...state.saved.recipes, payload] }
    // };
    case RESET_PASSWORD:
      return state;
    default:
      return state;
  }
};

export default userDataReducer;

// export const getUserPrefs = dispatch => () => {
//   //? check for userSettings in localStorage
//   //? request to fetch user settings from the Food And You server

//   dispatch({
//     type: GET_USER_SETTINGS,
//     payload: { settings: {}, current: {}, saved: {} }
//   });
// };

// export const setUserPrefs = dispatch => userSettingUpdates => {
//   //? request to update user settings in the Food And You server
//   //? update userSettings in localStorage as well

//   dispatch({
//     type: EDIT_USER_SETTINGS,
//     payload: { updates: {} }
//   });
// };

// export const getNutrition = dispatch => queryString => {
//   //? request to the Food and You server to start the nutrition analysis process
//   //? update the 'query/current/userData' in the localStorage

//   dispatch({
//     type: GET_NUTRITION,
//     payload: queryString
//   });
// };

// export const saveNutritionQuery = dispatch => nutriQuery => {
//   //? request to add the nutrition query to the users' 'saved' on the Food And You server
//   //? update the 'queries/saved/userData' in the localStorage

//   dispatch({
//     type: SAVE_NUTRITION_QRY,
//     payload: nutriQuery
//   });
// };

// export const saveNutritionResult = dispatch => nutriResult => {
//   //? request to add the nutrition result to the users' 'saved' on the Food And You server
//   //? update the 'nutrition/saved/userData' in the localStorage

//   dispatch({
//     type: SAVE_NUTRITION_RES,
//     payload: nutriResult
//   });
// };

// export const getRecipeAutocompletions = dispatch => initialQuery => {
//   //? request to the Food and You server to start the getting autocomplete suggestions for the initial query
//   //? update the 'query/current/userData' in the localStorage

//   dispatch({
//     type: GET_RECIPE_QRY_AUTOCOMPLETE,
//     payload: initialQuery
//   });
// };

// export const setRecipeAutocompletions = suggestions => ({
//   //? display nutrition query on the client
//   //? update the 'suggestions/current/userData' in the localStorage

//   type: SET_RECIPE_AUTOCOMPLETE_LIST,
//   payload: suggestions
// });

// export const getRecipes = dispatch => finalQuery => {
//   //? request to the Food and You server to start the getting recipes for the final query
//   //? update the 'query/current/userData' in the localStorage

//   dispatch({
//     type: GET_RECIPES,
//     payload: finalQuery
//   });
// };

// export const getRecipeDetails = dispatch => recipeId => {
//   //? request to the Food and You server to start the getting details for the selected recipe
//   //? update the 'query/current/userData' in the localStorage

//   dispatch({
//     type: GET_RECIPE_DETAIL,
//     payload: recipeId
//   });
// };

// export const saveRecipe = dispatch => recipeSnippet => {
//   //? request to add the recipe snippet to the users' 'saved' on the Food And You server
//   //? update the 'recipes/saved/userData' in the localStorage

//   dispatch({
//     type: SAVE_RECIPE,
//     payload: recipeSnippet
//   });
// };

// export const resetPassword = dispatch => email => {
//   //? request to Food And You server to begin the password reset process

//   dispatch({
//     type: RESET_PASSWORD,
//     payload: { message: `password_reset_request_status for ${email}` }
//   });
// };
