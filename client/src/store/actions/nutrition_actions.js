import {
  // Client App State modifying actions
  // -- -- set server sync app state
  SET_APP_STATE_SYNC_NUTRITION,
  // -- -- confirmation along with success Data
  CONFIRM_SUCCESS_SYNC_NUTRITION,
  // -- -- error Message for server sync app state
  REPORT_ERROR_SYNC_NUTRITION,
  // -- -- set current app state
  // SET_APP_STATE_PRIMARY,
  // -- -- confirmation Message
  // CONFIRM_SUCCESS_PRIMARY,
  // -- -- error Message
  REPORT_ERROR_PRIMARY,
  // --nutritional search
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
  CLEAR_CURRENT_NUTRITION_DATA
} from "./actionTypes.js";

// import noAuth_FAY from "../../apis/noAuth_FAY";
import withJWTAuth_FAY from "../../apis/withJWTAuth_FAY";
import googleAuth_FAY from "../../apis/googleAuth_FAY";
// import spoon_API from "../../apis/spoon_API";
import axios from "axios";
import querystring from "querystring";
// import { getEntrySummary } from "../../components/timeline_components/utils/seedEntires/calculations";

export const updateRecentQueryList = searchQuery => async (
  dispatch,
  getState
) => {
  //? request to add the nutrition snippet to the users' 'saved' on the Food And You server
  //? update the 'recentSearches/nutrition/userData' in the localStorage

  try {
    // dispatch({
    //   type: SET_APP_STATE_SYNC_NUTRITION,
    //   payload: {
    //     event: UPDATE_RECENT_QUERY_LIST
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

    const nutriResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "nutrition",
        updateKeyPath: ["saved", "recentSearches"],
        value: { ...searchQuery, date: new Date() }
      }
    );
    // let nutriResponse = { status: 200 };

    if (nutriResponse.status === 200) {
      dispatch({
        type: UPDATE_RECENT_QUERY_LIST,
        payload: searchQuery,
        persistInLocalStorage: true
      });
      // dispatch({
      //   type: CONFIRM_SUCCESS_SYNC_NUTRITION,
      //   persistInLocalStorage: true
      // });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_NUTRITION,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${UPDATE_RECENT_QUERY_LIST} - Error!`
    });
    console.log(err);
  }
};

export const getNutrition = queryString => async (dispatch, getState) => {
  //? request to the Food and You server to start the nutrition analysis process
  //? update the 'query/current/userData' in the localStorage

  try {
    // dispatch({
    //   type: SET_APP_STATE_PRIMARY,
    //   payload: {
    //     event: GET_NUTRITION
    //   },
    //   persistInLocalStorage: true
    // });
    dispatch({
      type: GET_NUTRITION,
      payload: queryString,
      persistInLocalStorage: true
    });

    let nutriResponse;
    // let sampleQueryString = `2 slices of pancake, 2 serving of orange marmalade`;
    let multiLinedQueryString = queryString.searchQuery.replace(/,/g, "\n");
    console.log({ ...queryString, multiLinedQueryString });

    nutriResponse = await axios.post(
      "https://api.spoonacular.com/recipes/parseIngredients",
      querystring.stringify({
        ingredientList: multiLinedQueryString,
        servings: 1, // queryString.servings
        includeNutrition: true
      }),
      {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    nutriResponse && console.log(nutriResponse.data);

    if (nutriResponse.status === 200) {
      // dispatch({
      //   type: CONFIRM_SUCCESS_PRIMARY,
      //   persistInLocalStorage: true
      // });
      dispatch({
        type: GET_NUTRITION,
        payload: { ...queryString, resData: nutriResponse.data },
        persistInLocalStorage: true
      });

      let token = getState().appData.auth.token;

      if (token) {
        updateRecentQueryList({ ...queryString, multiLinedQueryString })(
          dispatch,
          getState
        );
      }
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_PRIMARY,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${GET_NUTRITION} - Error!`
    });
    console.log(err);
  }
};

export const saveNutritionAnalysis = nutriResult => async (
  dispatch,
  getState
) => {
  //? request to add the nutrition result to the users' 'saved' on the Food And You server
  //? update the 'nutrition/saved/userData' in the localStorage

  try {
    dispatch({
      type: SET_APP_STATE_SYNC_NUTRITION,
      payload: {
        event: SAVE_NUTRITION_ANALYSIS
      }
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

    const nutriResponse = await selectedAuthService.patch(
      "/user/updateProfile",
      {
        updateCategory: "nutrition",
        updateKeyPath: ["saved", "savedAnalysis"],
        value: { ...nutriResult, date: new Date() }
      }
    );
    // let nutriResponse = { status: 200 };

    if (nutriResponse.status === 200) {
      dispatch({
        type: SAVE_NUTRITION_ANALYSIS,
        payload: nutriResult,
        persistInLocalStorage: true
      });
      dispatch({
        type: CONFIRM_SUCCESS_SYNC_NUTRITION,
        persistInLocalStorage: true
      });
    }
  } catch (err) {
    dispatch({
      type: REPORT_ERROR_SYNC_NUTRITION,
      payload:
        err.message ||
        (err.data && err.data.message) ||
        `${SAVE_NUTRITION_ANALYSIS} - Error!`
    });
    console.log(err);
  }
};

export const clearCurrentNutritionData = () => ({
  type: CLEAR_CURRENT_NUTRITION_DATA,
  persistInLocalStorage: true
});

export const setShowNutritionDetail = showState => ({
  type: SET_SHOW_NUTRITION_DETAIL,
  payload: showState,
  persistInLocalStorage: true
});

export const setShowRecipeDetail = showState => ({
  type: SET_SHOW_RECIPE_DETAIL,
  payload: showState,
  persistInLocalStorage: true
});
