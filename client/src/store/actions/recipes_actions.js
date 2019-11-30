import {
  // Client App State modifying actions
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_RECIPES,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_RECIPES,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_RECIPES,
  // -- -- set primary app state
  // SET_APP_STATE_PRIMARY,
  // -- -- confirmation along with success Data
  // CONFIRM_SUCCESS_PRIMARY,
  // -- -- error Message for primary app state
  REPORT_ERROR_PRIMARY,
  // -- -- set secondary app state
  // SET_APP_STATE_SECONDARY,
  // -- -- confirmation along with success Data
  // CONFIRM_SUCCESS_SECONDARY,
  // -- -- error Message for secondary app state
  REPORT_ERROR_SECONDARY,
  // Recipe AppData modifying actions
  // -- --send autocomplete query string
  GET_RECIPE_QRY_AUTOCOMPLETE,
  // -- --update autocomplete dropdown list
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
  CLEAR_CURRENT_RECIPES_DATA
} from "./actionTypes.js";

import axios from "axios";
// import noAuth_FAY from "../../apis/noAuth_FAY";
import withJWTAuth_FAY from "../../apis/withJWTAuth_FAY";
import googleAuth_FAY from "../../apis/googleAuth_FAY";

// import { storeDataInLocalStorage } from "../../utils/localStorageHelpers.js";

export const getRecipeAutocompletions = partialQuery => async dispatch => {
  //? request to the Food and You server to start the getting autocomplete suggestions for the initial query
  //? update the 'query/current/userData' in the localStorage

  try {
    // dispatch({
    //   type: SET_APP_STATE_SECONDARY,
    //   payload: {
    //     event: GET_RECIPE_QRY_AUTOCOMPLETE
    //   },
    //   persistInLocalStorage: true
    // });

    //? to clearup previous suggestions
    if (!partialQuery) {
      dispatch({
        type: GET_RECIPE_QRY_AUTOCOMPLETE,
        payload: [],
        persistInLocalStorage: true
      });
      // dispatch({
      //   type: CONFIRM_SUCCESS_SECONDARY,
      //   persistInLocalStorage: true
      // });
      return;
    }

    let recipeResponse;

    recipeResponse = await axios.get(
      // "https://api.spoonacular.com/recipes/auto",
      "https://api.spoonacular.com/recipes/autocomplete",
      {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          query: partialQuery,
          number: 10
        }
      }
    );

    if (recipeResponse.status === 200) {
      // console.log(recipeResponse.data);
      const suggestions = recipeResponse.data;
      // dispatch({
      //   type: CONFIRM_SUCCESS_SECONDARY,
      //   persistInLocalStorage: true
      // });
      dispatch({
        type: GET_RECIPE_QRY_AUTOCOMPLETE,
        payload: suggestions,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SECONDARY,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_RECIPE_QRY_AUTOCOMPLETE} - Error!`
    });
    console.log(err);
  }
};

export const updateRecentSearchList = searchQuery => async (
  dispatch,
  getState
) => {
  //? request to add the recipe snippet to the users' 'saved' on the Food And You server
  //? update the 'recentSearches/recipes/userData' in the localStorage
  try {
    // dispatch({
    //   type: SET_APP_STATE_SYNC_RECIPES,
    //   payload: {
    //     event: UPDATE_RECENT_RECIPES
    //   },
    //   persistInLocalStorage: true
    // });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const recipeResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "recipes",
        updateKeyPath: ["saved", "recentSearches"],
        value: { ...searchQuery, date: new Date() }
      }
    );
    // let recipeResponse = { status: 200 };

    if (recipeResponse.status === 200) {
      dispatch({
        type: UPDATE_RECENT_SEARCH_LIST,
        payload: searchQuery,
        persistInLocalStorage: true
      });
      // dispatch({
      //   type: CONFIRM_SUCCESS_SYNC_RECIPES,
      //   persistInLocalStorage: true
      // });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_RECIPES,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${UPDATE_RECENT_RECIPES} - Error!`
    });
    console.log(err);
  }
};

export const updateRecentRecipes = recipeListing => async (
  dispatch,
  getState
) => {
  //? request to add the recipe snippet to the users' 'saved' on the Food And You server
  //? update the 'recentSearches/recipes/userData' in the localStorage

  try {
    // dispatch({
    //   type: SET_APP_STATE_SYNC_RECIPES,
    //   payload: {
    //     event: UPDATE_RECENT_RECIPES
    //   },
    //   persistInLocalStorage: true
    // });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const recipeResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "recipes",
        updateKeyPath: ["saved", "recentRecipes"],
        value: recipeListing
      }
    );
    // let recipeResponse = { status: 200 };

    if (recipeResponse.status === 200) {
      dispatch({
        type: UPDATE_RECENT_RECIPES,
        payload: recipeListing,
        persistInLocalStorage: true
      });
      // dispatch({
      //   type: CONFIRM_SUCCESS_SYNC_RECIPES,
      //   persistInLocalStorage: true
      // });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_RECIPES,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${UPDATE_RECENT_RECIPES} - Error!`
    });
    console.log(err);
  }
};

