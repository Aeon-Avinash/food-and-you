import {
  // -- --store user preferences
  GET_PREFERENCES,
  // -- --edit user preferences
  EDIT_PREFERENCES,
  // -- --logout
  LOGOUT
  // -- --logout from all devices
} from "../../../../actions/actionTypes";

// import { updateObjProp, updateObjAddToArr, updateObjRemoveFromArr, updateArrInObjAddOrReplaceById } from "../../../../../utils/updateHelpers";

export const INIT_STATE = {
  cuisine: "",
  diet: "",
  intolerances: "",
  excludeIngredients: ""
  // cuisineState: {
  //   African: { checked: false, value: "African" },
  //   American: { checked: false, value: "American" },
  //   British: { checked: false, value: "British" },
  //   Cajun: { checked: false, value: "Cajun" },
  //   Caribbean: { checked: false, value: "Caribbean" },
  //   Chinese: { checked: false, value: "Chinese" },
  //   "Eastern European": { checked: false, value: "Eastern European" },
  //   European: { checked: false, value: "European" },
  //   French: { checked: false, value: "French" },
  //   German: { checked: false, value: "German" },
  //   Greek: { checked: false, value: "Greek" },
  //   Indian: { checked: false, value: "Indian" },
  //   Irish: { checked: false, value: "Irish" },
  //   Italian: { checked: false, value: "Italian" },
  //   Japanese: { checked: false, value: "Japanese" },
  //   Jewish: { checked: false, value: "Jewish" },
  //   Korean: { checked: false, value: "Korean" },
  //   "Latin American": { checked: false, value: "American" },
  //   Mediterranean: { checked: false, value: "Mediterranean" },
  //   Mexican: { checked: false, value: "Mexican" },
  //   "Middle Eastern": { checked: false, value: "Middle Eastern" },
  //   Nordic: { checked: false, value: "Nordic" },
  //   Southern: { checked: false, value: "Southern" },
  //   Spanish: { checked: false, value: "Spanish" },
  //   Thai: { checked: false, value: "Thai" },
  //   Vietnamese: { checked: false, value: "Vietnamese" }
  // },
  // dietState: {
  //   "Gluten Free": { checked: false, value: "Gluten Free" },
  //   Ketogenic: { checked: false, value: "Ketogenic" },
  //   Vegetarian: { checked: false, value: "Vegetarian" },
  //   "Lacto-Vegetarian": { checked: false, value: "Lacto-Vegetarian" },
  //   "Ovo-Vegetarian": { checked: false, value: "Ovo-Vegetarian" },
  //   Vegan: { checked: false, value: "Vegan" },
  //   Pescetarian: { checked: false, value: "Pescetarian" },
  //   Paleo: { checked: false, value: "Paleo" },
  //   Primal: { checked: false, value: "Primal" },
  //   Whole30: { checked: false, value: "Whole30" }
  // },
  // intoleranceState: {
  //   Dairy: { checked: false, value: "Dairy" },
  //   Egg: { checked: false, value: "Egg" },
  //   Gluten: { checked: false, value: "Gluten" },
  //   Grain: { checked: false, value: "Grain" },
  //   Peanut: { checked: false, value: "Peanut" },
  //   Seafood: { checked: false, value: "Seafood" },
  //   Sesame: { checked: false, value: "Sesame" },
  //   Shellfish: { checked: false, value: "Shellfish" },
  //   Soy: { checked: false, value: "Soy" },
  //   Sulfite: { checked: false, value: "Sulfite" },
  //   "Tree Nut": { checked: false, value: "Tree Nut" },
  //   Wheat: { checked: false, value: "Wheat" }
  // },
  // excludeIngsState: ""
};

const preferencesReducer = (preferencesState = INIT_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT:
      return INIT_STATE;
    case GET_PREFERENCES:
      return { ...payload };
    case EDIT_PREFERENCES:
      return { ...preferencesState, ...payload };
    default:
      return preferencesState;
  }
};

export default preferencesReducer;