export const getRecipes = finalQuery => async (dispatch, getState) => {
  //? request to the Food and You server to start the getting recipes for the final query
  //? update the 'query/current/userData' in the localStorage

  try {
    // dispatch({
    //   type: SET_APP_STATE_PRIMARY,
    //   payload: {
    //     event: GET_RECIPES
    //   },
    //   persistInLocalStorage: true
    // });
    dispatch({
      type: GET_RECIPES,
      payload: { finalQuery },
      persistInLocalStorage: true
    });

    let recipeResponse;
    // let token = getState("appData").appData.auth.token;
    //* If authenticated, then send the request to /recipes/search
    //* along with filtered list of diet (restrictions) and intolerances (allergens)

    const {
      searchQuery,
      diet,
      intolerances,
      cuisine,
      excludeIngredients,
      pagination
    } = finalQuery;

    recipeResponse = await axios.get(
      "https://api.spoonacular.com/recipes/search",
      {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          query: searchQuery,
          diet,
          intolerances,
          cuisine,
          excludeIngredients,
          offset: (pagination && pagination.offset) || 0, //* Change for additional paging
          number: (pagination && pagination.number) || 12,
          instructionsRequired: true
        }
      }
    );

    // console.log(recipeResponse);

    if (recipeResponse.status === 200) {
      const recipes = recipeResponse.data && recipeResponse.data.results;
      let tempResponse = { ...recipeResponse.data };
      delete tempResponse.results;
      console.log({ searchQuery });
      console.log(recipeResponse.data);
      console.log({
        finalQuery,
        recipes,
        queryMeta: tempResponse
      });
      // dispatch({
      //   type: CONFIRM_SUCCESS_PRIMARY,
      //   persistInLocalStorage: true
      // });

      dispatch({
        type: GET_RECIPES,
        payload: { finalQuery, recipes, queryMeta: tempResponse },
        persistInLocalStorage: true
      });

      let token = getState().appData.auth.token;

      if (token) {
        updateRecentSearchList({ ...finalQuery, date: new Date() })(
          dispatch,
          getState
        );
      }
    }
  } catch (err) {
    // console.log(err && err.response);
    dispatch({
      type: REPORT_ERROR_PRIMARY,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_RECIPES} - Error!`
    });
    console.log(err);
  }
};

export const getRecipeDetail = recipeId => async (dispatch, getState) => {
  //? request to the Food and You server to start the getting Detail for the selected recipe
  //? update the 'query/current/userData' in the localStorage
  try {
    // dispatch({
    //   type: SET_APP_STATE_SECONDARY,
    //   payload: {
    //     event: GET_RECIPE_DETAIL
    //   },
    //   persistInLocalStorage: true
    // });

    console.log({ recipeId });
    dispatch({
      type: GET_RECIPE_DETAIL,
      payload: { recipeId },
      persistInLocalStorage: true
    });

    let recipeResponse;
    // let token = getState().appData.auth.token;

    recipeResponse = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          id: recipeId,
          includeNutrition: true
        }
      }
    );

    if (recipeResponse.status === 200) {
      const recipeDetail = recipeResponse.data;
      // dispatch({
      //   type: CONFIRM_SUCCESS_SECONDARY,
      //   persistInLocalStorage: true
      // });
      dispatch({
        type: GET_RECIPE_DETAIL,
        payload: { recipeId, recipeDetail },
        persistInLocalStorage: true
      });

      let token = getState().appData.auth.token;

      if (token) {
        updateRecentRecipes({
          recipeId,
          title: recipeDetail.title,
          date: new Date()
        })(dispatch, getState);
      }
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SECONDARY,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_RECIPE_DETAIL} - Error!`
    });
    console.log(err);
  }
};

export const saveRecipeToFavorites = (recipeId, title) => async (
  dispatch,
  getState
) => {
  //? request to add the recipe snippet to the users' 'saved' on the Food And You server
  //? update the 'saved/recipes/userData' in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_RECIPES,
      payload: {
        event: SAVE_RECIPE
      },
      persistInLocalStorage: true
    });

    let token = getState().appData.auth.token;

    if (!token) {
      throw Error("Not Authenticated! Access Token Missing!");
    }

    let serviceType = getState().appData.auth.serviceType;
    let selectedAuthService = withJWTAuth_FAY; //? default serviceType === "JWT"
    if (serviceType === "GOOGLE") {
      selectedAuthService = googleAuth_FAY;
    }

    const recipeResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "recipes",
        updateKeyPath: ["saved", "favoriteRecipes"],
        value: { recipeId, title: title, date: new Date() }
      }
    );
    // let recipeResponse = { status: 200 };

    if (recipeResponse.status === 200) {
      dispatch({
        type: SAVE_RECIPE,
        payload: { recipeId, title: title, date: new Date() },
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_RECIPES,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_RECIPES,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${SAVE_RECIPE} - Error!`
    });
    console.log(err);
  }
};

export const setCurrentRecipeDetail = recipeDetail => ({
  type: SET_CURRENT_RECIPES_DETAIL,
  payload: recipeDetail,
  persistInLocalStorage: true
});

export const setCurrentTimelineRecipeDetail = timelineRecipeDetail => ({
  type: SET_CURRENT_TIMELINE_RECIPES_DETAIL,
  payload: timelineRecipeDetail,
  persistInLocalStorage: true
});

export const clearCurrentRecipesData = () => ({
  type: CLEAR_CURRENT_RECIPES_DATA,
  persistInLocalStorage: true
});
